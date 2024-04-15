const express = require('express');
const jobController = require('../controllers/jobController.js')
const router = require("express").Router();

router.get('/getJobs',jobController.getAllJobs)
.get('/getJob:id',jobController.getJob)
.post('/addJob' ,jobController.createJob )
.put('/replaceJob:id',jobController.replaceJob)
.patch('/updateJob:id',jobController.updateJob)
.delete('/deleteJob:id',jobController.deleteJob)

module.exports = router;