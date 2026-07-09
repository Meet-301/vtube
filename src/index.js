import connectDB from "./db/db.js";
import dotenv from "dotenv"
import express from "express";
import dns from "dns";

//! Set DNS servers before any database connection
//! (force node.js to use trusted DNS resolution providers)
//! (e.g. cloudflare or google)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express()

dotenv.config({
    path: './env'
})

//! second approach
connectDB()

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