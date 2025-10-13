import express from "express";
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} from "../controllers/OrderController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, adminOnly, getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", protect, adminOnly, updateOrder);
router.delete("/:id", protect, adminOnly, deleteOrder);

export default router;
