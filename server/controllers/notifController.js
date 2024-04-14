const notif = require('../models/notifiSchema');

module.exports.getnotif = async (req, res) => {
    const userid = req.body.userid;
  
    try {
      // Assuming notif is a Mongoose model
      const notifications = await notif.find({ user: userid , seen : false}).sort({ timestamp: -1 });
  
      // if (notifications.length === 0) {
      //   // Case: No notifications found for the user
      //   return res.status(404).json({ message: 'No notifications found for the user.' });
      // }
      //console.log(notifications,"jhkj");
      // Case: Notifications found for the user
      return res.status(200).json({ notifications });
    } catch (error) {
      // Case: Error occurred during database query
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  module.exports.setnotif = async (req, res) => {
    const userid = req.body.userid;
  
    try {
      // Assuming notif is a Mongoose model
      const notifications = await notif.updateMany({ user: userid , seen:true}).sort({ timestamp: -1 });
     
      
      return res.status(200).json({ notifications });
    } catch (error) {
      // Case: Error occurred during database query
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

