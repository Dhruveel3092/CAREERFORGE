import React from 'react'
import Button from './Button'
import InputField from '../components/InputField'

const Salary = ({handleChange,handleClick}) => {
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Salary</h4>
      <div className='mb-4'>
        <Button onClickHandler={handleClick} value="" title="Hourly"></Button>
        <Button onClickHandler={handleClick} value="Monthly" title="Monthly"></Button>
        <Button onClickHandler={handleClick} value="Yearly" title="Yearly"></Button>
      </div>

      <div>
      <label className='sidebar-label-container'>
            <input type='radio' name='test' id='test' value="" onChange={handleChange}/>
            <span className='checkmark'></span>All
        </label>
        <InputField name='test2' value={30} title="< 30000k" handleChange={handleChange}/>
        <InputField name='test2' value={50} title="< 50000k" handleChange={handleChange}/>
        <InputField name='test2' value={80} title="< 80000k" handleChange={handleChange}/>
        <InputField name='test2' value={100} title="< 100000k" handleChange={handleChange}/>
      </div>
    </div>
  ) 
}

export default Salary
