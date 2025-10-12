import express from "express";
import {
    getSettings,
    createSettings,
    updateSettings,
} from "../controllers/settingsController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getSettings);
router.post("/", protect, adminOnly, createSettings);
router.put("/", protect, adminOnly, updateSettings);

export default router;
