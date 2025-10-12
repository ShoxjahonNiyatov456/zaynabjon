import { v2 as cloudinary } from "cloudinary";
// Faylni Cloudinary ga upload qilish helper
export const uploadToCloudinary = (fileBuffer, folder = "products") => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
            .upload_stream({ folder }, (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            })
            .end(fileBuffer);
    });
};
