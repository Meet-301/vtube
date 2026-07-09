import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`connected database! DB host: ${conn.connection.host}`);
        
    } catch (error) {
        console.log(`Connection error: ${error}`);
        process.exit(1)
    }
}

export default connectDB