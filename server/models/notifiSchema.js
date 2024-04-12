const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifiSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a User schema (if you have one)
        required: true,
      },
    message: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
     
   
    },
    timestamp: {
        type: Date,
        default: Date.now,
      },
    link: {
        type: String,
    },
    category:{
        type:String
    }
   
});

module.exports = mongoose.model('alert', notifiSchema);