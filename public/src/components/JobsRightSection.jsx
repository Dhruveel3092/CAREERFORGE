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
        <p className='rightSectionDetails'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta facere dolor repellat minus similique cumque iusto laudantium eum adipisci vero ex illum, dignissimos rem quisquam modi neque delectus? Cupiditate, nisi.</p>
        <button className="CreateJobSubmitButton" onClick={()=>{navigate("/createResume")}} style={{display: 'block', margin: '2rem auto 0', fontSize:'15px' , backgroundColor:'purple', color:'white' , border:'blue' , borderRadius:'10px'}} >Create Your resume</button>
        <div className='rightSectionButtonDiv'>

        </div>
      </div>
    </div>
  )
}

export default JobsRightSection
