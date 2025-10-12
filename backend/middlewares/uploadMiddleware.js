import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Cloudinary storage sozlamalari
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products", // Cloudinary ichida papka nomi
        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
        transformation: [{ quality: "auto", fetch_format: "auto" }], // avtomatik optimallashtirish
    },
});

const upload = multer({ storage });

export default upload;
