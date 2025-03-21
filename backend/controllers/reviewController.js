const db = require('../models/db');

// Submit a Review
exports.submitReview = async (req, res) => {
  const { transaction_id, reviewer_id, service_id, rating, comment } = req.body;

  if (!transaction_id || !reviewer_id || !service_id || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Ensure the transaction is completed before allowing a review
    const [transaction] = await db.promise().query(
      'SELECT * FROM transactions WHERE id = ? AND status = "completed"',
      [transaction_id]
    );

    if (transaction.length === 0) {
      return res.status(400).json({ message: 'Transaction must be completed before leaving a review.' });
    }

    // Insert the review
    await db.promise().query(
      'INSERT INTO reviews (transaction_id, reviewer_id, service_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [transaction_id, reviewer_id, service_id, rating, comment]
    );

    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Reviews for a Service
exports.getServiceReviews = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const [reviews] = await db.promise().query(
      'SELECT r.*, u.username AS reviewer FROM reviews r JOIN users u ON r.reviewer_id = u.id WHERE r.service_id = ? ORDER BY r.created_at DESC',
      [serviceId]
    );

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
