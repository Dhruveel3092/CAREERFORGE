const mongoose = require("mongoose");
const { type } = require("os");
const jwt=require('jsonwebtoken');
require("dotenv").config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    default: "v1234",
    min: 8,
  },
  avatarImage: {
    type: String,
    default: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1707052827/zupx5ylgkrtq33lzzkma.png`,
  },
  aboutMe : {
    type:String,
  },
  connections : [{
      type:mongoose.Schema.Types.ObjectId, ref:'User',required:true,
  }],
  posts : [{
      type:mongoose.Schema.Types.ObjectId, ref:'Post',required:true,
  }],
  headline : {
    type : String,
  },
  country : {
    type : String,
  },
  city : {
    type : String,
  }, 
  company : {
    type : String,
  },
  industry : {
    type : String,
  },
  website : {
    type : String,
  },
  skills : [{
    skillName:{type: String,required:true},
    endorsements:[{type:mongoose.Schema.Types.ObjectId, ref:'User' , required:true}],
  }],
  college : {
    type : String,
  },
  education : [{
      school:{type:String, required:true},
      degree:{type:String},
      fieldOfStudy:{type:String},
      startDate:{type:Date},
      endDate:{type:Date},
      grade:{type:String},
      activitiesAndSocieties:{type:String},
      description:{type:String},
      image:{type:String,default:'/Users/dhruveelgajipara/Desktop/SNAPPY/public/src/assets/motilal_nehru_national_institute_of_technology_logo.jpeg'}
  }],
  experience : [{
      company:{type:String, required:true},
      role:{type:String, required:true},
      startDate:{type:Date,required:true},
      endDate:{type:Date},
      industry:{type:String,required:true},
      currently_working:{type:Boolean,default:false},
      employment_type:{type:String},
      description:{type:String},
      location:{type:String},
      location_type:{type:String},
      image:{type:String,default:'/Users/dhruveelgajipara/Desktop/SNAPPY/public/src/assets/atlassian_logo.jpeg',}
  }],
  
  tokens:[{
    token:{ 
        type:String
    }

}],
  postedJobs:[{
    type:mongoose.Schema.Types.ObjectId, ref:'Job',required:true,
  }],
  appliedJobs:[{
    AppliedJobId:{type:mongoose.Schema.Types.ObjectId, ref:'Job',required:true},
    ApplicationStatus: {type:String}
    
  }]
});

  userSchema.methods.generateAuthToken= async function(){
    try {
        const toke= jwt.sign({email:this.email},process.env.Secret_Key);
        this.tokens=this.tokens.concat({token:toke});
        await this.save();
        console.log(this.tokens,"I am in usermodel");
        return toke;
    } catch (error) {
        res.send("the error part"+error);

    }
}
module.exports = mongoose.model("User", userSchema);
