const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { isLoggedIn } = require('../middlewares/auth.middleware');

router.post('/', isLoggedIn, postController.createPost);
router.put('/edit/:postId', isLoggedIn, postController.editPost);

module.exports = router;