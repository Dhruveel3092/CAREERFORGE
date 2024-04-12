import React, { useState , useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { addExperienceAPI, getProfileData ,host } from "../../utils/APIRoutes";
import axios from "axios";
import { IoAddSharp } from "react-icons/io5";
import Topbar from "../../components/Topbar";
import styled from "styled-components";
import "./index.css";
import Experience from "../../components/Experience";
import ExperienceAddModal from "../../components/ExperienceAddModal";

export default function AllExperience() {
  const [currentUser,setCurrentUser] = useState(undefined);
  const [allExperience,setAllExperience] = useState(undefined);
  const { userId , username } = useParams();
  const [experienceAddModal,setExperienceAddModal] = useState(false);
  const [experienceData, setExperienceData] = useState({
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${host}/login/sucess`, { withCredentials: true });
       if(response.data.user) setCurrentUser(response.data.user);
       // console.log("current",currentUser)
       // console.log("response",response.data.user)
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
      setAllExperience(data.experience);
    };  
    fetchData();
  }, [userId]);

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
    <StyledHome>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
        <div className="all-skills">
          <div className="username-skill">
            Experience
            {userId == currentUser?._id && <span className="icon-container-2">
              <IoAddSharp 
                className="icon" 
                onClick={() => setExperienceAddModal(true)}
              />
              {
                userId == currentUser?._id && experienceAddModal && 
                <ExperienceAddModal 
                experinceAddModal={experienceAddModal} 
                setExperienceAddModal={setExperienceAddModal}
                experinceData={experienceData}
                setExperienceData={setExperienceData}
                addExperience={addExperience}
                />
              }
            </span>}
          </div>
          {allExperience?.map((experience,index) => {
            return (
                <>
                    {
                    index==0 
                    ? 
                        <hr style={{ backgroundColor: '#b7b7b7', marginTop: '30px' }}/> 
                    : 
                        <hr style={{ backgroundColor: '#b7b7b7', marginTop: '10px' }}/>
                    }
                    <Experience experience={experience} setAllExperience={setAllExperience} userId={userId} currentUser={currentUser} showPencil={true}/>
                </>
            );
          })}
        </div>
       </StyledPosts>
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
  // background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
`;