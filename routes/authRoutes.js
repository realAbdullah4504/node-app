const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/protected', authenticate, authController.protected);

module.exports = router;
