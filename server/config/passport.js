const passport=require('passport');
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("../models/userModel");
const jwt=require("jsonwebtoken")

module.exports=(passport)=>{
passport.use(
    new OAuth2Strategy({
        clientID: process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:"https://careerforge.onrender.com/api/auth/google/callback",
        scope:["profile","email"]
    },
    async (accessToken,refreshToken,profile,done)=>{
        try {
            let user = await User.findOne({email:profile.emails[0].value});
            
            if(!user){
                user = new User({
                    username:profile.displayName,
                    email:profile.emails[0].value,
                    avatarImage:profile.photos[0].value
                
                });
                console.log(user,"user")
                await user.save();
            }
  
            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
  )
  
  passport.serializeUser((user,done)=>{
    done(null,user);
  })
  
  passport.deserializeUser((user,done)=>{
    done(null,user);
  });
}
  