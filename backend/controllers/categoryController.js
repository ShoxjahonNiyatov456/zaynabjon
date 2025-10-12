import Category from "../models/category.js";

// Barcha kategoriyalarni olish
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Bitta kategoriya olish
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Kategoriya topilmadi" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Yangi kategoriya yaratish
export const createCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: "Kategoriya nomi talab qilinadi" });
        }

        const category = new Category({ name: req.body.name });
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Kategoriya yangilash
export const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Kategoriya topilmadi" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Kategoriya o‘chirish
export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Kategoriya topilmadi" });
        }

        res.status(200).json({ message: "Kategoriya o‘chirildi" });
    } catch (error) {
        res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};
