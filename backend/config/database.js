import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB ulandi");
    } catch (error) {
        console.error("❌ MongoDB ulanishda xato:", error.message);
        process.exit(1);
    }
};

export default connectDB;
