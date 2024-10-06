const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isLoggedIn } = require('../middlewares/auth.middleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/profile', isLoggedIn, userController.getProfile);
router.put('/update/:id', isLoggedIn, userController.updateProfile);

module.exports = router;