const express = require('express');
const { Login, signUp } = require('../controllers/AuthControllers');
const router = express.Router();

router.get('/login', Login);
router.post('/signUp', signUp);

module.exports = router;