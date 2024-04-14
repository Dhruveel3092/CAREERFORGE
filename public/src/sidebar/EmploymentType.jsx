import React from 'react'
import InputField from '../components/InputField'

const EmploymentType = ({handleChange}) => {
  return (
    <div>
       <div>
      <h4 className='text-lg font-medium mb-2'>Employment type</h4>
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
