import Company from "../models/company.model.js"
import ApiResponse from "../utils/api.response.js"


export const registerCompany = async(req, res)=>{
    try {
        const {companyName} = req.body
        if(!companyName) return res.status(400).json(new ApiResponse(400, "Company name required"))
        
        //check exist company
        const existCompany = await Company.findOne({name: companyName})
        if(existCompany) return res.status(400).json(new ApiResponse(400, "Company already exist"))
        
        //create company
        const company = await Company.create({
            name: companyName,
            userId: req.id
        })

        return res.status(201).json(new ApiResponse(201, "Company registered Successfully", company))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

export const getCompany = async (req, res)=>{
    try {
        const userId = req.id;
        const companies = await Company.find({userId})
        if(!companies) return res.status(400).json(new ApiResponse(400, "No Companies Found"))

        return res.status(200).json(new ApiResponse(200, "All Companies fetched", companies))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

export const getCompanyById = async (req, res)=>{
    try {
        const companyId = req.params
        const company = await Company.findById(companyId)
        if(!company) return res.status(400).json(new ApiResponse(400, "No Company Found"))

        return res.status(200).json(new ApiResponse(200, "Company details", company))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}