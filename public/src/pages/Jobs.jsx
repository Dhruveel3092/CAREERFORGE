import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import Card from '../components/Card'
import JobsDes from './JobsDes'
import Sidebar from '../sidebar/Sidebar'
import { getJobsAPI  } from '../utils/APIRoutes'
import axios  from 'axios';
const Jobs = () => {

  const [isLoading,setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedCategory,setSelectedCategory] = useState(null)
  const [query,setQuery] = useState("")
  const handleInputChange = (event) => {
      setQuery(event.target.value)
  }
  const [jobs,setJobs] = useState([])
  const getJobs = async () => {
    const res = await axios.get(getJobsAPI);
    console.log(res.data);
    setJobs(res.data);
  }
  useEffect(() => {
    setIsLoading(true)
    getJobs();
    setIsLoading(false)
  },[])
  // console.log(jobs)

  // ----------filter jobs by title-------------
  
  const filteredItems = jobs.filter((job)=>job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  
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
    const filteredData = (jobs,selected, query) => {
      let filteredJobs = jobs;
    if(query){
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

    return filteredJobs.map((data,i)=><Card key = {i} data = {data}/>)
  }

   const result = filteredData(jobs,selectedCategory,query)
  

  return (
    <div >
      <Banner query={query} handleInputChange={handleInputChange}/>  
      {/* Main content */}
      <div className='bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12'>
    
        {/* left side */}

        <div className='bg-white p-4 rounded'><Sidebar handleChange={handleChange} handleClick={handleClick}/></div>

        {/* job cards */}

        <div className='col-span-2 bg-white p-4 rounded-sm'>
          {
             (isLoading) ? <p>Loading...</p> : (result.length > 0) ? <JobsDes result = {result}/> :
             <>
              <h3 className='text-lg font-bold mb-2'>{result.length} Jobs</h3>
              <p>No data found</p>
             </>
          }
         
         {/* Pagination here */}
         {
           result.length > 0 ? (
               <div className='flex justify-center mt-4 space-x-8'>
                 <button onClick={prevPage} disabled={currentPage === 1}  className='hover:underline'>Previous</button>
                 <span className='mx-2'>Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}</span>
                 <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                  className='hover:underline'>Next</button>
               </div>
           ) : ""
         }
        </div>

        {/* right side */}

        <div className='bg-white p-4 rounded'>Right</div>
        
      </div>
    </div>
  )
}

export default Jobs
