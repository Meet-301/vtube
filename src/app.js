import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express() //! new server instance of express application

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) //! for data that comes from json(it'll accept 16kb)
app.use(express.urlencoded({limit: "16kb"})) //! for data that comes from URL(it'll accept 16kb)
app.use(express.static("public")) //! for assets that will be available publicly via folder named "public"
app.use(cookieParser()) //! to set and get cookies in user browser

export default app