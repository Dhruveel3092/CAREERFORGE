import React, { useState } from 'react'
import {FiMapPin, FiSearch} from 'react-icons/fi'
import '../pages/JobStyle.css';
const Banner = ({titlequery,handleTitleChange,locationquery,handleLocationChange}) => {

  return (
    <div className='BannerOuterDiv'>
      <h1 className='BannerHeading'>Find your <span style={{color:'white'}}>new Job</span> today</h1>
      <p className='BannerSubHeading'>Thousands of jobs in the computer, engineering 
        and technology sectors are wating for you</p>

     <form>
        <div className='BannerFormOuterDiv'>

            <div className='BannerInputField'>
                <input type="text" name='jobTitle' id='jobTitle' placeholder='What position are you looking for?'className='BannerJobtitleSearch'
                onChange={handleTitleChange}
                value={titlequery}
                 
                />
                  <FiSearch className='BannerIcon'/>        
            </div>

            <div className='BannerLocationSerachInputField'>
                <input type="text" name='jobLocation' id='jobLocation' placeholder='Location'className='BannerloactionSearch'
                onChange={handleLocationChange}
                value={locationquery}
                />
                <FiMapPin className='BannerIcon'/>           
            </div>
            
            {/* <button type='submit' className='BannerSubmit'>Search</button> */}
        </div>
     </form>

    </div>
  )
}

export default Banner
