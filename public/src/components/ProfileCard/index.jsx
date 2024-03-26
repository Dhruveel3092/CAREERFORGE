import React, { useEffect, useState } from "react";
import "./index.css";
import PostsCard from "../PostsCard";
import FileUploadModal from "../FileUploadModal";
import axios from "axios";
import { HiOutlinePencil } from "react-icons/hi";
import { getProfileData, getSignature , setAvatarImage , addSkillAPI } from "../../utils/APIRoutes";
import {addConnection} from "../../utils/APIRoutes"
import {checkConnection} from "../../utils/APIRoutes"
import {remConnection} from "../../utils/APIRoutes"
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import SkillAddModal from "../SkillAddModal";
import Skill from "../Skill";

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
    const navigate = useNavigate();
    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };
   
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
      const data= await axios.post(`${addConnection}/${currentUser._id}`, { e } );
      //console.log(data);
   isconnected(true);
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
        console.log(data.skills);
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
              ((connected) ? <button class="connected-button"  onClick={() => remConn(guestUser._id)} >Connected</button> : <button class="connect-button" onClick={() => addConn(guestUser._id) }>Connect</button>) }

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
        {/* <div className="skills">
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
                  
          <button 
            className="all-skills-button" 
            onClick={() => navigate(`/allSkills/${user?.username}/${user?._id}`)}
          > 
            Show all skills <FaArrowRight />
          </button>
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
        } */}
        <ToastContainer/>
      </>
    );
}