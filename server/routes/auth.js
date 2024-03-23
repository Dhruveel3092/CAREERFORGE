const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  SearchUsers,
  getUserById,
  uploadPost,
  getAllPost,
  updateProfile,
  checkUsernameValidity,
  getUserByName,
  getProfilePost,
  getSignature,
  setAvatarImage,
  addReaction,
  removeReaction,
  addComment,
  deletePost,
  deleteComment,
  getPostById,
  addConnection,
  checkConnection,
  remConnection,
  getConnectedUsers,
  notConnectedUsers
} = require("../controllers/userController");

const{
  getnotif
}=require('../controllers/notifController');
 


const router = require("express").Router();

router.post("/get",getnotif);
router.post("/login", login);
router.post("/register", register);
router.post("/setavatar/:id", setAvatar);
router.post("/uploadPost/:id",uploadPost);
router.post("/updateProfile/:id",updateProfile);
router.post("/getSignature",getSignature);
router.post("/setAvatarImage",setAvatarImage);
router.post("/addConnection/:id",addConnection);
router.post("/checkConnection/:id",checkConnection);
router.post("/remConnection/:id",remConnection);
router.get("/notConnectedUsers/:id",notConnectedUsers);
router.get("/getConnectedUsers/:id",getConnectedUsers);
router.get("/getAllUser/:id",getAllUsers);
router.post("/addReaction",addReaction);
router.post("/removeReaction",removeReaction);
router.post("/addComment",addComment);
router.get("/logout/:id", logOut);
router.get("/SearchUsers/:id", SearchUsers);
router.get("/getUserById/:id",getUserById);
router.get("/getAllPost/:id/:page",getAllPost);
router.get("/getProfilePost/:id",getProfilePost);
router.get("/checkUsernameValidity/:username/:checkUsername",checkUsernameValidity);
router.get("/getUserByName/:username",getUserByName);
router.get("/getPostById/:postId",getPostById);
router.delete("/deletePost/:id",deletePost);
router.delete("/deleteComment/:postId/:commentId",deleteComment);



module.exports = router;