//! express app configuration
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express() //! new server instance of express application

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json()) //! for data that comes from json(it'll accept 16kb)
app.use(express.urlencoded({ limit: "16kb", extended: true })) 
//! for data that comes from HTML form
app.use(express.static("public")) //! for assets that will be available publicly via folder named "public"
app.use(cookieParser()) //! to set and get cookies in user browser

//! routes import
import userRouter from "./routes/user.route.js"

//! routes declaration
app.use("/api/v1/users", userRouter)

export default app