const db = require('../models/db');

// Create service
exports.createService = async (req, res) => {
  const { user_id, title, description, time_required } = req.body;

  if (!user_id || !title || !description || !time_required) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    await db.promise().query(
      'INSERT INTO services (user_id, title, description, time_required) VALUES (?, ?, ?, ?)',
      [user_id, title, description, time_required]
    );
    res.status(201).json({ message: 'Service posted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const [services] = await db.promise().query(
      'SELECT s.*, u.username FROM services s JOIN users u ON s.user_id = u.id ORDER BY s.id DESC'
    );
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get services by user
exports.getServicesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const [services] = await db.promise().query(
      'SELECT * FROM services WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


