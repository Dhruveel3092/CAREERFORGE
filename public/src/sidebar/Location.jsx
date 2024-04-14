import React from 'react'
import InputField from '../components/InputField'

const Location = ({handleChange}) => {
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Location</h4>
      <div>
        <label className='sidebar-label-container'>
            <input type='radio' name='test' id='test' value="" onChange={handleChange}/>
            <span className='checkmark'></span>All
        </label>
        <InputField name='test' value="london" title="London" handleChange={handleChange}/>
        <InputField name='test' value="seattle" title="Seattle" handleChange={handleChange}/>
        <InputField name='test' value="madrid" title="Madrid" handleChange={handleChange}/>
        <InputField name='test' value="boston" title="Boston" handleChange={handleChange}/>
      </div>
    </div>
  )
}

export default Location
