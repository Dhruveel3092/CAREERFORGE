const express = require('express');
const jobController = require('../controllers/jobController.js')
const router = require("express").Router();

router.get('/getAllJobs',jobController.getAllJobs)
.get('/getJob/:id',jobController.getJob)
.post('/addJob' ,jobController.createJob )
.put('/replaceJob:id',jobController.replaceJob)
.patch('/updateJob/:id',jobController.updateJob)
.delete('/deleteJob/:id',jobController.deleteJob)
.get("/getAllJobPostsByUserId/:userId",jobController.getAllJobPostsByUserId)
.get("/getJobPosterById/:postId",jobController.getJobPosterById)
.post("/addApplicantDetails/:jobPostId",jobController.addApplicantDetails)
.post("/addAppliedJob/:userId",jobController.addAppliedJob)
.get("/getAppliedJobsByUserId/:userId",jobController.getAppliedJobsByUserId)
.get("/getStatusOfJobApplication/:userId/:jobId",jobController.getStatusOfJobApplication);

module.exports = router;