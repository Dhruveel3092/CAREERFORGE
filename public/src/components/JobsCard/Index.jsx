/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useNavigate } from "react-router-dom";
import './Index.css';
import Login_Modal from "../Login_Modal";
import { useEffect, useState } from "react";
import axios from 'axios';
import { setApplicationStatus, getStatusOfJobApplication } from "../../utils/APIRoutes";
export default function JobsCard ({jobId, applicant ,currentUser ,allApplicants, setAllApplicants}) {
    const navigate = useNavigate();
    const [loginModal,setLoginModal] = useState(false);
    const [jobStatus,setJobStatus] = useState("");


    const getStatusOfJob = async () => {
      try{
      console.log(currentUser);
      console.log(applicant);
      const res = await axios.get(`${getStatusOfJobApplication}/${applicant.applicantId._id}/${jobId}`);
      return res.data;
      }
      catch(error){
        console.log(error)
      }
    }
    const handleAccept = async () => {
      await axios.post(`${setApplicationStatus}/${jobId}/${applicant.applicantId._id}`, {
        applicationStatus: "Accepted"
      });
      await setJobStatus("Accepted");
    };
    useEffect(() => {
    const fetchStatusOfJob = async () => {
      try {
        if (currentUser._id) {
          console.log(currentUser._id);
          const data = await getStatusOfJob();
          setJobStatus(data.applicationStatus)
          await console.log(jobStatus);
        }
      } 
      catch (error) {
        console.error('Error fetching status of job application:', error);
      }
    };
  
    fetchStatusOfJob();
  }, [currentUser._id, jobStatus]); 
  

    const handleReject = async () => {
      await axios.post(`${setApplicationStatus}/${jobId}/${applicant.applicantId._id}`,{
        applicationStatus : "Rejected"
      });
      await setJobStatus("Rejected");
    }
    

    return(
        <div className="jobs-card">
        <div className="job-image-wrapper">
          <img
            onClick={() => {
              if (currentUser) {
                navigate(`/profile/${applicant.applicantId.username}`);
              } else {
                setLoginModal(true);
              }
            }}
            alt="profile-image"
            className="user-image"
            src={applicant.applicantId.avatarImage}
          />
          <div 
            onClick={() => {
              if (currentUser) {
                navigate(`/profile/${applicant.applicantId.username}`);
              } else {
                setLoginModal(true);
              }
            }}
          >
            <p className="name">
              {applicant.applicantId.username}
            </p>
            <p className="headline">
            { 
                applicant?.applicantId?.headline?.length > 50
                ? `${applicant?.applicantId.headline.substring(0, 50)}...`
                : applicant?.applicantId?.headline
            }
            </p>
          </div>
  
        
  
          {loginModal && 
            <Login_Modal
              loginModal={loginModal}
              setLoginModal={setLoginModal}
            />
          }
  
        </div>
       <div className="buttons">
        <button className="resumeButton" onClick={() => window.open(applicant.resumeLink, '_blank')}> Open the Resume </button>
        {jobStatus === "Accepted" ?
         <button disabled className="AcceptButton"> Accepted </button>
        : 
        jobStatus === "Rejected" ?
         <button disabled className="RejectButton">Not Accepted</button>
        :
        <>
        <button className="AcceptButton" onClick={handleAccept}>Accept</button>
        <button className="RejectButton" onClick={handleReject} >Reject</button>
        </>
        }
        </div>
      </div>
    )
}