import React, { useEffect, useState } from "react";
import "./index.css";
import PostsCard from "../PostsCard";
import FileUploadModal from "../FileUploadModal";
import styled from "styled-components";
import axios from "axios";
import { HiOutlinePencil } from "react-icons/hi";
import { getProfileData, getSignature , setAvatarImage , addSkillAPI, addEducationAPI, addExperienceAPI } from "../../utils/APIRoutes";
import {sendconnect} from "../../utils/APIRoutes"
import {checkConnection,checkRequest} from "../../utils/APIRoutes"
import {remConnection} from "../../utils/APIRoutes"
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import SkillAddModal from "../SkillAddModal";
import Skill from "../Skill";
import EducationAddModal from "../EducationAddModal";
import Education from "../Education";
import ExperienceAddModal from "../ExperienceAddModal";
import Experience from "../Experience";
import { Container } from "@mui/material";

export default function ProfileCard( { onEdit , currentUser ,guestUser ,setCurrentUser } ){
    const [user,setUser] = useState(undefined);
    const [editButton,setEditButton] = useState(false);
    const [allPosts,setAllPosts] = useState(undefined);
    const [allSkills , setAllSkills] = useState(undefined);
    const [image, setImage] = useState(null);
    const [imgUrl,setImgUrl] = useState(undefined);
    const [modalOpen,setModalOpen] = useState(false);
    const [connected,isconnected] = useState(false);
    const [skillAddModal,setSkillAddModal] = useState(false);
    const [inputSkill,setInputSkill] = useState('');
    const [allEducation,setAllEducation] = useState(undefined);
    const [educationAddModal,setEducationAddModal] = useState(false);
    const [formData, setFormData] = useState({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: null,
      endDate: null,
      grade: "",
      activitiesAndSocieties: "",
      description: "",
    });
    const [experienceAddModal,setExperienceAddModal] = useState(false);
    const [allExperience,setAllExperience] = useState(undefined);
    const [experienceData,setExperienceData] = useState({
      company: "",
      role: "",
      currently_working: false,
      startDate: null,
      endDate: null,
      industry: "",
      employment_type: "",
      description: "",
      location: "",
      location_type: "",
    })

    const navigate = useNavigate();
    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };
    const [pend,setpend]= useState(false);
   
    useEffect( () => {   
      const fetch = async() => {
      if(guestUser!=undefined){
      const data=await axios.post(`${checkConnection}/${currentUser._id}`, { e:guestUser._id} );
       if(data.data==true){
        isconnected(true);
      }
    }
    }

      fetch();

    },[user]);

    useEffect( () => {   
      const fetch = async() => {
      if(guestUser!=undefined){
      let data=await axios.post(`${checkRequest}/${currentUser.email}`, { e:guestUser.email} );
       if(data.data==true){
        setpend(true);
      }
    }
    }

      fetch();

    },[user]);

    const handleImageChange = (e) => {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
    };
  
    
    const remConn =async(e) => {
      const data= await axios.post(`${remConnection}/${currentUser._id}`, { e } );
      //console.log(data);
   isconnected(false);
    }

    const addConn =async (e) => {
      const data= await axios.post(`${sendconnect}`, { 
       newUser: currentUser.email,
       otheruser:e,
       });
     
       setpend(true);
    }

    const uploadFile = async (type,timestamp,signature) => {
      const data = new FormData();
      data.append("file", image);
      data.append("timestamp",timestamp);
      data.append("signature",signature);
      data.append("api_key",process.env.REACT_APP_CLOUDINARY_API_KEY);
  
      try{
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        const resourceType = type;
        const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  
        const res = await axios.post(api,data);
        const { secure_url } = res.data;
        return secure_url;
      }catch(error){
        console.log(error);
      }
    }
  
    const getSignatureForUpload = async (folder) => {
      try{
        const res = await axios.post(getSignature,{folder});
        return res.data;
      }catch(error){
        console.log(error);
      }
    }

    useEffect(() =>{
      const fetchData = async ()=>{
        const response = await axios.post(setAvatarImage,{ imgUrl ,id:currentUser._id});
          localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(response.data)
          );
          setUser(response.data);
          setCurrentUser(response.data);
          setModalOpen(false);
          console.log(response.data);
      }
      fetchData();
    },[imgUrl])
  
    const handleUpload = async () => {
      try {
        if(image){
          setImage(null);
          const { timestamp:imgTimestamp, signature : imgSignature} = await getSignatureForUpload('images');
          const imgUrl = await uploadFile('image',imgTimestamp,imgSignature);
          setImgUrl(imgUrl);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };


    useEffect(() => {
      const fetchData = async () => {
        if(guestUser){
        const {data} = await axios.get(`${getProfileData}/${guestUser._id}`);
        setAllPosts(data.posts);
        setAllSkills(data.skills);
        setAllEducation(data.education);
        setAllExperience(data.experience);
        }
      }

      fetchData();

    },[guestUser]);

    useEffect(() => {
      if(guestUser)
      {
        setUser(guestUser);
      }
    },[guestUser]);
    
    useEffect(() => {
      if(currentUser && guestUser)
      {
        if(currentUser._id===guestUser._id)
          setEditButton(true);
        else
          setEditButton(false);
      }
    },[currentUser,guestUser]);

    const addSkill = async () => {
      const {data} = await axios.post(addSkillAPI,{inputSkill,id:currentUser?._id});
      if(data.status==false)
        toast.error(data.message , toastOptions);
      // console.log(data);
      // setAllSkills(data.user.skills);
      setAllSkills([{
        skillName:inputSkill,
        endorsements:[]
      },...allSkills])
      setInputSkill('');
      setSkillAddModal(false);
    }

    const addEducation = async () => {
      const {data} = await axios.post(addEducationAPI,{formData,id:currentUser?._id});
      setAllEducation(data.education);
      setEducationAddModal(false);
      console.log(data);
      setFormData({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: null,
        endDate: null,
        grade: "",
        activitiesAndSocieties: "",
        description: "",
      });
    }

    const addExperience = async () => {
      const {data} = await axios.post(addExperienceAPI,{experienceData,id:currentUser?._id});
      setAllExperience(data.experience);
      setExperienceAddModal(false);
      console.log(data);
      setExperienceData({
        company: "",
        role: "",
        currently_working: false,
        startDate: null,
        endDate: null,
        industry: "",
        employment_type: "",
        description: "",
        location: "",
        location_type: "",
      });
    }

    return (
      <> 
        {
          editButton && 
          <FileUploadModal 
          modalOpen={modalOpen} 
          setModalOpen={setModalOpen} 
          handleImageChange={handleImageChange} 
          handleUpload={handleUpload}
          setImage={setImage} 
          image={image}/>
          }
        <div className="profile-card">
        
            <div className="edit-btn">
                 {editButton && <HiOutlinePencil className="icon" onClick={onEdit} />}
            </div>
          <div className="profile-info">
            <div>
              <img className="profile-image" src={user ? user.avatarImage :process.env.REACT_APP_DEFAULT_AVATAR_IMAGE} onClick={()=>setModalOpen(true)}/>
              {user && <h3 className="userName">{user.username}</h3>}
              {user && user.headline && <p className="heading">{user.headline}</p>}

              {user && (editButton) ?  <></> : 
              ((connected) ? <button class="connected-button"  onClick={() => remConn(guestUser._id)} >Connected</button> : ((pend)  ?  <button class="connected-button">request sent</button> : <button class="connect-button" onClick={() => addConn(guestUser.email) }>Connect</button>)) }

              {user && (user.city || user.country) && (
                <p className="location">
                  {user.city && user.country
                    ? `${user.city}, ${user.country}`
                    : user.city || user.country }
                </p>
              )}

            {user && user.website && <a
              className="website"
              target="_blank"
              href={user.website}
            >
              {user.website}
            </a>}
            </div>

             <div className="right-info">
              {user && user.college && <p className="college">{user.college}</p>}
              {user && user.company && <p className="company">{user.company}</p>}
             </div>
          </div>
          {user && user.aboutMe && <p className="about-me">
            {user.aboutMe}
          </p>}

      </div>
        {allPosts?.length>0 && <div className="all-posts">
          <div className="username-posts">Posts</div>
          {allPosts?.length>0 &&
              <div key={allPosts[0].id}>
                <hr style={{ backgroundColor: '#b7b7b7', marginTop: '30px' }} />
                <PostsCard posts={allPosts[0]} currentUser={currentUser} allPosts={allPosts} setAllPosts={setAllPosts}/>
              </div>
          }
          {allPosts?.length>1 && <button 
            className="all-posts-button" 
            onClick={()=>navigate(`/allPosts/${user?.username}/${user?._id}`)}
          > 
            Show all posts <FaArrowRight />
          </button>}
        </div>}

        <div className="skills">
          <div className="username-skills">
            Skills
            {editButton && <span className="icon-container-2">
              <IoAddSharp 
                className="icon" 
                onClick={() => setSkillAddModal(true)}
              />
              <HiOutlinePencil 
                className="icon" 
                onClick={() => navigate(`/allSkills/${user?.username}/${user?._id}`)}
              />
            </span>}
          </div>
          {allSkills?.length>0 && (
            <>
            <hr style={{ backgroundColor: '#b7b7b7', marginTop: '20px' }} />
            <Skill skill={allSkills[0]} userId={user?._id} currentUser={currentUser} />
            </>
          )}
          {allSkills?.length>1 && (
            <>
            <hr style={{ backgroundColor: '#b7b7b7' }} />
            <Skill skill={allSkills[1]} userId={user?._id} currentUser={currentUser} />
            </>
          )
          }

          {allSkills?.length>2 && <button 
            className="all-skills-button" 
            onClick={() => navigate(`/allSkills/${user?.username}/${user?._id}`)}
          > 
            Show all skills <FaArrowRight />
          </button>}
        </div>
        {
          editButton && skillAddModal && 
          <SkillAddModal 
          skillAddModal={skillAddModal} 
          setSkillAddModal={setSkillAddModal}
          inputSkill={inputSkill}
          setInputSkill={setInputSkill}
          addSkill={addSkill}
          />
        }

      
        <div className="skills">
          <div className="username-skills">
            Education
            {editButton && <span className="icon-container-2">
              <IoAddSharp 
                className="icon" 
                onClick={() => setEducationAddModal(true)}
              />
              <HiOutlinePencil 
                className="icon" 
                onClick={() => navigate(`/allEducation/${user?.username}/${user?._id}`)}
              />
            </span>}
          </div>

          {allEducation?.length>0 && (
            <>
            <hr style={{ backgroundColor: '#b7b7b7', marginTop: '20px' }} />
            <Education education={allEducation[0]} userId={user?._id} currentUser={currentUser} />
            </>
          )}
          {allEducation?.length>1 && (
            <>
            <hr style={{ backgroundColor: '#b7b7b7' }} />
            <Education education={allEducation[1]} userId={user?._id} currentUser={currentUser} />
            </>
          )
          }
                  
          {allEducation?.length>2 && <button 
            className="all-skills-button" 
            onClick={() => navigate(`/allEducation/${user?.username}/${user?._id}`)}
          > 
            Show all education <FaArrowRight />
          </button>}
        </div>
        {
          editButton && educationAddModal && 
          <EducationAddModal 
          educationAddModal={educationAddModal} 
          setEducationAddModal={setEducationAddModal}
          formData={formData}
          setFormData={setFormData}
          addEducation={addEducation}
          />
        }


        <div className="skills">
          <div className="username-skills">
            Experience
            {editButton && <span className="icon-container-2">
              <IoAddSharp 
                className="icon" 
                onClick={() => setExperienceAddModal(true)}
              />
              <HiOutlinePencil 
                className="icon" 
                onClick={() => navigate(`/allExperience/${user?.username}/${user?._id}`)}
              />
            </span>}
          </div>

          {allExperience?.length>0 && (
            <>
            <hr style={{ backgroundColor: '#b7b7b7', marginTop: '20px' }} />
            < Experience experience={allExperience[0]} userId={user?._id} currentUser={currentUser} />
            </>
          )}
          {allExperience?.length>1 && (
            <>
            <hr style={{ backgroundColor: '#b7b7b7' }} />
            <Experience experience={allExperience[1]} userId={user?._id} currentUser={currentUser} />
            </>
          )
          }
                  
          {allExperience?.length>2 && <button 
            className="all-skills-button" 
            onClick={() => navigate(`/allExperience/${user?.username}/${user?._id}`)}
          > 
            Show all experience <FaArrowRight />
          </button>}
        </div>
        {
          editButton && experienceAddModal && 
          <ExperienceAddModal 
          experinceAddModal={experienceAddModal} 
          setExperienceAddModal={setExperienceAddModal}
          experinceData={experienceData}
          setExperienceData={setExperienceData}
          addExperience={addExperience}
          />
        }
        <ToastContainer/>
      </>
    );
}




 