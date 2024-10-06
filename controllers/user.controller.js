const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/password.utils');

require('dotenv').config(); // Ensure environment variables are loaded

exports.signup = async (req, res) => {
    try {
        let { username, email, age, name, password } = req.body;

        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already registered" });
        }

        // Hash the password before saving
        const hashedPassword = await hashPassword(password);
        let newUser = await User.create({
            username,
            email,
            age,
            name,
            password: hashedPassword
        });
        
        // Sign the JWT token with the secret key
        const secretKey = process.env.JWT_SECRET; // Load the secret key from .env

        // Check if the secretKey is defined
        if (!secretKey) {
            throw new Error("JWT Secret Key is not defined");
        }

        let token = jwt.sign({ email: email, userid: newUser._id }, secretKey); // Signing the token

        // Set the token in a cookie
        res.cookie('token', token, { httpOnly: true }); // Use httpOnly for security
        return res.status(200).json({ success: true, message: "Signup Successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET);
            res.cookie('token', token);
            return res.status(200).json({ success: true, user });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.user.email }).populate('posts');
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.params.id; // Get the user ID from the route parameters

    try {
        // Find the user by ID
        let user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user fields from request body
        user.name = req.body.name || user.name; // Keep current name if not provided
        user.email = req.body.email || user.email; // Update email only if provided

        // If password is provided, hash it before saving
        if (req.body.password) {
            user.password = await hashPassword(req.body.password);
        }

        // Save the updated user
        await user.save();

        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};