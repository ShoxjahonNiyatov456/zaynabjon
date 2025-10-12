import jwt from "jsonwebtoken";

// Tokenni tekshirish
export const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
        token = token.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Token yaroqsiz yoki muddati tugagan" });
        }
    } else {
        return res.status(401).json({ message: "Token topilmadi" });
    }
};

// Faqat admin uchun
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Faqat admin ruxsatiga ega" });
    }
};
