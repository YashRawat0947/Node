const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
    try {
        if (!req.cookies.token) {
            return res.status(400).json({ success: false, message: "Login First" });
        } else {
            let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            req.user = data;
            next();
        }
    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};