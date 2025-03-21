import { useState, useEffect } from "react";
import { fetchTransactions, sendTransaction } from "../api";
import "./Transactions.css"; // Import CSS file

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ to_user_id: "", service_id: "", time_transferred: "" });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You must be logged in to view transactions.");
        return;
      }
      const res = await fetchTransactions(user.id);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You must be logged in to send time credits.");
        return;
      }
      const transactionData = { ...form, from_user_id: user.id };
      await sendTransaction(transactionData);
      alert("Transaction sent successfully!");
      setForm({ to_user_id: "", service_id: "", time_transferred: "" });
      loadTransactions();
    } catch (err) {
      console.error("Error sending transaction:", err);
    }
  };

  return (
    <div className="transactions-container">
      <h2>Your Transactions</h2>
      <div className="transactions-list">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} className="transaction-card">
              <p>
                <strong>{tx.sender}</strong> → <strong>{tx.receiver}</strong>
              </p>
              <p className="transaction-service">Service: {tx.title}</p>
              <p className="transaction-time">⏳ {tx.time_transferred} min</p>
              <p className={`transaction-status ${tx.status}`}>
                Status: {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </p>
            </div>
          ))
        ) : (
          <p>No transactions yet.</p>
        )}
      </div>

      <h2>Send Time Credits</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="input-group">
          <input name="to_user_id" placeholder="Receiver User ID" value={form.to_user_id} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="service_id" placeholder="Service ID" value={form.service_id} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input name="time_transferred" placeholder="Time (mins)" value={form.time_transferred} onChange={handleChange} required />
        </div>
        <div className="button-container">
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}

export default Transactions;
