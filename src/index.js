import connectDB from "./db/db";
import dotenv from "dotenv"
import express from "express";

const app = express()

//! first approach
// ( () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("Error: ", error);
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`app is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("Error: ", error)
//     }
// } )()