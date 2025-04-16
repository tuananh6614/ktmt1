
const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Protected routes
router.get('/me', protect, userController.getMe);
router.put('/updatedetails', protect, userController.updateDetails);
router.put('/updatepassword', protect, userController.updatePassword);

module.exports = router;
