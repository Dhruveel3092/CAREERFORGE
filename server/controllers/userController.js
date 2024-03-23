const User = require("../models/userModel");
const Post = require("../models/postModel");
const bcrypt = require("bcrypt");
const connectSchema = require("../models/connectSchema.js");
const Connection = connectSchema;
const { connections } = require("mongoose");
const Notification = require('../models/notifiSchema');
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRETE,
  secure : true,
});

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
      "connections"
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

exports.pending = async (req, res) => {
  try {
    const newuser = req.body.newUser;

    const connections = await connectSchema.find({ receiverEmail: newuser });

    res.send(connections);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching pending connections" });
  }
};

module.exports.getConnectedUsers = async (req, res, next) => {
  try {
    const {id} = req.params;
    const data = await User.findOne({_id:id});
    const user=[];
    await Promise.all(data.connections.map(async (u) => {
      const df = await User.findOne({ _id: u });
      user.push(df); 
    }));

    //console.log(user);
    return res.json(user);
  } catch (ex) {
    next(ex);
  }
};

module.exports.notConnectedUsers = async (req, res, next) => {
  try {
    const {id} = req.params;
    const data = await User.findOne({_id:id});
   // console.log(data.connections[0].toString());

    const connectionsArray = data.connections.map(connection =>  connection.toString());
    connectionsArray.push(id)
    const user = await User.find({ _id: { $nin: connectionsArray} }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
      "connections"
    ]);
    console.log(user);
    return res.json(user);
  } catch (ex) {
    next(ex);
  }
};

module.exports.remConnection = async(req,res,next) => {
  
  try{
  const {id} = req.params;
  const {e}=req.body;
  const data = await User.findOne({_id:id});
  data.connections = data.connections.filter(user => user!=e);
  await data.save();
  return res.json(data);
  }catch(error){
    next(error);
  }
}



exports.sendconnect = async (req, res) => {
  const data = req.body;
  console.log(data);
  res.status(200).json(data);


  const newUser = data.newUser;
  const otheruser = data.otheruser;
  const receiver = await User.findOne({ email: otheruser });
  const sender = await User.findOne({ email: newUser });

  const receiverid = receiver._id;
  const a = await Connection.find({
    senderEmail: newUser,
    receiverEmail: otheruser,
  });
  if (a.length == 0) {
    const prd = new Connection({
      senderEmail: newUser,
      receiverEmail: otheruser,
      isConnected: false,
      connectionTime: Date.now(),
      username:sender.username,
      headline:sender.headline,
      avatarImage:sender.avatarImage,
    });

    prd
      .save()
      .then((doc) => {
        console.log(doc);
      })

      .catch((err) => {
        console.error(err);
      });
     // let io=req.app.settings.io;
      //console.log(io,"io");
      let sendUserSocket = onlineUsers.get(receiver._id.toString());
      let fg=`${sender.username} sent you a friend request`;
    
      let newNotification= new Notification({ 'user': receiver._id, 'message': fg }); 
      await newNotification.save();
      req.app.settings.io.to(sendUserSocket).emit("newNotification", newNotification);
    // await sendNotification(
    //   receiverid,
    //   `${sender.username} sent you a friend request`,
    //   `/pending`,
    //   "connect",
    //   res
    // );
  }
};



module.exports.addConnection = async(req,res,next) => {
  
  try{
    const {id} = req.params;
    const {newUser}=req.body;  
    const con = await Connection.findOne({
      senderEmail: id,
      receiverEmail: newUser,
    });
  
    
    if (!con) {
      return res.status(404).json({ error: "Connection not found" });
    }
    
    con.isConnected = true;
    await con.save();
    const senderUser = await User.findOne({ email: id });
    const receiverUser = await User.findOne({ email: newUser });
    if (!senderUser || !receiverUser) {
      return res.status(404).json({ error: "User not found" });
    }
    senderUser.connections.push(receiverUser._id);
    await senderUser.save();
    //console.log(onlineUsers);
    //console.log(senderUser._id);
    let sendUserSocket = onlineUsers.get(senderUser._id.toString());
    let fg=`${receiverUser.username} accepted your connection request`;
    //let io=req.app.settings.io;
    let newNotification= new Notification({ 'user': senderUser._id, 'message': fg }); 
    await newNotification.save();
    //console.log(onlineUsers.get(senderUser._id.toString()))
    req.app.settings.io.to(sendUserSocket).emit("newNotification", newNotification);

    // await sendNotification(
    //   senderUser._id,
    //   `${receiverUser.username} accepted your connection request`,
    //   `/profilepage/${receiverEmail}`,
    //   "connect",
    //   res
    // );
   
      // Delete the connection from the connectSchema
      await Connection.findOneAndDelete({
        senderEmail: id,
        receiverEmail: newUser,
      });
    //console.log(data.connections)
  
    return  res.json({ message: "Request accepted successfully" });
  }catch(error){
    console.log(error);
    next(error);
  }
}


module.exports.checkRequest = async(req,res,next) => {
  
  try{
   const {id} = req.params;
  const receiver=req.body.e;
   let f=false;
  if(receiver){
   // console.log(guestUser['username']);
   const a = await Connection.find({
    senderEmail: id,
    receiverEmail: receiver,
  });
  if (a.length != 0) {
    f=true
  }
}
  return res.json(f);
  }catch(error){
    next(error);
  }
}

module.exports.checkConnection = async(req,res,next) => {
  
  try{
    const {id} = req.params;
  const guestUser=req.body.e;
   
  if(guestUser){
   // console.log(guestUser['username']);
    const data = await User.findOne({_id:id});
    let isconnected=false;
    if(data.connections.length>0){
    data.connections.map((user)=>{ 
      console.log(guestUser);     
    if(user!=undefined &&  user==guestUser) isconnected=true;
    })
  }
    return res.json(isconnected);
  }
  }catch(error){
    next(error);
  }
}


