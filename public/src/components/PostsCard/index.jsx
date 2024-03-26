import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsTrash } from "react-icons/bs";
import { deletePostAPI } from "../../utils/APIRoutes";
import axios from "axios";
import PostTime from "../PostTime";
import DeletePostModal from "../DeletePostModal";
import Login_Modal from "../Login_Modal";
import LikeButton from "../LikeButton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "./index.css";

export default function PostsCard({ posts ,currentUser ,allPosts ,setAllPosts}) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [reactedUsers , setReactedUsers] = useState(undefined);
  const [comments, setComments] = useState(undefined);
  const [showMore, setShowMore] = useState(false);
  const [dynamicHeights, setDynamicHeights] = useState([]);
  const [modalOpen,setModalOpen] = useState(false);
  const [loginModal,setLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleImageLoad = (event, index) => {
    const { target } = event;
    const newHeights = [...dynamicHeights];
    newHeights[index] = `${target.clientHeight}px`;
    setDynamicHeights(newHeights);
  };

  const deletePost = async () => {
    const {data} = await axios.delete(`${deletePostAPI}/${posts._id}/${posts.user._id}`);
    // setAllPosts(allPosts.filter(post => posts._id!=post._id));    //aanathi like nu
    // setting vikhay jaay chhe a ready thay jaay pachhi filter karaje
    console.log(data);
    return data.message;
  }

  useEffect(()=>{
    setReactedUsers(posts.reactions);
    setComments(posts.comments);
  }
  ,[]);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="posts-card">
      <div className="post-image-wrapper">
        <img
          onClick={() => {
            if (currentUser) {
              navigate(`/profile/${posts.user.username}`);
            } else {
              setLoginModal(true);
            }
          }}
          alt="profile-image"
          className="post-image"
          src={posts.user.avatarImage}
        />
        <div 
          onClick={() => {
            if (currentUser) {
              navigate(`/profile/${posts.user.username}`);
            } else {
              setLoginModal(true);
            }
          }}
        >
          <p className="name">
            {posts.user.username}
          </p>
          <p className="headline">
          { 
              posts?.user?.headline?.length > 50
              ? `${posts.user.headline.substring(0, 50)}...`
              : posts?.user?.headline
          }
          </p>
          <p className="timestamp"><PostTime timestamp={posts.createdAt} /></p>
        </div>

        {currentUser?.username == posts.user.username && <div className="trash-button">
          <BsTrash onClick={()=>setModalOpen(true)} className="trash-button" style={{ fontSize: '21px'}}/>
        </div>}

        {modalOpen&&
          <DeletePostModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            deletePost={deletePost}
          />
        }

        {loginModal && 
          <Login_Modal
            loginModal={loginModal}
            setLoginModal={setLoginModal}
          />
        }

      </div>

      <div className="status">
        <p dangerouslySetInnerHTML={{ __html: showMore ? posts.description : `${posts.description.slice(0, 210)}` }} />
        {posts.description.length > 210 && !showMore && (
          <p className="see-more-btn"><span className="see-more-btn-text" onClick={()=>setShowMore(true)}>...see more</span></p>
        )}
      </div>
      
      {posts?.files && posts.files.length > 0 ? (
        posts.files.length === 1 ? (
          <div className="container">
            {posts.files.map((file, index) => (
              <div key={index}>
                {file.split('/')[4] === "image" ? (
                  <img
                    className="slider-image"
                    src={file}
                    alt={`post-image-${index}`}
                    onLoad={(e) => handleImageLoad(e, index)}
                    style={{ height: dynamicHeights[index] , maxHeight:'550px'}}
                  />
                ) : (
                  <video
                    controls
                    style={{ width: '100%', height: 'auto' , maxHeight:'550px'}}
                  >
                    <source src={file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Slider {...settings}>
            {posts.files.map((file, index) => (
              <div key={index}>
                {file.split('/')[4] === "image" ? (
                  <img
                    className="slider-image"
                    src={file}
                    alt={`post-image-${index}`}
                    onLoad={(e) => handleImageLoad(e, index)}
                    style={{ height: dynamicHeights[index] , maxHeight:'550px'}}
                  />
                ) : (
                  <video
                    controls
                    style={{ width: '100%', height: 'auto' , maxHeight:'550px'}}
                  >
                    <source src={file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </Slider>
        )
      ) : (
        <></>
      )}
      <LikeButton
        currentUser={currentUser}
        userId={currentUser?._id}
        postId={posts._id}
        reactedUsers={reactedUsers}
        setReactedUsers={setReactedUsers} 
        comments={comments} 
        setComments={setComments}
        setLoginModal={setLoginModal}
        />
    </div>
  
  )
}