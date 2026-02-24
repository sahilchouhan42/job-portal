import Company from "../models/company.model.js"
import ApiResponse from "../utils/api.response.js"


export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body
        if (!companyName) return res.status(400).json(new ApiResponse(400, "Company name required"))

        //check exist company
        const existCompany = await Company.findOne({ name: companyName })
        if (existCompany) return res.status(400).json(new ApiResponse(400, "Company already exist"))

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

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId })
        if (!companies) return res.status(400).json(new ApiResponse(400, "No Companies Found"))

        return res.status(200).json(new ApiResponse(200, "All Companies fetched", companies))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

export const getCompanyById = async (req, res) => {
    try {   
        const { companyId } = req.params
        // console.log("req.params:", req.params)
        // console.log("company id:", req.params.id)
        const company = await Company.findById(companyId)
        if (!company) return res.status(400).json(new ApiResponse(400, "No Company Found"))

        return res.status(200).json(new ApiResponse(200, "Company details", company))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body
        const file = req.file
        //cloudinary later

        const updateData = { name, description, website, location }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true })

        if (!company) return res.status(400).json(new ApiResponse(400, "Company not found"))

        return res.status(200).json(new ApiResponse(200, "Company Updated Successfully", company))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Error"))
    }
}