module.exports.SearchUsers = async (req, res, next) => {
  const { query } = req.query;

  try {
    // Check if the query is present
    if (!query) {
      res.json([]); // Return an empty array if the query is empty
    } else {
      // Use a mongoose query to find users with a partial match on the username
      const users = await User.find({ username: { $regex: query, $options: 'i' } , _id: { $ne: req.params.id } }).exec();;

      res.json(users);
    }
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    if (req.params.id) {
      const userId = req.params.id;
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.getUserByName = async (req, res, next) => {
  try {
    if (req.params.username) {
      const username = req.params.username;
      const user = await User.findOne({username:username}).select('-password');

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log(user);
      return res.json(user);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.uploadPost = async (req,res,next) => {
  try {
    const { status,filesUrl } = req.body;
    const post = await Post.create({
      user:req.params.id,
      description:status,
      files:filesUrl,
    });
    await post.populate('user');
    return res.json({ status: true, post });
  } catch (ex) {
    next(ex);
  }
}

module.exports.getAllPost = async (req,res,next) => {
  try{

    const id = req.params.id;
    const page = req.params.page || 1;
    const pageSize = 10;
    const skip = (page-1)*pageSize;

    const posts=await Post.find().sort({ createdAt:-1 }).skip(skip).limit(pageSize).populate([
      {
        path: 'user',
        model: 'User',
        select: 'username avatarImage headline'
      },
      {
        path: 'reactions.user',
        model: 'User',
        select: 'username avatarImage headline'
      },
      {
        path: 'comments.user',
        model: 'User',
        select: 'username avatarImage headline'
      }
    ]);
    return res.json(posts);
  }catch( error )
  {
    next(error);
  }
}

module.exports.getPostById = async (req,res,next) => {
  try{
    const id = req.params.postId;
    const post = await Post.find({ _id:id }).populate([
      {
        path: 'user',
        model: 'User',
        select: 'username avatarImage headline'
      },
      {
        path: 'reactions.user',
        model: 'User',
        select: 'username avatarImage headline'
      },
      {
        path: 'comments.user',
        model: 'User',
        select: 'username avatarImage headline'
      }
    ]);
    return res.json(post);
  }catch(error)
  {
    next(error);
  }
}

module.exports.getProfilePost = async (req,res,next) => {
  try{
    const id=req.params.id;
    const posts=await Post.find({ user:id }).sort({ createdAt:-1 }).populate([
      {
        path: 'user',
        model: 'User',
        select: 'username avatarImage headline'
      },
      {
        path: 'reactions.user',
        model: 'User',
        select: 'username avatarImage headline'
      },
      {
        path: 'comments.user',
        model: 'User',
        select: 'username avatarImage headline'
      }
    ]);
    return res.json(posts);
  }catch( error )
  {
    next(error);
  }
}

module.exports.updateProfile = async (req,res,next) => {
  try{
    const data = req.body;
    const id = req.params.id;
    const updatedData = await User.findByIdAndUpdate(id,data,{new:true});
    
    return res.json(updatedData);
  }catch(error)
  {
    next(error);
  }
}

module.exports.checkUsernameValidity = async (req,res,next) => {
  try{
    const checkUsername = req.params.checkUsername;
    const username = req.params.username;
    const foundUser = await User.findOne({ username : checkUsername });
    if(foundUser && foundUser.username!=username)
    {
      return res.json({status : true});
    }
    else
    {
      return res.json({status : false});
    }
  }catch(error)
  {
    next(error);
  }
}

module.exports.getSignature = async (req, res, next) => {
  try {
    const { folder } = req.body;
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request({
      timestamp,
      // folder
    },process.env.CLOUDINARY_API_SECRETE);
    return res.json({timestamp,signature});
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.addReaction = async(req,res,next) => {
  try{
    const {userId , postId , reactionType } = req.body;
    const data = await Post.findOne({_id:postId});
    data.reactions = data.reactions.filter(reaction => reaction.user != userId);
    data.reactions = [{user:userId,type:reactionType},...data.reactions];
    await data.save();
    return res.json(data.reactions);
  }catch(error){
    console.log(error);
    next(error);
  }
}

module.exports.removeReaction = async(req,res,next) => {
  try{
    const {userId , postId } = req.body;
    const data = await Post.findOne({_id:postId});
    data.reactions = data.reactions.filter(reaction => reaction.user._id != userId);
    await data.save();
    return res.json(data.reactions);
  }catch(error){
    console.log(error);
    next(error);
  }
}

module.exports.addComment = async (req,res,next) => {
  try{
    const { userId,postId,inputComment,timestamp } = req.body;
    const data = await Post.findOne({_id:postId});
    data.comments = [{user:userId,comment:inputComment,timeStamp:timestamp},...data.comments];
    await data.save();
    return res.json(data.comments);
  }catch(error){
    console.log(error);
    return res.json(error);
  }
}

module.exports.deletePost = async (req,res,next) => {
  try{
    const id = req.params.id;
    const post = await Post.deleteOne({ _id:id });
    if (post.deletedCount === 1) {
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  }catch(error){
    return res.json(error);
  }
}

module.exports.deleteComment = async (req,res,next) => {
  try{
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex(comment => comment._id.equals(commentId));

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    post.comments.splice(commentIndex, 1);

    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  }catch(error){
    return res.json(error);
  }
}

module.exports.setAvatarImage = async (req,res,next) => {
  try{
    const { imgUrl,id } = req.body;
    const user = await User.findByIdAndUpdate(id,{avatarImage:imgUrl},{new:true})
    return res.json(user);
  }catch(error){
    console.log(error);
    return res.json(error);
  }
}