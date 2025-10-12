import Settings from "../models/Settings.js";

// GET /settings – barcha settinglarni olish
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /settings – yangi settings qo‘shish
export const createSettings = async (req, res) => {
    try {
        const newSettings = new Settings(req.body);
        const savedSettings = await newSettings.save();
        res.status(201).json(savedSettings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT /settings – settingsni yangilash
export const updateSettings = async (req, res) => {
    try {
        const updated = await Settings.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
        });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
