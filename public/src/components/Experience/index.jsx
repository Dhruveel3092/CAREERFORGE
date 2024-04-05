import React, { useState , useEffect } from "react";
import "./index.css"
import axios from "axios";
import { HiOutlinePencil } from "react-icons/hi";
import { LuDot } from "react-icons/lu";
import { deleteExperienceAPI, updateExperienceAPI } from "../../utils/APIRoutes";
import DeleteExperienceModal from "../DeleteExperienceModal";
import uber_com_logo from "../../assets/uber_com_logo.jpeg"
import ExperienceUpdateModal from "../ExperienceUpdateModal";

export default function Experience( { experience , setAllExperience , currentUser , userId , showPencil=false } ) {
  
    const [updatedExperienceData,setUpdatedExperienceData] = useState(experience);
    const [deleteExperienceModal,setDeleteExperienceModal] = useState(false);
    const [experienceUpdateModal,setExperienceUpdateModal] = useState(false);
    const [showMore, setShowMore] = useState(showPencil);

    const deleteExperience = async () => {
        const {data} = await axios.delete(`${deleteExperienceAPI}/${userId}/${experience._id}`,{userId,experienceId:experience._id});
        setAllExperience(data);
        console.log(data);
    }

    const updateExperience = async () => {
        const {data} = await axios.put(`${updateExperienceAPI}/${userId}/${experience._id}`,{updatedExperienceData});
        setAllExperience(data.experience);
        setExperienceUpdateModal(false);
        console.log(data);
    }

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      };   
      
      const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();
        const diffInMilliseconds = Math.abs(endDate - startDate);
        const years = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        return `${years} years, ${months} months`;
    };

  return (
    <div className="education">
      <div>
        <img src={uber_com_logo} alt="School Logo" className="school-logo" />
      </div>
      <div className="education-information">
        <div className="education-header">
            <div className="education-details">
            <h3>{experience.role}</h3>
            <p>{`${experience.company} `} { experience.employment_type && <LuDot className="dot"/> } {`${experience.employment_type ? `${experience.employment_type}` : ''}`}</p>
            </div>
        </div>
        <div className="education-duration">
            <p>{formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'present'} <LuDot className="dot"/> {calculateDuration(experience.startDate,experience.endDate)}</p>
        </div>
        {experience.location && <div className="education-grade">
            <p>{`${experience.location}`} { experience.location_type && <LuDot className="dot"/> } {`${experience.location_type ? `${experience.location_type}` : ''}`}</p>
        </div>}
        <div className="status">
            <p>{ showMore ? experience.description : `${experience.description.slice(0, 210)}` } </p>
            {experience.description.length > 210 && !showMore && (
            <span className="see-more-btn-text" onClick={()=>setShowMore(true)}>...see more</span>
            )}
        </div>
      </div>
      <div>
      {userId==currentUser?._id && showPencil && <span><HiOutlinePencil 
            onClick={()=>{
                setExperienceUpdateModal(true)} 
            }
            className="education-trash-button updateData"
            size={25} 
            style={{ fontSize: '21px'}}
            />
            <ExperienceUpdateModal
                experience = {experience}
                experienceUpdateModal = {experienceUpdateModal}
                setExperienceUpdateModal = {setExperienceUpdateModal}
                deleteExperienceModal = {deleteExperienceModal}
                setDeleteExperienceModal = {setDeleteExperienceModal}
                updatedExperienceData = {updatedExperienceData}
                setUpdatedExperienceData = {setUpdatedExperienceData}
                updateExperience = {updateExperience}
                deleteExperience = {deleteExperience}
            />

            <DeleteExperienceModal
                setExperienceUpdateModal = { setExperienceUpdateModal }
                deleteExperienceModal = {deleteExperienceModal}
                setDeleteExperienceModal = {setDeleteExperienceModal}
                deleteExperience = {deleteExperience}
            />
            </span>
        }  
      </div>
    </div>
  );
}