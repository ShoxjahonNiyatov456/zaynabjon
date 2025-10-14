import Product from "../models/Product.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";

// @desc Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Mahsulotlarni olishda xatolik:", error);
        res.status(500).json({ message: "Mahsulotlarni olishda server xatoligi" });
    }
};

// Get product by id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
        res.json(product);
    } catch (error) {
        console.error(`ID=${req.params.id} bo'lgan mahsulotni olishda xatolik:`, error);
        res.status(500).json({ message: "Mahsulotni olishda server xatoligi" });
    }
};

// Create product
export const createProduct = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);

        // Majburiy maydonlarni tekshirish
        if (!req.body.name || !req.body.price || !req.body.category) {
            return res.status(400).json({
                message: "Mahsulot yaratish uchun name, price va category maydonlari talab qilinadi"
            });
        }

        let uploadedImages = [];

        if (req.files && req.files.images && req.files.images.length > 0) {
            // Har bir fayl uchun
            for (const file of req.files.images) {
                try {
                    if (!file.buffer || file.buffer.length === 0) {
                        console.error("Empty file buffer detected");
                        continue; // Bo'sh fayllarni o'tkazib yuborish
                    }

                    const imageUrl = await uploadToCloudinary(file.buffer);
                    if (imageUrl) {
                        uploadedImages.push(imageUrl);
                    }
                } catch (uploadError) {
                    console.error("Rasm yuklashda xatolik:", uploadError);
                    // Xatolik bo'lsa ham davom etamiz, lekin xatoni log qilamiz
                }
            }
        }

        const product = new Product({
            name: req.body.name,
            images: uploadedImages,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Mahsulot yaratishda xatolik:", error);
        res.status(500).json({ message: "Mahsulot yaratishda server xatoligi", error: error.message });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });

        let uploadedImages = product.images || [];
        if (req.files && req.files.images) {
            uploadedImages = await Promise.all(
                req.files.images.map((file) => uploadToCloudinary(file.buffer))
            );
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                images: uploadedImages
            },
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//  Delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });

        await product.deleteOne();
        res.json({ message: "Mahsulot muvaffaqiyatli o'chirildi" });
    } catch (error) {
        console.error(`ID=${req.params.id} bo'lgan mahsulotni o'chirishda xatolik:`, error);
        res.status(500).json({ message: "Mahsulotni o'chirishda server xatoligi", error: error.message });
    }
};
