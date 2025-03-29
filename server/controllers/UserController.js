import Job from "../models/Job.js"
import Jobapplication from "../models/Jobapplications.js"
import User from "../models/User.js"
import {v2 as cloudinary} from 'cloudinary'

//get user data
export const getuserdata = async (req,res) => {
    const userId = req.auth.userId

    try {
        const user = await User.findById(userId)
        if(!user){
            res.json({success:false,message:"user not found"})
        }
        res.json({success:true,user})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//apply for a job
export const applyforjob = async (req, res) => {
    const { jobId } = req.body;
    const userId = req.auth?.userId; // Ensure `req.auth.userId` exists

    try {
        // Check if user already applied for the job
        const isAlreadyApplied = await Jobapplication.findOne({ jobId, userId });

        if (isAlreadyApplied) {
            return res.json({ success: false, message: 'Already applied' });
        }

        // Check if job exists
        const jobData = await Job.findById(jobId);
        if (!jobData) {
            return res.json({ success: false, message: 'Job not found' });
        }

        // Create a new job application
        await Jobapplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        });

        
        res.json({ success: true, message: 'Job application submitted' });

    } catch (error) {
        
        res.json({ success: false, message:error.message });
    }
};
//get user applied applications
export const getuserjobapplications = async (req,res) => {
    try {
        const userId = req.auth.userId
        const applications = await Jobapplication.find({ userId })
        .populate('companyId', 'name email image')
        .populate('jobId', 'title description location category level salary')
        .exec();
        if(!applications){
            return res.json({success:false,message:'no job applications found'})
        }
        return res.json({success:true,applications})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
//update user profile
export const updateuserresume = async (req,res) => {
    try {
        const userId = req.auth.userId
        const resumeFile = req.file
        const userData = await User.findById(userId)
        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }
        await userData.save()
        return res.json({success:true,message:'resume updated'})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}