const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    senderEmail: {
        type: String,
        required: true
    },
    receiverEmail: {
        type: String,
        required: true
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    connectionTime: {
        type: Date
    },
    avatarImage: {
        type: String,
        default: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1707052827/zupx5ylgkrtq33lzzkma.png`,
      },
    username: {
        type: String,
        required: true,
      }, 
     headline : {
        type : String,
      }   

    
});

module.exports = mongoose.model('request', connectionSchema);
