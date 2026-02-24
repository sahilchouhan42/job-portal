import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/db.js"
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"

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

//api's
app.use('/api/v1/user', userRoute)
app.use('/api/v1/company', companyRoute)



app.listen(port, ()=>console.log(`Server is running on ${port}`))