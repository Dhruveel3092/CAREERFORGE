import React from 'react'
import Location from './Location'
import Salary from './Salary'
import JobPostingData from './JobPostingData'
import WorkExperience from './WorkExperience'
import EmploymentType from './EmploymentType'
import '../pages/JobStyle.css';

const Sidebar = ({handleChange, handleClick}) => {
  return (
    <div style={{marginTop: '1.25rem'}}>
      <h3 className='EmploymentTypeHeading'>Filters</h3>
      <Location handleChange={handleChange}/>
      <Salary handleChange={handleChange} handleClick={handleClick}></Salary>
      <JobPostingData handleChange={handleChange}></JobPostingData>
      <WorkExperience handleChange={handleChange}></WorkExperience>
      <EmploymentType handleChange={handleChange}></EmploymentType>
    </div>
  )
}

export default Sidebar
