import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    { _id: false }
);

const comboSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        comboImage: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        products: {
            type: [productSchema],
            required: true,
            validate: [(val) => val.length > 0, "Kamida 1 ta mahsulot bo‘lishi kerak"],
        },
        comboPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        servings: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Combo", comboSchema);
