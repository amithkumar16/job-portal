import mongoose from "mongoose";

const connectdb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/myDatabase'); // Replace "myDatabase" with your DB name
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export default connectdb;
