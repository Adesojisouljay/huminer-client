import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { claimRewardsThunk } from "../../redux/userSlice";
import "./index.css";

export default function WalletPage() {

  const { activeUser } = useSelector((state) => state.huminer);
  const dispatch = useDispatch()

  console.log("activeUser...", activeUser)

  const [balance, setBalance] = useState(2500);
  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, bankName: "GTBank", accountNumber: "0123456789", accountName: "Soji Music" }
  ]);
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Top Up", amount: 5000, date: "2025-08-10" },
    { id: 2, type: "Tip Received", amount: 1500, date: "2025-08-09" },
    { id: 3, type: "Withdrawal", amount: 2000, date: "2025-08-08" }
  ]);

  const [showModal, setShowModal] = useState(null); // 'topup', 'withdraw', 'bank' or null
  const [formData, setFormData] = useState({});

  const handleModalSubmit = () => {
    if (showModal === "topup") {
      setBalance(prev => prev + Number(formData.amount || 0));
      setTransactions(prev => [
        { id: Date.now(), type: "Top Up", amount: Number(formData.amount), date: new Date().toISOString().split("T")[0] },
        ...prev
      ]);
    }
    if (showModal === "withdraw") {
      setBalance(prev => prev - Number(formData.amount || 0));
      setTransactions(prev => [
        { id: Date.now(), type: "Withdrawal", amount: Number(formData.amount), date: new Date().toISOString().split("T")[0] },
        ...prev
      ]);
    }
    if (showModal === "bank") {
      setBankAccounts(prev => [
        ...prev,
        { id: Date.now(), bankName: formData.bankName, accountNumber: formData.accountNumber, accountName: formData.accountName }
      ]);
    }

    setFormData({});
    setShowModal(null);
  };

  const handleClaimRewards = async () => {
    dispatch(claimRewardsThunk());
  };

  return (
    <div className="wallet-page">
      {/* Wallet Balance */}
      <div className="wallet-balance card">
        <h2>Wallet Balance</h2>
        <p className="balance-amount">₦{activeUser.accountBalance}</p>
        {activeUser.pendingRewards > 0 && <>
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
              <li key={acc.id}>
                <strong>{acc.bankName}</strong> — {acc.accountNumber} ({acc.accountName})
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
              <button onClick={handleModalSubmit}>Submit</button>
              <button className="cancel" onClick={() => setShowModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
