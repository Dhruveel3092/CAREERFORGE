import React from 'react'
import Button from './Button'
import InputField from '../components/InputField'
import '../pages/JobStyle.css';

const Salary = ({handleChange,handleClick}) => {
  return (
    <div>
      <h4 className='EmploymentTypeHeading'>Salary</h4>
      <div style={{ marginBottom: '1rem' }}>

        <Button onClickHandler={handleClick} value="Hourly" title="Hourly"></Button>
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
