import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import connectDB from "./utils/db.js"

const app = express()
connectDB()
//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
const corsOptions = {
    origin:"http//localhost:5173",
    credentials:true
}
app.use(cors(corsOptions))


const port = process.env.PORT



app.listen(port, ()=>console.log(`Server is running on ${port}`))