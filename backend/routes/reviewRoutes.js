const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Submit a review
router.post('/', reviewController.submitReview);

// Get reviews for a service
router.get('/service/:serviceId', reviewController.getServiceReviews);

module.exports = router;
