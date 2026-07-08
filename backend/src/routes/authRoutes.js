const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public login and registration routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected invite route (Administrator only)
router.post('/invite', authenticateToken, authorizeRole(['Administrator']), authController.inviteUser);

module.exports = router;
