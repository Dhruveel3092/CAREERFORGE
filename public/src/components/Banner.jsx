import React, { useState } from 'react'
import {FiMapPin, FiSearch} from 'react-icons/fi'
import '../pages/JobStyle.css';
const Banner = ({query,handleInputChange}) => {

  return (
    <div className='BannerOuterDiv'>
      <h1 className='BannerHeading'>Find your <span style={{color:'#0000D0'}}>new Job</span> today</h1>
      <p className='BannerSubHeading'>Thousands of jobs in the computer, engineering 
        and technology sectors are wating for you</p>

     <form>
        <div className='BannerFormOuterDiv'>

            <div className='BannerInputField'>
                <input type="text" name='title' id='title' placeholder='What position are you looking for?'className='BannerJobtitleSearch'
                onChange={handleInputChange}
                value={query}
                />
                <FiSearch className='BannerIcon'/>           
            </div>

            <div className='BannerLocationSerachInputField'>
                <input type="text" name='title' id='title' placeholder='Location'className='BannerloactionSearch'
                onChange={handleInputChange}
                />
                <FiMapPin className='BannerIcon'/>           
            </div>
            
            <button type='submit' className='BannerSubmit'>Search</button>
        </div>
     </form>

    </div>
  )
}

export default Banner
