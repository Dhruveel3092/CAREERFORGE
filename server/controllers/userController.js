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
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.posts.push(post._id);

    await user.save();

    await post.populate('user');
    return res.json({ status: true, post });
  } catch (ex) {
    next(ex);
  }
}

module.exports.getAllPostsByUserId = async (req,res,next) => {
  try{
    const userId = req.params.userId;

    const posts=await Post.find({user:userId}).sort({ createdAt:-1 }).populate([
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

module.exports.getProfileData = async (req,res,next) => {
  try{
    const id=req.params.id;
    const user=await User.findById(id)
                          .populate([{
                            path: 'posts',
                            options: { sort: { createdAt: -1 } },
                            populate: [
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
                            ]
                          },
                          {
                            path: 'skills',
                            options: { sort : {createdAt: -1} },
                            populate: {
                              path: 'endorsements',
                              model: 'User',
                              select: 'username avatarImage headline',
                            }
                          }
                        ]);
    return res.json(user);
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

module.exports.addSkill = async (req,res,next) => {

  const {id , inputSkill} = req.body;

  try{

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: false , message: 'User not found' });
    }

    const result = user.skills.find(skill => skill.skillName == inputSkill);

    if(result)
      return res.status(200).json({status:false , message: 'Skill is already added' });

    user.skills.unshift({ skillName : inputSkill , endorsements : [] });

    await user.save();

    return res.status(200).json({ status:true , message: 'Skill added successfully' , user });

  }catch(error)
  {
    console.error('Error adding skill and endorsement:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports.addEndorsement = async (req,res,next) => {

  const { userId , skillId , endorsementId } = req.body;

  try{

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const skillIndex = user.skills.findIndex(skill => skill._id==skillId);

    user.skills[skillIndex].endorsements.unshift(endorsementId);
    
    await user.save();

    const populatedEndorsements = await User.populate(user.skills[skillIndex], {
      path: 'endorsements',
      select: 'username avatarImage headline',
    });

    user.skills[skillIndex] = populatedEndorsements;    
    
    const skill = user.skills[skillIndex];

    return res.status(200).json({ status:true , message: 'Endorsement added successfully' , skill });

  }catch(error)
  {
    console.error('Error adding endorsement: ',error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports.removeEndorsement = async (req,res,next) => {

  const { userId , skillId , endorsementId } = req.body;

  try{

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const skillIndex = user.skills.findIndex(skill => skill._id==skillId);

    user.skills[skillIndex].endorsements = user.skills[skillIndex].endorsements.filter(endorsement => endorsement != endorsementId);
    
    await user.save();

    const populatedEndorsements = await User.populate(user.skills[skillIndex], {
      path: 'endorsements',
      select: 'username avatarImage headline',
    });

    user.skills[skillIndex] = populatedEndorsements;    
    
    const skill = user.skills[skillIndex];

    return res.status(200).json({ status:true , message: 'Endorsement deleted successfully' , skill });

  }catch(error)
  {
    console.error('Error deleting endorsement: ',error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports.addEducation = async (req, res ,next) => {
  try {
    const userId = req.body.id;
    const {
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      activitiesAndSocieties,
      description,
    } = req.body.formData;

    const user = await User.findById(userId);

    const newEducation = {
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      activitiesAndSocieties,
      description,
    };

    user.education.unshift(newEducation);

    user.education.sort((a, b) => {
      if (a.endDate && b.endDate) {
        return new Date(b.endDate) - new Date(a.endDate);
      } else if (!a.endDate && !b.endDate) {
        return a.school.localeCompare(b.school);
      } else {
        return a.endDate ? -1 : 1;
      }
    });

    await user.save();

    const education = user.education;

    res.status(201).json({ message: 'Education added successfully', education });
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.addExperience = async (req, res ,next) => {
  try {
    const userId = req.body.id;
    const {
      company,
      role,
      currently_working,
      startDate,
      endDate,
      industry,
      employment_type,
      description,
      location,
      location_type,
    } = req.body.experienceData;

    const user = await User.findById(userId);

    const newExperience = {
      company,
      role,
      currently_working,
      startDate,
      endDate,
      industry,
      employment_type,
      description,
      location,
      location_type,
    };

    user.experience.unshift(newExperience);

    user.experience.sort((a, b) => {
      if (a.endDate && b.endDate) {
        return new Date(b.endDate) - new Date(a.endDate);
      } else if (!a.endDate && !b.endDate) {
        return a.role.localeCompare(b.role);
      } else {
        return a.endDate ? 1 : -1;
      }
    });
    
    await user.save();

    const experience = user.experience;

    res.status(201).json({ message: 'Experience added successfully', experience });
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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
    let sendUserSocket = onlineUsers.get(data.user.toString());
    let u=await User.find({_id:userId});

    let fg=`${u[0].username} reacted ${reactionType} on your post`;

    let newNotification= new Notification({ 'user': data.user, 'message': fg }); 
    await newNotification.save();
    req.app.settings.io.to(sendUserSocket).emit("newNotification", newNotification);
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
    let u=await User.find({_id:userId});
     let sendUserSocket = onlineUsers.get(data.user.toString());

     let fg=`${u[0].username} commented on your post`;

     let newNotification= new Notification({ 'user': data.user, 'message': fg }); 
     await newNotification.save();
     req.app.settings.io.to(sendUserSocket).emit("newNotification", newNotification);

    data.comments = [{user:userId,comment:inputComment,timeStamp:timestamp},...data.comments];
    await data.save();

    const updatedPost = await Post.findById(postId).populate({
      path: 'comments.user',
      select: 'username avatarImage headline',
    })
    .populate({
      path: 'comments',
      options: { sort: {timeStamp: -1}}
    });
    return res.json(updatedPost.comments);
  }catch(error){
    console.log(error);
    return res.json(error);
  }
}

module.exports.getMorePost = async (req,res,next) => {
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

module.exports.deletePost = async (req,res,next) => {

  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const posts = await Post.deleteOne({ _id: postId });

    if (posts.deletedCount === 1) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const index = user.posts.indexOf(postId);
      if (index !== -1) {
        user.posts.splice(index, 1);
      }

      await user.save();

      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
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

    const updatedPost = await Post.findById(postId).populate({
      path: 'comments.user',
      select: 'username avatarImage headline',
    })
    .populate({
      path: 'comments',
      options: { sort: {timeStamp: -1}}
    });
    return res.json(updatedPost.comments);
  }catch(error){
    return res.json(error);
  }
}

module.exports.deleteSkill = async (req,res,next) => {
  try{
    const skillId = req.params.skillId;
    const userId = req.params.userId;

    const user = await User.findById(userId).populate({
      path: 'skills',
      options: {sort: {createdAt:-1}},
      populate: {
        path: 'endorsements',
        model: 'User',
        select: 'username avatarImage headline',
      }
    });

    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    user.skills.pull(skillId);

    await user.save();

    return res.json(user.skills);
    
  }catch(error){
    return res.json(error);
  }
}

module.exports.deleteEducation = async (req,res,next) => {
  try{
    const educationId = req.params.educationId;
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    user.education.pull(educationId);

    await user.save();

    return res.json(user.education);
    
  }catch(error){
    return res.json(error);
  }
}

module.exports.deleteExperience = async (req,res,next) => {
  try{
    const experienceId = req.params.experienceId;
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    user.experience.pull(experienceId);

    await user.save();

    return res.json(user.experience);
    
  }catch(error){
    return res.json(error);
  }
}

module.exports.updateExperience = async (req,res,next) => {
  try{

    const userId = req.params.userId;
    const experienceId = req.params.experienceId;
    const updatedExperienceData = req.body.updatedExperienceData;

    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    const experienceIndex = user.experience.findIndex(experience => experience._id==experienceId );

    user.experience[experienceIndex] = {
      ...user.experience[experienceIndex],
      ...updatedExperienceData
    }

    user.experience.sort((a, b) => {
      if (a.endDate && b.endDate) {
        return new Date(b.endDate) - new Date(a.endDate);
      } else if (!a.endDate && !b.endDate) {
        return a.role.localeCompare(b.role);
      } else {
        return a.endDate ? 1 : -1;
      }
    });

    user.save();

    const experience = user.experience;

    return res.status(200).json({ message:'Experience updated successfully' , experience });

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