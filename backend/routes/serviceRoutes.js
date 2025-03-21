const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Create a new service
router.post('/', serviceController.createService);

// Get all services
router.get('/', serviceController.getAllServices);

// Get services by user
router.get('/user/:userId', serviceController.getServicesByUser);

module.exports = router;
