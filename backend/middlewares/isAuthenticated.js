import jwt from "jsonwebtoken"
import ApiResponse from "../utils/api.response.js"

const isAuthenticated = async (req, res, next)=>{
    try {
        const token = req.cookies.token
        if(!token) return res.status(401).json(new ApiResponse(401, "User not authenticated"))
        
        const decode = await jwt.verify(token,process.env.JWT_SECRET)
        if(!decode) return res.status(401).json(new ApiResponse(401, "Invalid Token"))
        
        req.id = decode.userId
        next()
    } catch (error) {
        console.log(error.message)
        return res.status(400).json("400", "Error in isAuthenticated")
    }
}

export default isAuthenticated