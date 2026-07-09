import connectDB from "./db/db.js";
import dotenv from "dotenv";
import dns from "dns";
import app from "./app.js";

//! Set DNS servers before any database connection
//! (force node.js to use trusted DNS resolution providers)
//! (e.g. cloudflare or google)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.on("e", (error) => {

    })
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((error) => console.log(`DB Connection Error: ${error}`))