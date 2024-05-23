const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");
const messageRoutes = require("./routes/messages");
const allowedOrigin = require('./config/allowedOrigin')
const app = express();
const socket = require("socket.io");
const passport=require('passport');
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("./models/userModel");
const jwt=require("jsonwebtoken")
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongodb-session')(session)
const Notification = require('./models/notifiSchema');
const path = require('path');
require('./config/passport')(passport);


require("dotenv").config();
const corsOptions ={
  origin: allowedOrigin, 
  credentials:true,            
  optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect( process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });


app.use("/api/messages", messageRoutes);


/*Google Sign in AUth*/ 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/login/sucess",async(req,res)=>{
  try {
    //console.log("i am here");

    const token=req.cookies.jwt;
    let islog=0;
    if(token){
    const verifyuser= jwt.verify(token,process.env.Secret_Key);
    const user= await User.findOne({email:verifyuser.email});
    user.tokens.map((e)=>{
      if(e.token==token) islog=1;
    });
    req.user=user;
    console.log(req.user)
    console.log(req,"lkklk");
    res.status(200).json({sta:islog,user:req.user})
    }
} catch (error) {
  console.log(error)
    res.status(401).send(error);
}
})

app.get("/check/:id",async(req,res)=>{
  try {
 
    const id=req.params.id;
    //const token=id;
    //console.log(token,"toke");
    if(id){
    const verifyuser= jwt.verify(id,process.env.Secret_Key);
    
    const user= await User.findOne({email:verifyuser.email});
    let k=false;
   // console.log(user,"user");
   user.tokens.map((tok)=>{ 
    console.log(tok);     
  if(tok!=undefined &&  tok.token==id) k=true;
  })

    
   // console.log(k,"lkklk");
  res.json({chk:k,user:req.user})

  }

} catch (error) {
  console.log(error)
    res.status(401).send(error);
}
})

// app.get("/logout",async (req,res)=>{
//   try {   //logout from single device
//     console.log(req)
//     const tokend=req.cookies.jwt;
//     req.user.tokens=req.user.tokens.filter((elem)=> (elem.token != tokend))
//     console.log(req.user.tokens,"logout")
//     //logout from multiple devices
//     //req.user.tokens=[];

// res.clearCookie("jwt");
//   console.log("Log Out Successfully");
//  await req.user.save();

// } catch (error) {
// res.status(500).send(error);
// }
// })

app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);

// app.use(express.static(path.join(__dirname, '/public/build')))

// app.get('*',(req,res) => {
//   res.sendFile(path.join(__dirname, 'public', 'build', 'index.html'));
// });


const server = app.listen(8080, () =>
  console.log(`Server started on 8080`)
); 

app.get("/",(req,res)=>{
  res.send("Server is working successfully !")
})


const io = socket(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  socket.on("add-user", async (userId) => {
   
    onlineUsers.set(userId, socket.id);

    //console.log(userId);
  });

  socket.on("send-msg", async (data) => {
    try{
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
//       const fg=data.msg + data.cat + data.naf;
//        console.log(fg);
//       const newNotification = new Notification({ 'user': data.to, 'message': fg });
//       await newNotification.save();
      
// socket.to(sendUserSocket).emit("newNotification",newNotification);i=1;
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  }catch (error) {
    console.error('Error saving notification:', error.message);
  }
  });
  
  socket.on("send-noti", async(data)=>{
try{
  const sendUserSocket = onlineUsers.get(data.to);
 
    const fg=data.msg + data.cat + data.naf;
     console.log(fg);
    const newNotification = new Notification({ 'user': data.to, 'message': fg });
    await newNotification.save();
    
socket.to(sendUserSocket).emit("newNotification",newNotification);
  
}catch(error){
  console.error('Error saving notification:', error.message);
}


  })
  

});
app.set("io",io)
