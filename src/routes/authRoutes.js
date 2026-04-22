const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { onboardNibss } = require('../controllers/onboardController');

router.post('/register', register);
router.post('/login', login);
router.post('/onboard-nibss', onboardNibss);

module.exports = router;
