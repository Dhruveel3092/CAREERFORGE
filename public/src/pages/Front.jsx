import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Element } from 'react-scroll';
import { motion } from 'framer-motion';
import img1 from "../assets/homepage.jpg";
import img2 from "../assets/all.jpg";
import img3 from "../assets/res.jpg"
import { useNavigate } from "react-router-dom";
import 'animate.css/animate.css';
import { useInView } from 'react-intersection-observer';
import AboutUs from "./AboutUs"
import  Footer  from './Footer';
import axios from 'axios'
import { host } from '../utils/APIRoutes';
import './Front.css'

const Front = () => {
  const navigate = useNavigate();
  const pageStyle = {
    background: '#251B37',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };
  const [currentUser, setCurrentUser] = useState(undefined);
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  const [ref2, inView2] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  const [ref3, inView3] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("current",currentUser)
       // console.log(response,"response")
        const response = await axios.get(`${host}/login/sucess`, {withCredentials: true});
        console.log(response,"response");
        if(response.data.sta==1){
          if(response.data.user) 
          {
              setCurrentUser(response.data.user)
              navigate("/home");
          }
        }
  
    } catch (error) {
      console.log(error)
      navigate("/login")
    }

    };

    
    fetchData();
  }, []);

  return (
    <>
    <Element name="Front">
      <nav className='navb'>
       <Link to='/' className='link-na'>Home</Link>
       <Link to='/login' className='link-na'>Sign-in</Link>
       <Link to='/register' className='link-na'>Sign-up</Link>
      </nav>
      <div style={pageStyle}>
        <div className="container-ext">
          <h1 className="container-h1">Welcome to the our Professional Community</h1>
      
          <div className="motion-div">
            <motion.div className="div-img animate__animated animate__fadeInRight ">
              <motion.img
                ref={ref1}
                src={img1}
                alt="Image 1"
                className="img"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 1 }}
              />
              <div className="flex-1 ">
              <h1 className="text-4xl	">Your career growth is our priority</h1>

                <p>"Welcome to our Proffesional community where you can build your professional Profile, share your experience and achievements. Connect with professionals, build your digital resume, and explore opportunities in a vibrant community. Elevate your career journey with us!"</p>
              </div>
            </motion.div>
            <motion.div className="div-img animate__animated animate__fadeInLeft">
              <div className="flex-1">
            <h1 className="text-6xl	">Share Your Experience and Achievements</h1>
                <p className="text-xl mb-4">
                You can share your experience or achievements with others and by posting this achievements you will get more chance for selection in a job application and other can praise your achievements and also can comment on it.
                </p>
              </div>
              <motion.img
                ref={ref2}
                src={img2}
                alt="Image 2"
                className="img"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </motion.div>
            <motion.div className="div-img animate__animated animate__fadeInRight">
              <motion.img
                ref={ref3}
                
               src={img3}
                className="img"
                initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
               exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 1 }}
              />
              <div className="flex-1">
              <h1 className="text-6xl	">Resume Builder</h1>

                <p>                  Build your professional narrative seamlessly with our Resume Builder. Craft customized resumes, showcase your skills, and make a lasting impression. Elevate your career journey with ease and precision using our intuitive and powerful resume-building feature.
</p>
              </div>
            </motion.div>
          </div>
          <div style={{ overflow: 'auto', padding: '10vh' }}>
    <AboutUs/>
   </div>
   <div style={{ overflow: 'auto', padding: '20vh 10vh ' }}>
    <Footer/>
   </div>
        </div>
      </div>
     
    </Element>
  

    </>
  );
};

export default Front;
