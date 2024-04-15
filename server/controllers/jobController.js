const mongoose = require('mongoose');
const model  = require('../models/jobModel')
const Job = model.Job;
// API
 exports.createJob = async(req,res)=>{
     const job = new Job(req.body);
     
     await job.save().then(j=>res.status(201).json(j)).catch(err=>res.json(err));
  }
  exports.getAllJobs = async (req,res)=>{
    try{
      const jobs = await Job.find();
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