const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
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
  .connect(process.env.MONGO_URL, {
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

passport.use(
  new OAuth2Strategy({
      clientID: process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET,
      callbackURL:"/auth/google/callback",
      scope:["profile","email"]
  },
  async (accessToken,refreshToken,profile,done)=>{
      try {
          let user = await User.findOne({email:profile.emails[0].value});
         // console.log("jii")
          if(!user){
              user = new User({
                  username:profile.displayName,
                  email:profile.emails[0].value,
                  avatarImage:profile.photos[0].value
              
              });

              await user.save();
          }

          return done(null,user)
      } catch (error) {
          return done(error,null)
      }
  }
  )
)

passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((user,done)=>{
  done(null,user);
});


app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    failureRedirect:"http://localhost:3000/login"
}),
async (req, res) => {
 //  console.log("hii")
  const user=req.user;
  //console.log(user)
  const token = await user.generateAuthToken();

 // console.log(token)
  res.cookie("jwt",token,{
    expires:new Date(Date.now() + 1200000),
    httpOnly:false,
   });
  res.redirect('http://localhost:3000/home')
})


app.get("/login/sucess",async(req,res)=>{
  try {
    //console.log("i am here");
    
    const token=req.cookies.jwt;
    const verifyuser= jwt.verify(token,process.env.Secret_Key);
    const user= await User.findOne({email:verifyuser.email});
    req.user=user;
  
    //console.log(req,"lkklk");
    res.status(200).json({message:"user Login",user:req.user})
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


const server = app.listen(8080, () =>
  console.log(`Server started on 8080`)
); 


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
  if (sendUserSocket) {
    const fg=data.msg + data.cat + data.naf;
     console.log(fg);
    const newNotification = new Notification({ 'user': data.to, 'message': fg });
    await newNotification.save();
    
socket.to(sendUserSocket).emit("newNotification",newNotification);
  }
}catch(error){
  console.error('Error saving notification:', error.message);
}


  })
  

});
app.set("io",io)
