import React, { useState } from "react";
import "./index.css"
import axios from "axios";
import { BsTrash } from "react-icons/bs";
import { deleteEducationAPI } from "../../utils/APIRoutes";
import DeleteEducationModal from "../DeleteEducationModal";
import motilal_nehru_national_institute_of_technology_logo from "../../assets/motilal_nehru_national_institute_of_technology_logo.jpeg"


export default function Education( { education , setAllEducation , currentUser , userId , showPencil=false } ) {
  
    const [deleteEducationModal,setDeleteEducationModal] = useState(false);
    const [showMore, setShowMore] = useState(showPencil);

    const deleteEducation = async () => {
        const {data} = await axios.delete(`${deleteEducationAPI}/${userId}/${education._id}`,{userId,educationId:education._id});
        setAllEducation(data);
        console.log(data);
    }

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      };      

  return (
    <div className="education">
      <div>
        <img src={motilal_nehru_national_institute_of_technology_logo} alt="School Logo" className="school-logo" />
      </div>
      <div className="education-information">
        <div className="education-header">
            <div className="education-details">
            <h3>{education.school}</h3>
            <p>{`${education.degree}${education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ''}`}</p>
            </div>
        </div>
        <div className="education-duration">
            <p>{formatDate(education.startDate)} {education.startDate && education.endDate && '-'} {formatDate(education.endDate)}</p>
        </div>
        {education.grade && <div className="education-grade">
            <p>Grade: {education.grade}</p>
        </div>}
        {education.activitiesAndSocieties && <div className="education-activities">
            <p>Activities and Societies: {education.activitiesAndSocieties}</p>
        </div>}
        <div className="status">
            <p>{ showMore ? education.description : `${education.description.slice(0, 210)}` } </p>
            {education.description.length > 210 && !showMore && (
            <span className="see-more-btn-text" onClick={()=>setShowMore(true)}>...see more</span>
            )}
        </div>
      </div>
      <div>
      {userId==currentUser?._id && showPencil && <span><BsTrash 
            onClick={()=>setDeleteEducationModal(true)} 
            className="education-trash-button" 
            style={{ fontSize: '21px'}}
            />
            <DeleteEducationModal
                deleteEducationModal = {deleteEducationModal}
                setDeleteEducationModal = {setDeleteEducationModal}
                deleteEducation={deleteEducation}
            />
            </span>
        }  
      </div>
    </div>
  );
}