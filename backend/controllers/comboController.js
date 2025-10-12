import Combo from "../models/Kombo.js";

// GET /combos → ro‘yxat
export const getCombos = async (req, res) => {
    try {
        const combos = await Combo.find().sort({ createdAt: -1 });
        res.status(200).json(combos);
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error });
    }
};

// GET /combos/:id → bitta combo
export const getComboById = async (req, res) => {
    try {
        const combo = await Combo.findById(req.params.id);
        if (!combo) return res.status(404).json({ message: "Combo topilmadi" });
        res.status(200).json(combo);
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error });
    }
};

// POST /combos → yangi qo‘shish
export const createCombo = async (req, res) => {
    try {
        const combo = new Combo(req.body);
        await combo.save();
        res.status(201).json(combo);
    } catch (error) {
        res.status(400).json({ message: "Xato", error });
    }
};

// PUT /combos/:id → yangilash
export const updateCombo = async (req, res) => {
    try {
        const combo = await Combo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!combo) return res.status(404).json({ message: "Combo topilmadi" });
        res.status(200).json(combo);
    } catch (error) {
        res.status(400).json({ message: "Yangilashda xato", error });
    }
};

// DELETE /combos/:id → o‘chirish
export const deleteCombo = async (req, res) => {
    try {
        const combo = await Combo.findByIdAndDelete(req.params.id);
        if (!combo) return res.status(404).json({ message: "Combo topilmadi" });
        res.status(200).json({ message: "Combo o‘chirildi" });
    } catch (error) {
        res.status(500).json({ message: "O‘chirishda xato", error });
    }
};
