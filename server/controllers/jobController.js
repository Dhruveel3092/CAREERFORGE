const mongoose = require('mongoose');
const model  = require('../models/jobModel');
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const Job = model.Job;

// API
 module.exports.createJob = async(req,res)=>{
  try{
     const job = new Job(req.body);
     const id = req.body.user;
    
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
       await job.applicants.push({applicantId : userId, resumeLink: resumeUrl ,applicationStatus:"Pending"});
       await job.save();
       return res.json(job);
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
        appliedJobId: appliedJobId,
        applicationStatus: "Pending"
    };
    // Push the application object into the appliedJobs array
      await user.appliedJobs.push(application);
      await user.save()
     
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
        const user = await User.findById(userId).populate('appliedJobs.appliedJobId');
        
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
           const jobIndex = user.appliedJobs.findIndex(appliedJob => String(appliedJob.appliedJobId) === jobId);
   
           if (jobIndex !== -1) {
               return res.json(user.appliedJobs[jobIndex]); // Job found
           } else {
               return res.json({ appliedJobId: null,applicationStatus: "Apply" }); // Job not found
           }
          } 
          catch(error) {
             console.log(error);
             return res.status(500).json({ error: 'Internal Server Error' });
          }
        };
   module.exports.getApplicantsDetails = async (req,res) => {
     try{
      const jobId = await req.params.jobId;
     const job =  await Job.findById(jobId).populate('applicants.applicantId')
     if(job)
     return res.json(job.applicants);
    else 
      return res.status(404);
    }
    catch(err){
      res.json(err);
    }
   }

 module.exports.setApplicationStatus = async (req,res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.params.userId;
    const applicationStatus = req.body.applicationStatus;

    // Find the user by ID
    const user = await User.findById(userId).populate('appliedJobs');

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Find the index of the applied job in the appliedJobs array
    const appliedJobIndex = user.appliedJobs.findIndex(appliedJob => String(appliedJob.appliedJobId) === jobId);

    if (appliedJobIndex === -1) {
        return res.status(404).json({ error: 'Applied job not found' });
    }

    // Update the application status of the found applied job
    user.appliedJobs[appliedJobIndex].applicationStatus = applicationStatus;

    // Save the updated user document
    await user.save();
    
    const job = await Job.findById(jobId).populate('applicants');

    const applicantIndex = job.applicants.findIndex(applicant => String(applicant.applicantId) === userId);
    if(applicantIndex == -1){
      return res.status(404).json("Applicant not found");
    }
    job.applicants[applicantIndex].applicationStatus = applicationStatus;
    
    await job.save();

    return res.status(200).json({user,job});
} catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
}
};
    
module.exports.jobemail= async (req,res)=>{
  try {
    const id=req.params.id;
    const job = await Job.findById(id); 
    const em=job.user;
    const user=await User.findById(em);
    const cus=req.body.current;
    console.log(user.email,"recieveremail");
    console.log(cus,"appliername");
     
      if(user){

      var transporter = nodemailer.createTransport({
          service: 'gmail',
          port:465,
          secure:true,
          auth: {
            user: 'krishnamorker2021@gmail.com',
            pass: 'tahd pher pfkz ehla',
            tls:{
              rejectUnauthorized:true
             }
          }
        });
        
        var mailOptions = {
          from: 'SNAPPY',
          to: user.email,
          subject: 'JOB APPLICATION',
          text: `User name : ${cus} has applied for the job which you have posted on CarrerForge.`,
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      return res.json({ sta: true, em });
      }else{
        return res.json({ sta: false, em });
      }

  } catch (error) {
      res.status(401).send(error)
  }
  
}
    

 