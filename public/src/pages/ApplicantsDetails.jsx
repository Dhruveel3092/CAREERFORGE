import React, { useEffect, useState } from 'react'
import { useParams , useNavigate } from "react-router-dom";
import { getApplicantsDetails ,host } from "../utils/APIRoutes";
import Topbar from "../components/Topbar";
import styled from "styled-components";
import axios from 'axios';
import JobsCard from '../components/JobsCard/Index';
const ApplicantsDetails = () => {
    const {jobId} = useParams();
    const [currentUser,setCurrentUser] = useState(undefined);
    const [allApplicants, setAllApplicants] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${host}/login/sucess`, { withCredentials: true });
           if(response.data.user) setCurrentUser(response.data.user);
           console.log("current",currentUser)
           console.log("response",response.data.user)
           console.log("job",jobId)
        } catch (error) {
          console.log(error)
          navigate("/login")
        }
    
        };
        fetchData();
      }, []);

      useEffect(()=>{
         const fetchData = async () =>  {
            const {data} = await axios.get(`${getApplicantsDetails}/${jobId}`);
             setAllApplicants(data);

             console.log(data);
         }
         fetchData();

      },[currentUser]);
      


 
  return (
     <>
    <StyledHome>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
        <div className="all-posts">
          <div className="username-posts">Applicants</div>
          {(allApplicants.length===0) ? (<h1>No Applicants</h1>) : (allApplicants.map((applicant) => {
            return (
                <div key={applicant.id}>
                    <JobsCard jobId={jobId} setAllApplicants={setAllApplicants} applicant={applicant} currentUser={currentUser} allApplicants={allApplicants} />
                </div>
            );
          }))}
        </div>
       </StyledPosts>
    </StyledHome>
    </>
  )
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
`;
export default ApplicantsDetails
