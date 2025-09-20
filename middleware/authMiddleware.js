// middleware/authenticateToken.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    console.log(req.headers.authorization)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, "batman"); // Use .env in production
        req.user = { _id: decoded._id ,role: decoded.role }; 
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token, Hey! Please Login first" });
    }
};

module.exports = authenticateToken;
