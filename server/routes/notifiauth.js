const express=require('express')
const router=express()

const notifController = require('../controllers/notifController')
router.post('/get',notifController.getnotif)

//router.post('/send',notifController.send );
module.exports=router 