import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { host, getJobPosterById, getSignature } from "../utils/APIRoutes";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'

const Card = ({ data, userId }) => {
  const { _id, companyName, companyLogo, minPrice, maxPrice, salaryType, jobLocation, employmentType, postingDate, description, jobTitle } = data;
  const [jobPoster, setJobPoster] = useState(undefined);
  const [image,setImage] = useState(null);
  const navigate = useNavigate();

  
  const getJobPoster = async () => {

    const jobPosterId = await axios.get(`${getJobPosterById}/${_id}`);
    console.log(userId,jobPosterId.data)
    setJobPoster(jobPosterId.data);
    
  };

  useEffect(() => {
    getJobPoster();
  }, []);


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
        } catch (error) {
          console.error('Error uploading multiple files:', error);
          throw error;
        }
        console.log(fileUrl)
}

  const handleClick = () => {
    showFileInputModal();
  }



  return (
    <section className='card' onClick={handleClick}>
      <div className='flex gap-4 flex-col sm:flex-row items-start'>
        <img src={companyLogo} alt='' />
        <div>
          <h4 className='text-primary mb-1'>{companyName}</h4>
          <h3 className='text-lg font-semibold mb-2'>{jobTitle}</h3>
          <div className='text-primary/70 text-base flex flex-wrap gap-2 mb-2'>
            <span className='flex items-center gap-2'><FiMapPin />{jobLocation}</span>
            <span className='flex items-center gap-2'><FiClock />{employmentType}</span>
            <span className='flex items-center gap-2'><FiDollarSign />{minPrice}-{maxPrice}k</span>
            <span className='flex items-center gap-2'><FiCalendar />{postingDate}</span>
          </div>
          <p className='text-base text-primary/70'>{description}</p>
          {jobPoster !== userId ? (
            <button style={applyButtonStyle} onClick={handleClick}>Apply</button>
          ) : null}
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

export default Card;
