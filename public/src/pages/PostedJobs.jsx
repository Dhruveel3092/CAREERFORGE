import React, { useState , useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import JobsDes from './JobsDes';
import Card from '../components/Card';
import { getAllPostedJobs, host } from "../utils/APIRoutes"; 
import axios from 'axios';
const PostedJobs = () => {
  const [currentUser,setCurrentUser] = useState(undefined)
  const [jobs,setJobs] = useState([]);
  const [isLoading,setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate()
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
  const getPostedJobsData = async () => {
    if(currentUser){const res = await axios.get(`${getAllPostedJobs}/${currentUser._id}`);
    console.log(res.data);
    setJobs(res.data);}
  }

  useEffect(() => {
    setIsLoading(true)
    getPostedJobsData();
    setIsLoading(false)
  },[currentUser]);
  
   // Calculate the index range
    const calculatePageRange =()=>{
      const startIndex = (currentPage - 1)*itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return {startIndex,endIndex};
    }

  // function for next page
  const nextPage = () => {
    if(currentPage < Math.ceil(jobs.length / itemsPerPage)){
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
const main = (jobs) => {
    let postedJobs = jobs;
    const {startIndex,endIndex} = calculatePageRange();
     postedJobs = postedJobs.slice(startIndex,endIndex);
    return jobs.map((data,i) => <Card key = {i} data = {data}></Card>);
}
const result = main(jobs);
  return (
    <div className='bg-[#FAFAFA] px-4 py-12 flex justify-center'> {/* Utilizing flexbox */}
    {/* job cards */}
    <div className='col-span-2 bg-white p-4 rounded-sm border'>
        {
            (isLoading) ? <p>Loading...</p> : (result.length > 0) ? <JobsDes result={result} /> :
                <>
                    <h3 className='text-lg font-bold mb-2'>{result.length} Jobs</h3>
                    <p>No data found</p>
                </>
        }

        {/* Pagination here */}
        {
            result.length > 0 ? (
                <div className='flex justify-center mt-4 space-x-8'>
                    <button onClick={prevPage} disabled={currentPage === 1} className='hover:underline'>Previous</button>
                    <span className='mx-2'>Page {currentPage} of {Math.ceil(jobs.length / itemsPerPage)}</span>
                    <button onClick={nextPage} disabled={currentPage === Math.ceil(jobs.length / itemsPerPage)} className='hover:underline'>Next</button>
                </div>
            ) : ""
        }
    </div>
</div>

  )
}

export default PostedJobs
