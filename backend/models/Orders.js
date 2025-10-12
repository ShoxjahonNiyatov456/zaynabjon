import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
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
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "delivered", "cancelled"],
            default: "pending",
        },
        history: [
            {
                status: String,
                date: { type: Date, default: Date.now },
            },
        ],
        products: [orderItemSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
