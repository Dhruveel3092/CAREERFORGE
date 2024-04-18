import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { host, getJobPosterById, getSignature, addApplicantDetails, addAppliedJob, getStatusOfJobApplication } from "../utils/APIRoutes";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import '../pages/JobStyle.css';

const Card = ({ data, currentUser }) => {
  const { _id, companyName, companyLogo, minPrice, maxPrice, salaryType, jobLocation, employmentType, jobPostingDate, description, jobTitle } = data;
  const [jobPoster, setJobPoster] = useState(undefined);
  const [image,setImage] = useState(null);
  const navigate = useNavigate();
  const [isApplied,setIsApplied] = useState(undefined);

  const getStatusOfJob = async () => {
    try{
    console.log(currentUser);
    const res = await axios.get(`${getStatusOfJobApplication}/${currentUser._id}/${_id}`);
    return res.data.status;
    }
    catch(error){
      console.log(error)
    }
  }
  
  const getJobPoster = async () => {

    const jobPosterId = await axios.get(`${getJobPosterById}/${_id}`);
    // console.log(currentUser,jobPosterId.data)
    setJobPoster(jobPosterId.data);
    
  };
  useEffect(() => {
    const fetchStatusOfJob = async () => {
      try {
        if (currentUser._id) {
          getJobPoster();
          console.log(currentUser._id);
          const status = await getStatusOfJob();
          setIsApplied(status);
          console.log(status);
        }
      } catch (error) {
        console.error('Error fetching status of job application:', error);
      }
    };
  
    fetchStatusOfJob();
  }, [currentUser._id, isApplied]); // Dependency array includes currentUser._id and isApplied
  


  const showFileInputModal = () => {
    Swal.fire({
      title: 'Select PDF File',
      html: `
        <input type="file" id="file-input" accept="application/pdf">
      `,
      showCancelButton: true,
      confirmButtonText: 'Upload',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        if (!file) {
          Swal.showValidationMessage('You need to select a file');
        }
        return file;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const file = result.value;
        handleUpload(file);
      }
    }).catch((error) => {
      console.error(error);
    });
  };
  
const getSignatureForUpload = async (folder) => {
  try{
    const res = await axios.post(getSignature,{folder});
    return res.data;
  }catch(error){
    console.log(error);
  }
}

const uploadFile = async (type,timestamp,signature,file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("timestamp",timestamp);
  data.append("signature",signature);
  data.append("api_key",process.env.REACT_APP_CLOUDINARY_API_KEY);

  try{
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const resourceType = type;
    const api = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

    const res = await axios.post(api,data);
    const { secure_url } = res.data;
    return secure_url;
  }catch(error){
    console.log(error);
  }
}

async function handleUpload(file) {
    let fileUrl;
        try {
            const { timestamp:imgTimestamp, signature : imgSignature} = await getSignatureForUpload('images');
            const filesUrl = await uploadFile(file.type.split("/")[0],imgTimestamp,imgSignature,file);
            fileUrl=filesUrl;
            await axios.post(`${addApplicantDetails}/${_id}`,{
              userId : currentUser._id,
              fileUrl : fileUrl
            });
            await axios.post(`${addAppliedJob}/${currentUser._id}`,{
              appliedJobId : _id
            })
            const status = await getStatusOfJob();
             setIsApplied(status);
        } catch (error) {
          console.error('Error uploading multiple files:', error);
          throw error;
        }
        console.log(fileUrl)
}
  
  const handleClick = () => {
    showFileInputModal();
  }
  
  const dateObject = new Date(jobPostingDate);
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Months are zero-indexed, so we add 1
  const day = dateObject.getDate();

  // Format the date as DD-MM-YYYY
  const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

  return (
    <section >
      <div className='CardSection'>
        <img src={companyLogo} alt='' />
        <div>
          <h4 className='CardCompanyName'>{companyName}</h4>
          <h3 className='CardJobTitle'>{jobTitle}</h3>
          <div className='CardPropsDiv'>
            <span className='CardProp'><FiMapPin />{jobLocation}</span>
            <span className='CardProp'><FiClock />{employmentType}</span>
            <span className='CardProp'><FiDollarSign />{minPrice}-{maxPrice}k</span>
            <span className='CardProp'><FiCalendar />{formattedDate}</span>
          </div>
          <p className='CardDescription'>{description}</p>
          <div className='ButtonContainer'>
          {(jobPoster !== currentUser._id) &&
            (isApplied === false ?
              <button style={applyButtonStyle} onClick={handleClick}>Apply</button> :
              <button disabled style={appliedBox}>Applied</button>
            )
          }
        </div>
        
        </div>
      </div>
    </section>
  );
};

const applyButtonStyle = {
  backgroundColor: '#3f51b5',
  color: '#fff',
  border: '1px solid #3f51b5',
  borderRadius: '5px',
  padding: '10px 20px',
  cursor: 'pointer',
  display: 'block',
  margin: 'auto',
};
const appliedBox = {
  backgroundColor: 'green',
  color: 'white',
  border: '1px solid #3f51b5',
  borderRadius: '5px',
  padding: '10px 20px',
  display: 'block',
  margin: 'auto',
}

export default Card;
