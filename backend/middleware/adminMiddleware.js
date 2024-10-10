// backend/middleware/adminMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.AdminAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        console.log("Authorization Header:", authHeader); // Debugging

        if (!authHeader) {
            return res.status(403).json({ message: "Authorization header not found" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Invalid Authorization format" });
        }

        const token = authHeader.replace("Bearer ", "").trim();
        console.log("Token:", token); // Debugging

        if (!token) {
            return res.status(403).json({ message: "Token not found" });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("JWT Payload:", payload); // Debugging

        req.adminId = payload.adminId; // Ensure consistency with token signing
        next();
    } catch (error) {
        console.error("AdminAuth Middleware Error:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token",
        });
    }
};
