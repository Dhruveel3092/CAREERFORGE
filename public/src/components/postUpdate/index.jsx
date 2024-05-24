import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import axios from "axios";
import ModalComponent from "../Post_Modal";
import media from "../../assets/media.png";
import job from "../../assets/job.png";
import article from "../../assets/article.png";
import { sendPostRoute,getSignature } from "../../utils/APIRoutes";
import PostsCard from "../PostsCard";
import ArticleModal from "../Artical_Modal";

export default function PostStatus( {currentUser , allPosts , setAllPosts} ) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [articleModal, setArticleModal] = useState(false);
  const [status, setStatus] = useState("");
  const [currentUserImage,setCurrentUserImage] = useState(undefined);
  const [files,setFiles] = useState([]);
  const jobn=()=>{
    navigate('/job-portal');
  }
  useEffect(() => {
    const fetchData = async () => {
      if(currentUser)
      {
        setCurrentUserImage(currentUser.avatarImage);
      }
    }

    fetchData();

  },[currentUser]); //aama jyare currentUser hatavi daiye to ek pan posts na batave
                    // because jyare currentuser undefined hashe tyare badhama pass
                    // thay component render thay jashe ane tyare setallpost pan 
                    //chali jashe ane ek pan post backend mathi nai aave because
                    // currentuser._id undefined chhe ane jyare currentuser ne 
                    // ani value mali jaay tyare component badha farithi render
                    // thay pan useEffect ke useState na thay because a mount vakhate
                    // j chale and pachhi kaayam post undefined j raheshe and 
                    // component renrender time a post undefined na karane ek pan
                    // post nai dekhay same vastu bija badha component ma pan dhyan rakhavi
                    // pade............................


  const uploadFile = async (type,timestamp,signature,file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("timestamp",timestamp);
      data.append("signature",signature);
      data.append("api_key",process.env.REACT_APP_CLOUDINARY_API_KEY);
  
      try{
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        const resourceType = type;
        const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  
        const res = await axios.post(api,data);
        const { secure_url } = res.data;
        return secure_url;
      }catch(error){
        console.log(error);
      }
    }
  
    const getSignatureForUpload = async (folder) => {
      try{
        const res = await axios.post(getSignature,{folder});
        return res.data;
      }catch(error){
        console.log(error);
      }
    }

  const sendStatus = async (event) => {
    await setModalOpen(false);
    var filesUrl = [];
    if(files.length>0){
        try {
          const uploads = files.map(async (file) => {
            const { timestamp:imgTimestamp, signature : imgSignature} = await getSignatureForUpload('images');
            const fileUrl = await uploadFile(file.type.split("/")[0],imgTimestamp,imgSignature,file);
            return fileUrl;
          });
      
          filesUrl = await Promise.all(uploads);
        } catch (error) {
          console.error('Error uploading multiple files:', error);
          throw error;
        }
      }
    const response= await axios.post(`${sendPostRoute}/${currentUser._id}`,{
      status,
      filesUrl,
    });
  //   setAllPosts((prevPosts) => [
  //     response.data.post ,
  //    ...prevPosts,
  //  ]);
    await setStatus(""); 
    await setFiles([]);
  };

  const sendStatusForArticle = async (event) => {
    await setArticleModal(false);
    var filesUrl = [];
    const response= await axios.post(`${sendPostRoute}/${currentUser._id}`,{
      status,
      filesUrl,
    });
  //   setAllPosts((prevPosts) => [
  //     response.data.post ,
  //    ...prevPosts,
  //  ]);
    await setStatus("");
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="post-status-main">
      <div className="post-status">
        <img
          src={currentUserImage}
          alt="User"
          className="user-image"
          onClick={()=>navigate(`/profile/${currentUser.username}`)}
        />
        <button className="open-post-modal" onClick={openModal}>
          Start a Post
        </button>
        {modalOpen && 
          <ModalComponent
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          status={status}
          setStatus={setStatus}
          sendStatus={sendStatus}
          files={files}
          setFiles={setFiles}
        />
        }

        {articleModal && 
          <ArticleModal
          articleModal={articleModal}
          setArticleModal={setArticleModal}
          status={status}
          setStatus={setStatus}
          sendStatusForArticle={sendStatusForArticle}
        />
        }

        <div className="additional-buttons" style={{display:'flex'}}>
          <button className="additional-button" style={{justifyContent:'center',display:'flex'}} onClick={openModal}>
            <img src={media} alt="" className="icon"/>Media
          </button>
          <button className="additional-button" onClick={jobn}>    
            <img src={job} alt="" className="icon"/>Job
          </button>
          <button className="additional-button" onClick={() => setArticleModal(true)}>
            <img src={article} alt="" className="icon"/>Write article
          </button>

        </div>
      </div>

      <div>
      {allPosts !== undefined &&
        allPosts.map(posts => (
          <div key={posts.id}>
            <PostsCard posts={posts} currentUser={currentUser} allPosts={allPosts} setAllPosts={setAllPosts} />
          </div>
        ))}
    </div>

    </div>
  );
}
