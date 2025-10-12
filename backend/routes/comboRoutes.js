import express from "express";
import {
    getCombos,
    getComboById,
    createCombo,
    updateCombo,
    deleteCombo,
} from "../controllers/comboController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getCombos);
router.get("/:id", getComboById);
router.post("/", protect, adminOnly, createCombo);
router.put("/:id", protect, adminOnly, updateCombo);
router.delete("/:id", protect, adminOnly, deleteCombo);

export default router;
