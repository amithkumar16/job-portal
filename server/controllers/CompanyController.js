import Company from "../models/Company.js";
import Job from "../models/Job.js";  // ✅ Import Job model
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import dotenv from 'dotenv';
import Jobapplications from '../models/Jobapplications.js'; // Ensure the path is correct


dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imagefile = req.file;

  if (!name || !email || !password || !imagefile) {
    return res.json({ success: false, message: "Missing required data" });
  }

  try {
    const companyExist = await Company.findOne({ email });
    if (companyExist) {
      return res.json({ success: false, message: "Company already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imagefile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logincompany = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.json({ success: false, message: "Email and password are required" });
  }

  try {
    // Find company by email
    const company = await Company.findOne({ email });

    if (!company) {
      return res.json({ success: false, message: "Company not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }


    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyData = async (req, res) => {
  try {
    const company = req.company
    res.json({ success: true, company })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }



};

export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body
  const companyId = req.company._id
  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category
    });
    await newJob.save()
    res.json({ success: true, newJob })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
};

export const getCompanyJobapplications = async (req, res) => {
  try {
    const companyId = req.company._id;
    const applications = await Jobapplications.find({ companyId })
      .populate('userId', 'name image resume') // Populate user details
      .populate('jobId', 'title location category level salary') // Populate job details
      .exec();

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getCompanyPostedjobs = async (req, res) => {
  try {
    if (!req.company) {
      console.error("Company data is missing in request!");
      return res.status(401).json({ success: false, message: "Unauthorized - Company not found" });
    }

    const companyId = req.company._id;
    console.log("Fetching jobs for company ID:", companyId);

    // Fetch jobs posted by the company
    const jobs = await Job.find({ companyId });

    if (!jobs.length) {
      console.warn("No jobs found for company:", companyId);
    } else {
      console.log(`Found ${jobs.length} jobs for company ${companyId}`);
    }

    // Fetch applications for each job
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Jobapplications.find({ jobId: job._id });
        return { ...job.toObject(), applications: applications.length };
      })
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const changejobapplications = async (req, res) => {
 try {
  const {id,status} = req.body
 //find the job applications and update
 await Jobapplications.findOneAndUpdate({_id:id},{status})
 res.json({success:true,message:"Status changes"})
 } catch (error) {
  res.json({success:false,message:error.message})
 }

};




export const changeVisibilty = async (req, res) => {
  try {
    const { id } = req.body;

    console.log("🔍 Checking req.company:", req.company); // Debugging line

    if (!req.company) {
      return res.status(401).json({ success: false, message: "Unauthorized: Company not found" });
    }

    const companyId = req.company._id;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (companyId.toString() !== job.companyId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized: Cannot modify this job" });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error("Error in changeVisibilty:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
