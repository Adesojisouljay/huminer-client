// utility function
export const getDaysUntilPayout = (payoutAt) => {
    if (!payoutAt) return null;
    const now = new Date();
    const payoutDate = new Date(payoutAt);
    const diffTime = payoutDate - now; // difference in ms
    if (diffTime <= 0) return "Paid out";
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? "s" : ""} left until payout`;
  };
  