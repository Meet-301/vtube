import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express() //! new server instance of express application

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

export default app