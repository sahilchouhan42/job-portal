import Application from "../models/application.model.js"
import Job from "../models/job.model.js"


export const applyJons = async (req, res)=>{
    try {
        const userId = req.id
        const jobId = req.params.id

        if(!jobId) return res.status(400).json({success: false, message: "Job id is required"})
        
        //check if the user has already applied for the job
        const exisitingApplication = await Application.findOne({job: jobId, applicant:userId})
        if(exisitingApplication) return res.status(400).json({success: false, message: "You have already applied for the job"})

        //find job
        const job = await Job.findById(jobId)
        if(!job) return res.status(400).json({success: false, message: "Job not found"})

        //create new application
        const newApplication = await Application.create({
            job:jobId,
            applicant: userId,
        })

        job.applications.push(newApplication._id)
        await job.save()

        return res.status(201).json({success: true, message: "Job applied successfully"})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false, message: "Internal Server Error"})
    }
}