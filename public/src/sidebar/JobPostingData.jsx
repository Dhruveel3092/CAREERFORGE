import React from 'react'
import InputField from '../components/InputField'
import '../pages/JobStyle.css';

const JobPostingData = ({handleChange}) => {
    const now = new Date();
    // console.log(now);
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now -  7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    // console.log(twentyFourHoursAgo);
    // convert Date to String
    const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString().slice(0,10);
    const sevenDaysAgoDate = sevenDaysAgo.toISOString().slice(0,10);
    const thirtyDaysAgoDate = thirtyDaysAgo.toISOString().slice(0,10);
    // console.log(twentyFourHoursAgoDate);
  return (
    <div>
       <div>
      <h4 className='EmploymentTypeHeading'>Date of posting</h4>
      <div>
        <label className='sidebar-label-container'>
            <input type='radio' name='test' id='test' value="" onChange={handleChange}/>
            <span className='checkmark'></span>All
        </label>
        <InputField name='test' value={twentyFourHoursAgoDate} title="Last 24 Hours" handleChange={handleChange}/>
        <InputField name='test' value={sevenDaysAgoDate} title="Last 7 days" handleChange={handleChange}/>
        <InputField name='test' value={thirtyDaysAgoDate} title="Last Month" handleChange={handleChange}/>
      </div>
    </div>
    </div>
  )
}
export default JobPostingData
