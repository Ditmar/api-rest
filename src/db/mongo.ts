import mongoose from "mongoose";
export async function connectMongoDB() {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/seminario-2025-1";
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}