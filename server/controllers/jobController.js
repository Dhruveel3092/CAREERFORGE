const mongoose = require('mongoose');
const model  = require('../models/jobModel')
const User = require("../models/userModel");
const Job = model.Job;

// API
 module.exports.createJob = async(req,res)=>{
  try{
     const job = new Job(req.body);
     const id = req.body.user;
     console.log(job._id)
     const user = await User.findById(id);
     user.postedJobs.push(job._id);

     await user.save();
     await job.save();
     return res.json(job);
  }
  catch(err){
    console.log({err});
  }
  }
  module.exports.getAllJobs = async (req,res)=>{
    try{
      const jobs = await Job.find();
      console.log(jobs)
      res.json(jobs);
    }
    catch(err){
      console.log(err);
    }
  }
  module.exports.getJob = async (req,res)=>{
    const id = req.params.id;
    try{
      const job = await Job.findById(id);  
      res.json(job).status(200)
      }
      catch(err){
        res.json(err).status(400)
      }
  }
  module.exports.replaceJob = async (req,res)=>{
    const id = req.params.id;
    try{
    const job = await Job.findOneAndReplace({_id:id},req.body,{new:true});  
    res.json(job).status(200)
    }
    catch(err){
      res.json(err).status(400)
    }
  }
  module.exports.updateJob = async(req,res)=>{
    const id = req.params.id;
    try{
    const job = await Job.findOneAndUpdate({_id:id},req.body,{new:true});  
    res.json(job).status(200)
    }
    catch(err){
      res.json(err).status(400)
    }
  }
  module.exports.deleteJob = async (req,res)=>{
    const id = req.params.id;
    
    try{
    const job = await Job.findOneAndDelete({_id:id});  
    res.json(job).status(200)
    }
    catch(err){
      res.json(err).status(400)
    }
  }

  module.exports.getAllJobPostsByUserId = async (req,res,next) => {
    try{
      const userId = req.params.userId;
      const user=await User.findById(userId).populate(
        {
          path: 'postedJobs',
          model: 'Job',
        }
      );
      console.log(user.postedJobs);
      return res.json(user.postedJobs);
    }catch( error )
    {
      next(error);
    }
  }
  module.exports.getJobPosterById = async (req, res) => {
    try {
      const jobPostId = req.params.postId;
      const jobPoster = await Job.findOne({ _id: jobPostId }); // Use findOne instead of find
      if (jobPoster) {
        // Access the user field from the document
        const user = jobPoster.user;
        console.log(user);
        return res.json(user);
      } else {
        // Handle case when no document is found
        return res.status(404).json({ message: "Job poster not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  module.exports.addApplicantDetails = async (req,res) => {
     try{
      const jobPostId = req.params.jobPostId;
      const userId = req.body.userId;
      const resumeUrl = req.body.fileUrl;
     
      const job = await Job.findById(jobPostId);
       await job.applicants.push({userId : userId, resumeLink: resumeUrl});
       await job.save();
       console.log(job)
      res.json(job);
     }
     catch(err){
      console.log(err)
      res.json(err);
     }
  }
  module.exports.addAppliedJob = async (req,res) => {
     try{ 
      const appliedJobId = req.body.appliedJobId;
      const userId = req.params.userId;
      const user = await User.findById(userId);
      // Create an object with appliedJobId and ApplicationStatus
      const application = {
        AppliedJobId: appliedJobId,
        ApplicationStatus: "Pending"
    };
    // Push the application object into the appliedJobs array
      await user.appliedJobs.push(application);
      await user.save()
      console.log(application)
      return res.json(application);
     }
     catch(err){
      console.log(err);
      return res.json(err);
     }
   }
   module.exports.getAppliedJobsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('appliedJobs.AppliedJobId');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json(user.appliedJobs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


   module.exports.getStatusOfJobApplication = async (req, res) => {
       try {
           const userId = req.params.userId;
           const jobId = req.params.jobId;
   
           // Find the user by userId
           const user = await User.findById(userId);
   
           if (!user) {
               return res.status(404).json({ error: 'User not found' });
           }
   
           // Check if the user's appliedJobs array contains the jobId
           const jobIndex = user.appliedJobs.findIndex(appliedJob => String(appliedJob.AppliedJobId) === jobId);
   
           if (jobIndex !== -1) {
               return res.json(user.appliedJobs[jobIndex]); // Job found
           } else {
               return res.json({ AppliedJobId: null,ApplicationStatus: "Apply" }); // Job not found
           }
          } 
          catch(error) {
             console.log(error);
             return res.status(500).json({ error: 'Internal Server Error' });
          }
        };
   