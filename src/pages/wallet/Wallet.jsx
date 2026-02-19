import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { claimRewardsThunk, addBankAccountThunk, deleteBankAccountThunk, updateUserBalance } from "../../redux/userSlice";
import { usePaystackPayment } from "react-paystack";
import { API as axios } from "../../api/axios";
import "./index.css";

export default function WalletPage() {

  const { activeUser } = useSelector((state) => state.huminer);
  const dispatch = useDispatch()

  const [balance, setBalance] = useState(activeUser?.accountBalance || 0);

  // Use real bank accounts from Redux
  const bankAccounts = activeUser?.bankAccounts || [];

  const [transactions, setTransactions] = useState([]); // Ideally fetch from backend

  const [showModal, setShowModal] = useState(null); // 'topup', 'withdraw', 'bank' or null
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // PAYSTACK SCRIPT LOAD
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onPaystackSuccess = async (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
    try {
      const token = localStorage.getItem("huminerToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post("/payment/deposit/verify", { reference: reference.reference }, config);
      alert("Deposit Successful!");
      setBalance(res.data.balance);
      // dispatch action to update user in redux
      // We might need a generic update action or just reload profile
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Payment verified mechanisms failed. Please contact support.");
    }
  };

  const onPaystackClose = () => {
    console.log('closed')
  }

  const handleModalSubmit = async () => {
    if (showModal === "topup") {
      setLoading(true);
      try {
        const amount = Number(formData.amount);
        if (!amount) return alert("Enter amount");

        // 1. Initialize on Backend
        const token = localStorage.getItem("huminerToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.post("/payment/deposit/initialize", { amount }, config);
        const { reference, email, publicKey } = res.data;

        // 2. Trigger Payment Directly
        const paymentConfig = {
          reference,
          email,
          amount: amount * 100, // Convert to kobo
          publicKey: publicKey || process.env.REACT_APP_PAYSTACK_PUBLIC_KEY
        };

        const handler = window.PaystackPop.setup({
          key: paymentConfig.publicKey,
          email: paymentConfig.email,
          amount: paymentConfig.amount,
          ref: paymentConfig.reference,
          callback: (transaction) => {
            onPaystackSuccess(transaction);
          },
          onClose: () => {
            onPaystackClose();
          }
        });
        handler.openIframe();

        setLoading(false);
        setShowModal(null);

      } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || "Failed to initialize deposit";
        alert(errorMsg);
        setLoading(false);
      }
    }

    if (showModal === "withdraw") {
      // ... existing withdraw logic ...
      setBalance(prev => prev - Number(formData.amount || 0));
      setShowModal(null);
    }

    if (showModal === "bank") {
      setLoading(true);
      try {
        await dispatch(addBankAccountThunk({
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName
        })).unwrap();

        setFormData({});
        setShowModal(null);
        alert("Bank account added successfully!");
      } catch (error) {
        alert(error || "Failed to add bank account");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteBank = async (bankId) => {
    if (window.confirm("Are you sure you want to delete this bank account?")) {
      try {
        await dispatch(deleteBankAccountThunk(bankId)).unwrap();
        alert("Bank account deleted.");
      } catch (error) {
        alert(error || "Failed to delete account");
      }
    }
  };

  const handleClaimRewards = async () => {
    dispatch(claimRewardsThunk());
  };

  return (
    <div className="wallet-page">
      {/* Wallet Balance */}
      <div className="wallet-balance card">
        <h2>Wallet Balance</h2>
        <p className="balance-amount">₦{activeUser?.accountBalance?.toLocaleString()}</p>
        {activeUser?.pendingRewards > 0 && <>
          <p>Pending rewards: {activeUser.pendingRewards}</p>
          <button onClick={handleClaimRewards}>Claim</button>
        </>}
      </div>

      {/* Action Buttons */}
      <div className="wallet-actions">
        <button onClick={() => setShowModal("topup")}>Top Up</button>
        <button onClick={() => setShowModal("withdraw")}>Withdraw</button>
        <button onClick={() => setShowModal("bank")}>Add Bank Account</button>
      </div>

      {/* Bank Accounts */}
      <div className="bank-accounts card">
        <h3>Bank Accounts</h3>
        {bankAccounts.length === 0 ? (
          <p>No bank accounts linked.</p>
        ) : (
          <ul>
            {bankAccounts.map((acc) => (
              <li key={acc._id} className="bank-item">
                <div>
                  <strong>{acc.bankName}</strong> — {acc.accountNumber} ({acc.accountName})
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBank(acc._id)}
                  aria-label="Delete bank account"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Transaction History */}
      <div className="transaction-history card">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.type}</td>
                  <td>₦{tx.amount.toLocaleString()}</td>
                  <td>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="wallet-modal modal">
            <h3>
              {showModal === "topup" && "Top Up Wallet"}
              {showModal === "withdraw" && "Withdraw Funds"}
              {showModal === "bank" && "Add Bank Account"}
            </h3>

            {showModal !== "bank" && (
              <input
                type="number"
                placeholder="Amount (₦)"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            )}

            {showModal === "bank" && (
              <>
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={formData.bankName || ""}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  value={formData.accountNumber || ""}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Account Name"
                  value={formData.accountName || ""}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                />
              </>
            )}

            <div className="modal-actions">
              <button onClick={handleModalSubmit} disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </button>
              <button className="cancel" onClick={() => setShowModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
