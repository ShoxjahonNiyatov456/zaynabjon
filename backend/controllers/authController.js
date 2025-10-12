import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Token yaratish funksiyasi
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Ro‘yxatdan o‘tish
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // mavjud email tekshirish
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan" });
        }

        const user = await User.create({ username, email, password, role });

        res.status(201).json({
            message: "Ro‘yxatdan muvaffaqiyatli o‘tdi",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user),
        });
    } catch (error) {
        res.status(500).json({ message: "Ro‘yxatdan o‘tishda xato", error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Email yoki parol xato" });
        }

        res.json({
            message: "Login muvaffaqiyatli",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user),
        });
    } catch (error) {
        res.status(500).json({ message: "Login qilishda xato", error: error.message });
    }
};
