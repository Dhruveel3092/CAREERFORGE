const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const allowedOrigin = require('./config/allowedOrigin')
const app = express();
const socket = require("socket.io");
const Notification = require('./models/notifiSchema');
require("dotenv").config();

app.use(cors());
app.use(express.json());

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

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

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
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    //console.log(userId);
  });

  socket.on("send-msg", async (data) => {
    try{
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      const fg=data.msg + data.cat + data.naf;
       console.log(fg);
      const newNotification = new Notification({ 'user': data.to, 'message': fg });
      await newNotification.save();
      
     socket.to(sendUserSocket).emit("newNotification",newNotification);
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  }catch (error) {
    console.error('Error saving notification:', error.message);
  }
  });
  

});
