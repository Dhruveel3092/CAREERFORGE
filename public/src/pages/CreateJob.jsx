import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { host } from "../utils/APIRoutes"; 
import { addJobAPI } from "../utils/APIRoutes";
import Topbar from "../components/Topbar";
import styled from "styled-components";
import '../pages/JobStyle.css'
const CreateJob = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [job,setJob] = useState({skills:[]});
  const [currentUser,setCurrentUser] = useState(undefined)
  const navigate = useNavigate();
  useEffect(() => {
    // console.log(product);
  }, [job]);
  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("current",currentUser)
       // console.log(response,"response")
        const response = await axios.get(`${host}/login/sucess`, {withCredentials: true});
        console.log(response,"response")
       if(response.data.user) setCurrentUser(response.data.user);
        console.log("current",currentUser)
        console.log("response",response.data.user)
    } catch (error) {
      console.log(error)
      navigate("/login")
    }
    };

    
    fetchData();
  }, []);
  const handleChange = (e) => {
    setJob({...job, [e.target.name] : e.target.value});
  }
  const updateJob = async () => {
    setJob(job => {
      const updatedJob = { ...job, skills: selectedOption , user:currentUser._id ,isApplied:true };
      console.log(updatedJob); 
      postJob(updatedJob);
      return updatedJob;
    });
  };
  const postJob = async (job) => {
    const postedJob = await axios.post(`${addJobAPI}`, job);
    console.log(postedJob)
  }
  
  
  const handleSubmit =  (e) => {
    e.preventDefault();
     updateJob(); // updateJob is calling postJob
     navigate('/allPostedJobs');
  };
  
  const getCurrentDate = ()=> {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();

    // Ensure month and day are in double digits
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
  }
  const options = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "C++", label: "C++" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "React", label: "React" },
    { value: "Node", label: "Node" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Redux", label: "Redux" }
  ];
  return (
<StyledHome>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
    <div className="CreateJobOuterMost ">
       
      {/* form */}
      <div className="CreateJobForm">

        <form onSubmit={handleSubmit} className="CreateJobFormTag">
          {/* 1st row */}
          <div className="create-job-flex">
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Job title</label>
              <input
                type="text"
                placeholder="Ex: Senior Software Engineer"
                name = "jobTitle"
                id = "jobTitle"
                onChange={handleChange}
                className="create-job-input"
              />
            </div>
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Company name</label>
              <input
                type="text"
                placeholder="Ex: Microsoft"
                name = "companyName"
                id = "comapnyName"
                onChange={handleChange}
                className="create-job-input"
              />
            </div>
          </div>

          {/* 2nd row */}
          <div className="create-job-flex">
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Minimum Salary</label>
              <input
                type="text"
                placeholder="$20k"
                name = "minPrice"
                id = "minPrice"
                onChange={handleChange}
                className="create-job-input"
              />
            </div>
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Maximum Salary</label>
              <input
                type="text"
                placeholder="$120k"
                name = "maxPrice"
                id = "maxPrice"
                onChange={handleChange}
                className="create-job-input"
              />
            </div>
          </div>

          {/* 3rd row */}
          <div className="create-job-flex">
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Salary type</label>
              <select className="create-job-input" name="salaryType" onChange={handleChange}>
                <option value="">Choose your salary</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Job Location</label>
              <input
                type="text"
                placeholder="Ex: New-York"
                name = "jobLocation"
                id = "jobLocation"
                onChange={handleChange}
                className="create-job-input"
              />
            </div>
          </div>

          {/* 4th row */}
          <div className="create-job-flex">
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Job Posting Date</label>
              <input
                type="Date"
                placeholder="Ex: 2024-03-23"
                name = "jobPostingDate"
                id = "jobPostingDate"
                onChange={handleChange}
                className="create-job-input"
                min={getCurrentDate()}

              />
            </div>
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Experience Level</label>
              <select
                name="experienceLevel"
                onChange={handleChange}
                className="create-job-input"
              >
                <option value="">Choose your experience</option>
                <option value="NoExperience">Any experience</option>
                <option value="Internship">Internship</option>
                <option value="Work remotely">Work remotely</option>
              </select>
            </div>
          </div>

          {/* 5th row */}
          <div>
            <label className="CreateJobJobTitle">Required Skill Sets</label>
            <CreatableSelect       
              defaultValue={selectedOption}
              onChange = {setSelectedOption}
              name="skills"
              options={options}
              isMulti
              className="create-job-input py-4"
            />
          </div>

          {/* 6th row */}
          <div className="create-job-flex">
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Company Logo</label>
              <input
                type="url"
                placeholder="Paste your company logo URL: https://weLive.com/img1"
                name = "companyLogo"
                id = "companyLogo"
                onChange={handleChange}
                className="create-job-input"
              />
            </div>
            <div className="CreateJobFlexUnder">
              <label className="CreateJobJobTitle">Employment Type</label>
              <select
                name="employmentType"
                onChange={handleChange}
                className="create-job-input"
              >
                <option value="">Select your job-type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>

          {/* 7th row */}
          <div style={{width:100}}>
            <label className="CreateJobJobTitle">Job Description</label>
            <textarea
              className="CreateJobDescription"
              rows={6}
              placeholder="Job Description"
              
              name = "jobDescription"
                id = "jobDescription"
                onChange={handleChange}
            ></textarea>
          </div>
          <input
            type="submit"
            className="CreateJobSubmitButton"
            style={{display: 'block', margin: '2rem auto 0', fontSize:'18px'}}
          />
        </form>
      </div>
    </div>
    </StyledPosts>
    </StyledHome>
  );
};

export default CreateJob;

        
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