const db = require('../models/db');

// Create a transaction (Send time credits)
exports.createTransaction = async (req, res) => {
  const { from_user_id, to_user_id, service_id, time_transferred } = req.body;

  if (!from_user_id || !to_user_id || !service_id || !time_transferred) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if sender has enough credits
    const [sender] = await db.promise().query('SELECT time_credits FROM users WHERE id = ?', [from_user_id]);

    if (sender.length === 0 || sender[0].time_credits < time_transferred) {
      return res.status(400).json({ message: 'Insufficient time credits.' });
    }

    // Deduct credits from sender
    await db.promise().query('UPDATE users SET time_credits = time_credits - ? WHERE id = ?', [time_transferred, from_user_id]);

    // Add pending transaction
    await db.promise().query(
      'INSERT INTO transactions (from_user_id, to_user_id, service_id, time_transferred, status) VALUES (?, ?, ?, ?, "pending")',
      [from_user_id, to_user_id, service_id, time_transferred]
    );

    res.status(201).json({ message: 'Transaction created. Awaiting completion.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user transaction history
exports.getUserTransactions = async (req, res) => {
  const { userId } = req.params;

  try {
    const [transactions] = await db.promise().query(
      'SELECT t.*, u1.username AS sender, u2.username AS receiver, s.title FROM transactions t ' +
      'JOIN users u1 ON t.from_user_id = u1.id ' +
      'JOIN users u2 ON t.to_user_id = u2.id ' +
      'JOIN services s ON t.service_id = s.id ' +
      'WHERE from_user_id = ? OR to_user_id = ? ORDER BY t.id DESC',
      [userId, userId]
    );

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark transaction as completed
exports.completeTransaction = async (req, res) => {
  const { transactionId } = req.params;

  try {
    // Mark transaction as completed
    const [result] = await db.promise().query(
      'UPDATE transactions SET status = "completed" WHERE id = ? AND status = "pending"',
      [transactionId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Transaction not found or already completed.' });
    }

    // Credit the receiver
    const [transaction] = await db.promise().query(
      'SELECT to_user_id, time_transferred FROM transactions WHERE id = ?',
      [transactionId]
    );

    const { to_user_id, time_transferred } = transaction[0];

    await db.promise().query(
      'UPDATE users SET time_credits = time_credits + ? WHERE id = ?',
      [time_transferred, to_user_id]
    );

    res.status(200).json({ message: 'Transaction completed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
