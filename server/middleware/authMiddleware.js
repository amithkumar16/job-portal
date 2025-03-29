import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';

export const protectcompany = async (req, res, next) => {
    try {
        // Extract the token from Authorization header (Bearer token format)
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging

        // Find the company by ID
        req.company = await Company.findById(decoded.id).select('-password');

        if (!req.company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        next(); // Move to the next middleware/controller
    } catch (error) {
        console.error("JWT verification error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired, please login again" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        res.status(500).json({ success: false, message: "Server error" });
    }
};
