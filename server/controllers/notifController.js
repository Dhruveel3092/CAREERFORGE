const notif = require('../models/notifiSchema');

module.exports.getnotif = async (req, res) => {
    const userid = req.body.userid;
  
    try {
      // Assuming notif is a Mongoose model
      const notifications = await notif.find({ user: userid }).sort({ timestamp: -1 });
  
      // if (notifications.length === 0) {
      //   // Case: No notifications found for the user
      //   return res.status(404).json({ message: 'No notifications found for the user.' });
      // }
  
      // Case: Notifications found for the user
      return res.status(200).json({ notifications });
    } catch (error) {
      // Case: Error occurred during database query
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


// const send=async (req, res) => {
//     const { userId, message, link, cat } = req.body;
  
//     try {
//         const newNotification = new notif({'user': userId, 'message':message,'category':cat,'link':link });
//         console.log(newNotification)
//       await newNotification.save();
//   console.log(io)
//       // Broadcast the new notification to the target user
//       io.to(userId).emit('newNotification', newNotification);
  
//       console.log(newNotification);
//       res.status(200).json({ success: true, message: 'Notification sent successfully' });
//     } catch (error) {
//       console.error('Error saving notification:', error.message);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   }





//   const sendNotification = async (userId, message, link, cat, res) => {
//     try {
//         const newNotification = new notif({ 'user': userId, 'message': message, 'category': cat, 'link': link });
//         console.log(newNotification);
//         await newNotification.save();

//         // Broadcast the new notification to the target user
//         io.to(userId.toString()).emit('newNotification', newNotification);
//         console.log('hh')
// console.log(userId)
//        // console.log(newNotification);
//        // res.status(200).json({ success: true, message: 'Notification sent successfully' });
//     } catch (error) {
//         console.error('Error saving notification:', error.message);
//        // res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// }
  
//module.exports={getnotif,send,sendNotification}
