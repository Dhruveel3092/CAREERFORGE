import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Banner from '../components/Banner'
import Card from '../components/Card'
import JobsDes from './JobsDes'
import Sidebar from '../sidebar/Sidebar'
import { getJobsAPI , host, getAppliedJobsByUserId, getAllPostedJobsByUserId } from '../utils/APIRoutes'
import Topbar from "../components/Topbar";
import styled from "styled-components";
import './JobStyle.css'
import axios  from 'axios';
import JobsRightSection from '../components/JobsRightSection'
const Jobs = () => {

  const [isLoading,setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedCategory,setSelectedCategory] = useState(null)
  const [titlequery,setTitleQuery] = useState("")
  const [locationquery,setLocationQuery] = useState("")
  const [currentUser,setCurrentUser] = useState(undefined)
  const [jobs,setJobs] = useState([])
  
  const navigate = useNavigate()

  

  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("current",currentUser)
       // console.log(response,"response")
        const response = await axios.get(`${host}/login/sucess`, {withCredentials: true});
       // console.log(response,"response")
       if(response.data.user) setCurrentUser(response.data.user);
        //console.log("current",currentUser)
        //console.log("response",response.data.user)
    } catch (error) {
      console.log(error)
      navigate("/login")
    }
    };
    
    fetchData();
  }, []);
  
  

  const handleTitleChange = (event) => {
    setTitleQuery(event.target.value);
  }
  const handleLocationChange = (event) => {
    setLocationQuery(event.target.value);
  }
  const getJobs = async () => {
    try {
      // Fetch all jobs
      const res = await axios.get(`${getJobsAPI}`);
      const allJobs = res.data;
      console.log(allJobs);
      
      // Fetch applied jobs by user
      const res2 = await axios.get(`${getAppliedJobsByUserId}/${currentUser._id}`);
      const appliedJobs = res2.data;
      console.log(appliedJobs);

      // Fetch posted jobs by user
      const res3 = await axios.get(`${getAllPostedJobsByUserId}/${currentUser._id}`);
      const postedJobs = res3.data;
      console.log(postedJobs);

      // Filter out the applied jobs from all jobs
      const remainingJobsWithPosted = await allJobs.filter(job =>
        !appliedJobs.some(appliedJob => appliedJob.appliedJobId._id === job._id)
      );

      // Filter out the posted jobs from all jobs

      const remainingJobs = await remainingJobsWithPosted.filter(job =>
         !postedJobs.some(postedJob => postedJob._id === job._id)
        );
      // Set the remaining jobs
      setJobs(remainingJobs);
      console.log(remainingJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  
  // ----------filter jobs by title-------------
  
  const filteredItems1 = jobs.filter((job)=>job.jobTitle.toLowerCase().indexOf(titlequery.toLowerCase()) !== -1);
  const filteredItems2 = jobs.filter((job) => job.jobLocation.toLowerCase().indexOf(locationquery.toLowerCase()) !== -1) ;
  console.log(filteredItems1,filteredItems2);
  const filteredItems = filteredItems1.filter((job1) => {
    return filteredItems2.some((job2) => job2 === job1);
});
  useEffect(() => {
    if(currentUser){
      console.log(currentUser);
      setIsLoading(true)
    getJobs();
    setIsLoading(false)}
  },[currentUser])
  // console.log(jobs)

  
  // ----------filtering based on radio buttons-----------
  const handleChange = (event)=>{
    setSelectedCategory(event.target.value)
  }

  // -----------filtering based on buttons-------------
  const handleClick = (event)=>{
    setSelectedCategory(event.target.value)
  }
  
  // Calculate the index range
  const calculatePageRange =()=>{
    const startIndex = (currentPage - 1)*itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {startIndex,endIndex};
  }

  // function for next page
  const nextPage = () => {
    if(currentPage < Math.ceil(filteredItems.length / itemsPerPage)){
      setCurrentPage(currentPage + 1);
    }
    // console.log("Next clicked!")
  }

  // function for the previous page
  const prevPage = () => {
     if(currentPage > 1){
      setCurrentPage(currentPage - 1);
     }
    }
    // ----------main function----------
    const filteredData = (jobs,selected, titlequery, locationquery) => {
      let filteredJobs = jobs;
    if(titlequery || locationquery){
      filteredJobs = filteredItems
    }
    if(selected){
      filteredJobs = filteredJobs.filter(({jobLocation,maxPrice,salaryType,employmentType,postingDate,experienceLevel})=>(
        jobLocation.toLowerCase() === selected.toLowerCase() ||
        parseInt(maxPrice) <= parseInt(selected) ||
        salaryType.toLowerCase() === selected.toLowerCase() ||
        employmentType.toLowerCase() === selected.toLowerCase() ||
          postingDate >= selected ||
          experienceLevel.toLowerCase() === selected.toLowerCase()
      ));
      console.log(filteredJobs)
    }

    // Slice the data based on current page
    const {startIndex,endIndex} = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex,endIndex);
      
    return   filteredJobs.map((data,i)=><Card key = {i} data = {data} currentUser = {currentUser}/>)
    
    }
    
  

   const result = filteredData(jobs,selectedCategory,titlequery,locationquery);
  

  return (
    <StyledHome>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
    <div className="Banner">
      <Banner titlequery={titlequery} handleTitleChange={handleTitleChange} locationquery = {locationquery} handleLocationChange={handleLocationChange} />  
      {/* Main content */}
      <div className="JobsMainContent">
    
        {/* left side */}

        <div className='JobsLeftRightSide'><Sidebar handleChange={handleChange} handleClick={handleClick}/></div>

        {/* job cards */}

        <div className='JobsCard'>
          {
             (isLoading) ? <p>Loading...</p> : (result.length > 0) ? <JobsDes result = {result}/> :
             <>
              <h3 className='JobsCardInner'>{result.length} Jobs</h3>
              <p>No data found</p>
             </>
          }
         
         {/* Pagination here */}
         {
           result.length > 0 ? (
               <div className='JobsPagination'>
                 <button onClick={prevPage} disabled={currentPage === 1}  className='PreviousButton'>Previous</button>
                 <span className='JobsCardSpan'>Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}</span>
                 <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                  className='PreviousButton'>Next</button>
               </div>
           ) : ""
         }
        </div>

        {/* right side */}

        <div className='JobsLeftRightSide'><JobsRightSection/></div>
        
      </div>
    </div>
    </StyledPosts>
    </StyledHome>
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
  border: 1px solid #242527;
  border-radius: 8px;
`;
export default Jobs
