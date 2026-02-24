import Job from "../models/job.model.js"
import ApiResponse from "../utils/api.response.js"

//for admin
export const postJob = async (req, res)=>{
    try {
        const {title, description, requirements, salary, location, jobType, position, experience, companyId} = req.body
        const userId = req.id

        if(!title||!description||!requirements||!salary||!location||!jobType||!position||!companyId||!experience) return res.status(400).json(new ApiResponse(400, "All fields required"))

        //create Job
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            position,
            experienceLevel: experience,
            company: companyId,
            created_by: userId
        })

        return res.status(201).json(new ApiResponse(201, "Job Created Successfully", job))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

//student
export const getAllJobs = async (req, res)=>{
    try {
        const keyword = req.query.keyword||"";
        const query = {
            $or:[
                {title:{$regex: keyword, $options: "i"}},
                {description:{$regex: keyword, $options: "i"}}
            ]
        }

        const jobs = await Job.find(query)
        if(!jobs) return res.status(400).json(new ApiResponse(400, "No jobs found"))

        return res.status(200).json(new ApiResponse(200, "Fetched All  Jobs", jobs))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}

//student
export const getJobById = async (req, res)=>{
    try {
        const jobId = req.params.id
        const job = await Job.findById(jobId)
        if(!job) return res.status(400).json(new ApiResponse(400, "Jon not found"))
        
        return res.status(200).json(new ApiResponse(200, "Job Found", job))
    } catch (error) {
     console.log(error.message)
     return res.status(500).json(new ApiResponse(500, "Internal Server Error"))   
    }
}

//how much job has been created by admin
export const getAdminJobs = async (req, res)=>{
    try {
        const adminId = req.id
        const jobs = await Job.find({created_by: adminId})

        if(!jobs) return res.status(400).json(new ApiResponse(400, "No Jobs found"))
        
        return res.status(200).json(new ApiResponse(200, "Jobs by admin", jobs))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(new ApiResponse(500, "Internal Server Error"))
    }
}
