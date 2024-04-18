import React from 'react'
import InputField from '../components/InputField'
import '../pages/JobStyle.css';

const EmploymentType = ({handleChange}) => {
  return (
    <div>
       <div>
      <h4 className='EmploymentTypeHeading'>Employment type</h4>
      <div>
        <label className='sidebar-label-container'>
            <input type='radio' name='test' id='test' value="" onChange={handleChange}/>
            <span className='checkmark'></span>All
        </label>
        <InputField name='test' value="Full-time" title="Full-time" handleChange={handleChange}/>
        <InputField name='test' value="Temporary" title="Temporary" handleChange={handleChange}/>
        <InputField name='test' value="Part-time" title="Part-time" handleChange={handleChange}/>
      </div>
    </div>
    </div>
  )
}

export default EmploymentType
