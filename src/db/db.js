import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        
    }
}