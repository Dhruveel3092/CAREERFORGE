import React, { useState , useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { addSkillAPI, getProfileData } from "../../utils/APIRoutes";
import axios from "axios";
import { IoAddSharp } from "react-icons/io5";
import Topbar from "../../components/Topbar";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "./index.css";
import Skill from "../../components/Skill";
import { host } from "../../utils/APIRoutes";
import SkillAddModal from "../../components/SkillAddModal";

export default function AllSkills() {
  const [currentUser,setCurrentUser] = useState(undefined);
  const [allSkills,setAllSkills] = useState(undefined);
  const { userId , username } = useParams();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("current",currentUser)
       // console.log(response,"response")
        const response = await axios.get(`${host}/login/sucess`, {withCredentials: true});
        console.log(response,"response");
        if(response.data.sta==1){
          if(response.data.user) setCurrentUser(response.data.user);
        }else{
          navigate("/login")
        }
  
    } catch (error) {
      console.log(error)
      navigate("/login")
    }

    };

    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const {data} = await axios.get(`${getProfileData}/${userId}`);
      setAllSkills(data.skills);
    };  
    fetchData();
  }, [userId]);

  const addSkill = async () => {
    const {data} = await axios.post(addSkillAPI,{inputSkill,id:currentUser?._id});
    if(data.status==false)
      toast.error(data.message , toastOptions);
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
    <StyledHome>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
        <div className="all-skills">
          <div className="username-skill">
            Skills
            {userId == currentUser?._id && <span className="icon-container-2">
              <IoAddSharp 
                className="icon icn-2" 
                onClick={() => setSkillAddModal(true)}
              />
              {
                userId == currentUser?._id && skillAddModal && 
                <SkillAddModal 
                skillAddModal={skillAddModal} 
                setSkillAddModal={setSkillAddModal}
                inputSkill={inputSkill}
                setInputSkill={setInputSkill}
                addSkill={addSkill}
                />
              }
            </span>}
          </div>
          {allSkills!==undefined && allSkills.map((skill,index) => {
            return (
                <>
                    {
                    index==0 
                    ? 
                        <hr style={{ backgroundColor: '#b7b7b7', marginTop: '30px' }}/> 
                    : 
                        <hr style={{ backgroundColor: '#b7b7b7', marginTop: '10px' }}/>
                    }
                    <Skill skill={skill} setAllSkills={setAllSkills} userId={userId} currentUser={currentUser} showPencil={true}/>
                </>
            );
          })}
        </div>
       </StyledPosts>
       <ToastContainer/>
    </StyledHome>
    </>
  );
}

const StyledHome = styled.div`
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

const Top = styled.div`
  position: sticky;
  top: 0px;
  z-index:100;
`

const StyledPosts = styled.div`
  flex: 1;
  padding: 10px;

  /* Webkit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3498db;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: #ecf0f1;
    border-radius: 8px;
  }

  /* Additional styling for the content */
   border: 1px solid #242527;
   border-radius: 8px;
`;