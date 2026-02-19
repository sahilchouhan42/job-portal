import User from "../models/user.model.js"
import ApiResponse from "../utils/api.response.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body
        if (!fullName || !email || !phoneNumber || !password || !role) return res.status(400).json(new ApiResponse(400, "All Fields are required"))

        //check exist user
        const existUser = await User.findOne({ email })
        if (existUser) return res.status(409).json(new ApiResponse(409, "User alreday exist"))

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        })

        return res.status(201).json(new ApiResponse(201, "User Registered Successfully", user))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json(new ApiResponse(400, "All fields required"))
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json(new ApiResponse(400, "User does not exist"))
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) return res.status(400).json(new ApiResponse(400, "Invalid Credentials"))

        //check role is correct or not
        if (role !== user.role) return res.status(400).json(new ApiResponse(400, "You are logging with different role"))

        //token generateion
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json(new ApiResponse(200, "Login Successfull", user))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

export const logout = async (req, res)=>{
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json(new ApiResponse(200, "Logout Successfully"))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

export const updateProfile = async (req, res)=>{
    try {
        const {fullName, email, phoneNumber, bio, skills} = req.body
        const file = req.file
        // if(!fullName||!email||!phoneNumber||!bio||!skills){
        //     return res.status(400).json(new ApiResponse(400, "All fields are required"))
        // }

        //cloudinary is here

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",")
        }
        const userId = req.id; //middleware authentication

        let user = await User.findById(userId)
        if(!user) return res.status(400).json(new ApiResponse(400, "User not found"))
        
        //updating user info
        if(fullName) user.fullName = fullName;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray

        //resume comes later here

        await user.save()

        return res.status(200).json(new ApiResponse(200, "User Updatd Successfully", user))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}