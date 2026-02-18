import User from "../models/user.model.js"
import ApiResponse from "../utils/api.response.js"
import bcrypt from "bcryptjs"


export const register = async (req, res)=>{
    try {
        const {fullName, email, phoneNumber, password, role} = req.body
        if(!fullName||!email||!phoneNumber||!password||!role) return res.status(400).json(new ApiResponse(400, "All Fields are required"))
        
        //check exist user
        const existUser = await User.findOne({email})
        if(existUser) return res.status(409).json(new ApiResponse(409, "User alreday exist"))

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        })

        return res.status(201).json(new ApiResponse(201, "User Registered Successfully"))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

