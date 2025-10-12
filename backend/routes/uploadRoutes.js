import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), uploadImage);

export default router;
