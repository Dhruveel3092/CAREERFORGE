import React, { useState , useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { addEducationAPI, getProfileData ,host} from "../../utils/APIRoutes";
import axios from "axios";
import { IoAddSharp } from "react-icons/io5";
import Topbar from "../../components/Topbar";
import styled from "styled-components";
import "./index.css";
import Education from "../../components/Education";
import EducationAddModal from "../../components/EducationAddModal";

export default function AllEducation() {
  const [currentUser,setCurrentUser] = useState(undefined);
  const [allEducation,setAllEducation] = useState(undefined);
  const { userId , username } = useParams();
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
  const navigate = useNavigate();

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
      setAllEducation(data.education);
    };  
    fetchData();
  }, [userId]);

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

  return (
    <>
    <StyledHome>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
        <div className="all-skills">
          <div className="username-skill">
            Education
            {userId == currentUser?._id && <span className="icon-container-2">
              <IoAddSharp 
                className="icon" 
                onClick={() => setEducationAddModal(true)}
              />
              {
                userId == currentUser?._id && educationAddModal && 
                <EducationAddModal 
                educationAddModal={educationAddModal} 
                setEducationAddModal={setEducationAddModal}
                formData={formData}
                setFormData={setFormData}
                addEducation={addEducation}
                />
              }
            </span>}
          </div>
          {allEducation?.map((education,index) => {
            return (
                <>
                    {
                    index==0 
                    ? 
                        <hr style={{ backgroundColor: '#b7b7b7', marginTop: '30px' }}/> 
                    : 
                        <hr style={{ backgroundColor: '#b7b7b7', marginTop: '10px' }}/>
                    }
                    <Education education={education} setAllEducation={setAllEducation} userId={userId} currentUser={currentUser} showPencil={true}/>
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
  border: 1px solid #242527;
  border-radius: 8px;
`;