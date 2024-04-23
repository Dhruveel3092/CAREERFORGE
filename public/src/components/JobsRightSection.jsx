import React from 'react'
import '../pages/JobStyle.css'
import { FaRocket } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import styled from "styled-components";

const JobsRightSection = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <h3 className='rightHeading'> <FaRocket/>Get Notified Faster</h3>
        <p className='rightSectionDetails'>Crafting a compelling resume is a pivotal step towards securing your desired position. A well-structured resume not only showcases your skills and experiences but also serves as your first impression on potential employers.</p>
        <button className="CreateJobSubmitButton" onClick={()=>{navigate("/createResume")}} style={{display: 'block', margin: '2rem auto 0', fontSize:'15px' , backgroundColor:'purple', color:'white' , border:'blue' , borderRadius:'10px'}} >Create Your resume</button>
        <div className='rightSectionButtonDiv'>
        </div>
      </div>
    </div>
  )
}

export default JobsRightSection
