import React, { useState , useEffect } from "react";
import "./index.css"
import endorsement from "../../assets/endorsement.png";
import axios from "axios";
import { MdDone } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { addEndorsementAPI, deleteSkillAPI, removeEndorsementAPI } from "../../utils/APIRoutes";
import EndorsementModal from "../Endorsement_Modal";
import DeleteSkillModal from "../DeleteSkillModal";


export default function Skill( { skill , setAllSkills , currentUser , userId , showPencil } ) {
  
    const [allEndorsements,setAllEndorsements] = useState(undefined);
    const [endorsementCount , setEndorsementCount] = useState(0);
    const [endorsed,setEndorsed] = useState(false);
    const [endorsementModal,setEndorsementModal] = useState(false);
    const [deleteSKillModal,setDeleteSkillModal] = useState(false);

    useEffect(() => {
        if(skill)
        {
            setAllEndorsements(skill.endorsements);
            console.log(skill.endorsements)
        }
    },[skill]);

    useEffect(() => {
        if(allEndorsements)
        {
            const result = allEndorsements.find(endorsement => endorsement._id==currentUser._id)
            if(result)
                setEndorsed(true);
        }
    },[allEndorsements]);

    useEffect(() => {
        if(allEndorsements)
        {
            setEndorsementCount(allEndorsements.length);
        }
    },[allEndorsements])

    const addEndorsement = async () => {
        const {data} = await axios.post( addEndorsementAPI , { userId:userId , endorsementId: currentUser?._id , skillId:skill?._id } )
        // const newEndorsedUsers = [{
        //      _id:currentUser?._id,
        //      username:currentUser?.username,
        //      avatarImage:currentUser?.avatarImage,
        //      headline:currentUser?.headline,
        // },...allEndorsements];
        // setAllEndorsements(newEndorsedUsers);
        setAllEndorsements(data.skill.endorsements);
        setEndorsed(true);
    }

    const removeEndorsement = async () => {
        const {data} = await axios.post( removeEndorsementAPI , { userId:userId , endorsementId: currentUser?._id , skillId:skill?._id } )
        // let newEndorsedUsers = allEndorsements.filter(user =>user._id!=currentUser?._id);
        // setAllEndorsements(newEndorsedUsers);
        setAllEndorsements(data.skill.endorsements);
        console.log(allEndorsements);
        console.log(data.skill.endorsements);
        setEndorsed(false);
    }

    const deleteSkill = async () => {
        const {data} = await axios.delete(`${deleteSkillAPI}/${userId}/${skill._id}`,{userId,skillId:skill._id});
        setAllSkills(data);
        console.log(data);
    }

  return (
    <>
        <div className="skill">
            <div className="skill-name">
                {skill.skillName}
                {userId==currentUser?._id && showPencil && <span><BsTrash 
                    onClick={()=>setDeleteSkillModal(true)} 
                    className="skill-trash-button" 
                    style={{ fontSize: '21px'}}
                    />
                    <DeleteSkillModal
                        deleteSkillModal = {deleteSKillModal}
                        setDeleteSkillModal = {setDeleteSkillModal}
                        deleteSkill={deleteSkill}
                    />
                    </span>
                }  
                
            </div>
            {
                currentUser && allEndorsements?.length>0 && 
                <div className="endorsement">
                <img 
                    src={endorsement} 
                    alt="Endorsement Icon" 
                    className="endorsement-icon" 
                    onClick={ () => setEndorsementModal(true)}
                />
                <span 
                    className="endorsement-count" 
                    onClick={ () => setEndorsementModal(true)}
                >
                    {endorsementCount} endorsements
                </span>
                </div>
            }
            <EndorsementModal 
                endorsementModal = {endorsementModal}
                setEndorsementModal = {setEndorsementModal}
                allEndorsements = {allEndorsements}
            />
            {
                userId != currentUser?._id &&
                (
                    <>
                    {endorsed ?
                        <button className="endorsed-btn" onClick={removeEndorsement}>
                            <MdDone/> Endorsed
                        </button>
                        :
                        <button className="endorse-btn" onClick={addEndorsement}>
                            Endorse
                        </button>
                    }
                    </>
                )
            }
        </div>
    </>
  );
}
