import { messageInRaw } from "svix"
import Job from "../models/Job.js"

//get all jobs
export const getjobs = async (req,res) => {
    try {
        const jobs = await Job.find({visible:true})
        .populate({path:'companyId',select:'-password'})

        res.json({success:true,jobs})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//get a asinlgle job by id
export const getjobbyid = async (req,res) => {
    try {
        const {id}  = req.params
        const job = await Job.findById(id)
        .populate({
            path:'companyId',
            select:'-password'
        })
        if(!job){
            return res.json({
                success:false,
                message:'job not found'
            })
        }
        res.json({success:true,job})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
