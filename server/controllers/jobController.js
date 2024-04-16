const mongoose = require('mongoose');
const model  = require('../models/jobModel')
const User = require("../models/userModel");
const Job = model.Job;
// API
 module.exports.createJob = async(req,res)=>{
  try{
     const job = new Job(req.body);
     const id = req.body.user;
     console.log(job,id)
     const user = await User.findById(id);
     user.postedJobs.push(id);
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
  exports.getJob = async (req,res)=>{
    const id = req.params.id;
    try{
      const job = await Job.findById(id);  
      res.json(job).status(200)
      }
      catch(err){
        res.json(err).status(400)
      }
  }
  exports.replaceJob = async (req,res)=>{
    const id = req.params.id;
    try{
    const job = await Job.findOneAndReplace({_id:id},req.body,{new:true});  
    res.json(job).status(200)
    }
    catch(err){
      res.json(err).status(400)
    }
  }
  exports.updateJob = async(req,res)=>{
    const id = req.params.id;
    try{
    const job = await Job.findOneAndUpdate({_id:id},req.body,{new:true});  
    res.json(job).status(200)
    }
    catch(err){
      res.json(err).status(400)
    }
  }
  exports.deleteJob = async (req,res)=>{
    const id = req.params.id;
    
    try{
    const job = await Job.findOneAndDelete({_id:id});  
    res.json(job).status(200)
    }
    catch(err){
      res.json(err).status(400)
    }
  }

  exports.getAllJobPostsByUserId = async (req,res,next) => {
    try{
      const userId = req.params.userId;
      const jobs=await Job.find({user:userId}).populate([
        {
          path: 'user',
          model: 'User',
          select: 'postedJobs',
          populate : {
            path : 'postedJobs',
            model : 'Job'
        }
        },
      ]);
      return res.json(jobs);
    }catch( error )
    {
      next(error);
    }
  }
  