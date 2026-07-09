import connectDB from "./db/db.js";
import dotenv from "dotenv";
import dns from "dns";

//! Set DNS servers before any database connection
//! (force node.js to use trusted DNS resolution providers)
//! (e.g. cloudflare or google)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({
    path: './env'
})

connectDB()