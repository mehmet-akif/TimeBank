const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Send time credits (Create transaction)
router.post('/', transactionController.createTransaction);

// Get user transaction history
router.get('/user/:userId', transactionController.getUserTransactions);

// Mark transaction as completed
router.patch('/:transactionId', transactionController.completeTransaction);

module.exports = router;
