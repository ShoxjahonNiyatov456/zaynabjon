export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Rasm topilmadi" });
        }

        return res.json({
            success: true,
            url: req.file.path, // Cloudinary URL
            public_id: req.file.filename, // keyinchalik o‘chirish yoki update qilish uchun
        });
    } catch (error) {
        console.error("Upload xatosi:", error);
        return res.status(500).json({ success: false, message: "Server xatosi" });
    }
};
