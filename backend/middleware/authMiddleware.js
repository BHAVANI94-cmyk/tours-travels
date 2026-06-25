const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    try {

        let token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({
                message: "Access denied"
            });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7).trim();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

        req.user = verified;

        next();

    } catch (err) {

        res.status(400).json({
            message: "Invalid token"
        });

    }
};

module.exports = authMiddleware;