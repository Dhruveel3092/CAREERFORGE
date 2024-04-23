import React from 'react'
import InputField from '../components/InputField'
import '../pages/JobStyle.css';

const WorkExperience = ({handleChange}) => {
  return (
    <div>
        <div>
      <h4 className='EmploymentTypeHeading'>Work Experience</h4>
      <div>
        <label className='sidebar-label-container'>
            <input type='radio' name='test' id='test' value="" onChange={handleChange}/>
            <span className='checkmark'></span>Any Experience
        </label>
        <InputField name='test' value="Internship" title="Internship" handleChange={handleChange}/>
        <InputField name='test' value="Work remotely" title="Work remotely" handleChange={handleChange}/>
        
      </div>
    </div>
    </div>
  )
}

export default WorkExperience
