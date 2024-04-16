const mongoose = require('mongoose');
const { Schema } = mongoose;
function validateMaxPrice(value) {
    return value >= this.minPrice; // 'this' refers to the document being validated
}
// Schema
const skillSchema = new Schema({
    value: { type: String, required: true },
    label: { type: String, required: true }
  });
const jobSchema = new Schema({
        user : {type:mongoose.Schema.Types.ObjectId, ref:"User", required:'true'},
        companyName: {type:String, required:true},
        jobTitle: {type:String, required:true},
        companyLogo: {type:String, required:true},
        minPrice: {type : Number , min:[0,'minPrice cannot be lesser then 0'], required:true},
        maxPrice: {type : Number , 
            required:true ,
            validate: [validateMaxPrice, 'maxPrice must be greater than or equal to minPrice']
        },
        salaryType: {type:String, required:true},
        jobLocation: {type:String, default:"Anywhere"},
        jobPostingDate: {type:String, required:true},
        experienceLevel: {type:String, required:true},
        employmentType: {type:String, required:true},
        description: {type:String},
        skills: { type: [skillSchema], default: [] }
  });
   exports.Job = mongoose.model('Job', jobSchema);