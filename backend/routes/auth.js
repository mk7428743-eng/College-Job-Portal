const express = require('express');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validator');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

// For profile update, we handle optional resume file upload
router.put('/profile', protect, upload.single('resume'), updateProfile);

module.exports = router;
