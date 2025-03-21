const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models/db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Time Bank API is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/transactions', transactionRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);
