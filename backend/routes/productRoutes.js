import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
    "/",
    protect,
    adminOnly,
    upload.fields([{ name: "images", maxCount: 5 }]),
    createProduct
);
router.put(
    "/:id",
    protect,
    adminOnly,
    upload.fields([{ name: "images", maxCount: 5 }]),
    updateProduct
);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
