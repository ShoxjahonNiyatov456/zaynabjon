import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        phonenumbers: {
            type: [String], // telefon raqamlar array
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        banner: {
            type: String, // banner rasmi URL
        },
        title: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            default: "uz", // default til
        },
        description: {
            type: String,
        },
        socialMediaLinks: {
            instagram: { type: String },
            telegram: { type: String },
        },
        logo: {
            type: String, // logo rasmi URL
        },
    },
    { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
