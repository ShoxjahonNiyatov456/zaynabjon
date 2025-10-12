import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import comboRoutes from "./routes/comboRoutes.js";
import orderRoutes from "./routes/ordersRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ JSON parser eng boshida bo‘lishi shart
app.use(express.json());

// ✅ Faqat bitta cors middleware
app.use(cors({
    origin: "http://localhost:3000", // frontendi manzili
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ OPTIONS so‘rovlar uchun tez javob
app.options("*", cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// ✅ Routes (pastda)
app.use("/settings", settingsRoutes);
app.use("/products", productRoutes);
app.use("/upload", uploadRoutes);
app.use("/categories", categoryRoutes);
app.use("/combos", comboRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`✅ Server ${PORT}-portda ishlayapti`));
