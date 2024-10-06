const Post = require('../models/post.model');
const User = require('../models/user.model');

exports.createPost = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.user.email });
        let { content } = req.body;
        let post = await Post.create({
            user: user._id,
            content: content,
        });
        user.posts.push(post._id);
        await user.save();
        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.editPost = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.user.email }).populate('posts');

        if (user.posts.length === 0) {
            return res.status(400).json({ success: false, message: "First create a post" });
        }

        let post = await Post.findOne({
            _id: req.params.postId,
            user: user._id,
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you don't have permission to edit this post",
            });
        }

        post.content = req.body.content;
        await post.save();

        res.status(200).json({ success: true, message: "Post updated successfully", post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};