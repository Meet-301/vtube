//! base file from which the server(or backend app) will be started
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import dns from "dns";
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import ApiResponse from "./utils/ApiResponse.js";

//! Set DNS servers before any database connection
//! (force node.js to use trusted DNS resolution providers)
//! (e.g. cloudflare or google)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({
   path: "./.env",
});

const server = createServer(app)

const io = new Server(server)

io.on("connection", (socket) => {
   console.log(`User connected: ${socket.id}`);
   
   socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
   })
})

connectDB().then(() => {
   app.on("error", (error) => {
      console.log(`Application failed: ${error}`);
   });

   const port = process.env.PORT || 5000;

   server.listen(port, () => {
      console.log(`Server is running at port ${port}`);
   });
});
