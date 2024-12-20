const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.UserAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        console.log("Authorization Header:", authHeader); 

        if (!authHeader) {
            return res.status(403).json({ message: "Authorization header not found" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Invalid Authorization format" });
        }

        const token = authHeader.replace("Bearer ", "").trim();
        console.log("Token:", token);
        console.log("Token Length:", token.length);

        if (!token) {
            return res.status(403).json({ message: "Token not found" });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("JWT Payload:", payload); 

        req.userId = payload.userId; 
        next();
    } catch (error) {
        console.error("UserAuth Middleware Error:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token",
        });
    }
};
