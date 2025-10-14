import cloudinary from "../config/cloudinary.js";
export const uploadToCloudinary = (fileBuffer, folder = "products") => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer || fileBuffer.length === 0) {
            return reject(new Error("Empty file"));
        }
        try {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder,
                        resource_type: "auto"
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                )
                .end(fileBuffer);
        } catch (error) {
            console.error("Cloudinary stream error:", error);
            reject(error);
        }
    });
};
