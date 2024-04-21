import React, { useEffect, useState } from "react";
import "./index.css";
import { AiOutlineLike ,AiOutlineComment } from "react-icons/ai";
import like from "../../assets/like.png";
import celebration from "../../assets/celebration.png";
import mind_blown from "../../assets/mind_blown.png";
import link_copy from "../../assets/link_copy.png";
import tick from "../../assets/tick.png";
import { addReaction , removeReaction , addComments } from "../../utils/APIRoutes";
import axios from "axios";
import LikeModal from "../LikeModal";
import { FcLike } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import CommentCard from "../CommentCard";

export default function LikeButton({ currentUser, userId, postId , reactedUsers , setReactedUsers , comments , setComments , setLoginModal }) {
  const [reactionCount, setReactionCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [reacted, setReacted] = useState(undefined);
  const [modalOpen,setModalOpen] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [inputComment, setInputComment] = useState("");
  const [commentsToShow, setCommentsToShow] = useState(3);
  const [copyLinkNotification, setCopyLinkNotification] = useState(false);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleReaction = async(reactionType ,e ) => {
      e.stopPropagation();
      const { data } =await axios.post(addReaction , { postId , userId , reactionType });
      let newReactedUsers = reactedUsers.filter(user => user.user._id!=userId);
      newReactedUsers = [{
                                user:{ 
                                 _id:currentUser?._id,
                                 username:currentUser?.username,
                                 avatarImage:currentUser?.avatarImage,
                                 headline:currentUser?.headline,
                                },
                                type:reactionType,
                            },...newReactedUsers];
      setReactedUsers(newReactedUsers);
  };

  useEffect(()=>{
    if(reactedUsers)
    {
        const user = reactedUsers.find( user => user.user._id==userId);
        setReacted(user?.type);
        setReactionCount(reactedUsers?.length);
        setCommentCount(comments?.length);
    }
  },[reactedUsers,comments])

  const eraseReaction = async(e) => {
      e.stopPropagation();
      const { data } =await axios.post(removeReaction , { postId , userId });
      const newReactedUsers = reactedUsers.filter(user => user.user._id!=userId);
      setReactedUsers(newReactedUsers);
  }

  const handleClick =() =>{
    if(!currentUser)
      setLoginModal(true);
    else if(reactionCount>0)
      setModalOpen(true);
  }

  const getComment = (event) => {
    setInputComment(event.target.value);
  };

  const addComment = async () => {
    if(inputComment.trim())
    {
      const { data } =  await axios.post(addComments,{ postId,userId,inputComment,timeStamp : Date.now() });
      console.log(data);
      // let  newComments = [{
      //                             user:{ 
      //                             _id:currentUser?._id,
      //                             username:currentUser?.username,
      //                             avatarImage:currentUser?.avatarImage,
      //                             headline:currentUser?.headline,
      //                             },
      //                             comment : inputComment,
      //                             timeStamp : Date.now(),
      //                         },...comments];
      setComments(data);
      setCommentsToShow(commentsToShow+1);
      setInputComment("");
    }
    else
    {
      toast.error("Write Something in Comment Box",toastOptions);
    }
  };

  const handleLoadMoreComments = () => {
    setCommentsToShow((prevCount) => prevCount + 10);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:3000/posts/${postId}`);
    setCopyLinkNotification(true);
    setTimeout(() => {
      setCopyLinkNotification(false);
    }, 2000);
  }

  return (
    <>
    <div className="like-container">
        <LikeModal modalOpen={modalOpen} setModalOpen={setModalOpen} reactedUsers={reactedUsers} />
      <div className="reactions-comments-container">
        <p 
          className={`reactions ${reactionCount === 0 ? 'inactive' : ''}`} 
          onClick={handleClick}
        >
            {reactionCount} People reacted this Post
        </p>
        {commentCount>0 && 
          <span 
            className={`comments ${commentCount === 0 ? 'inactive' : ''}`} 
            onClick={()=>{
              if(!currentUser)
                setLoginModal(true)
              else if(!showCommentBox)
                setShowCommentBox(true)
              else
                handleLoadMoreComments();
              }
            }
          >
            {commentCount} Comments
          </span>}
      </div>
      <div className="hr-line">
        <hr />
      </div>
       <div className="like-comment">
        <div className="likes-comment-inner" onClick={currentUser ? (reacted ? eraseReaction : (e) => handleReaction("Like", e)) : () => setLoginModal(true)} >
          {reacted ? (
            <>
            {reacted === "Like" && <img src={like} className="icon" />}
            {reacted === "Heart" && <FcLike className="icon" size={30} />}
            {reacted === "Celebration" && <img src={celebration} className="icon" />}
            {reacted === "Mind_Blowing" && <img src={mind_blown} className="icon" />}
            </>
          ) : (
            <AiOutlineLike  size={30} />
          )}

          <p className={`white ${reacted ? reacted : ''}`} >{ reacted ? `${reacted}` : "Like"}</p>

          {currentUser && <div className="hover-icons">
            <img src={like} className="icon" onClick = {(e)=>handleReaction("Like",e)} size={30} />
            <FcLike className="icon" onClick = {(e)=>handleReaction("Heart",e)} size={30} />
            <img src={celebration} className="icon" onClick = {(e)=>handleReaction("Celebration",e)} size={30} />
            <img src={mind_blown} className="icon" onClick = {(e)=>handleReaction("Mind_Blowing",e)} />
          </div>}

        </div>
        <div
          className="likes-comment-inner"
          onClick={currentUser ? () => {
            if(showCommentBox)
              setCommentsToShow(3);
            setShowCommentBox(!showCommentBox)
          }
          :
            ()=>setLoginModal(true)
          }
        >
          {
            <AiOutlineComment
              size={30}
              color={showCommentBox ? "#0a66c2" : "white"}
            />
          }

          <p className={showCommentBox ? "blue" : "white"}>Comments</p>
        </div>
        {
          copyLinkNotification ?
          <div
            className="likes-comment-inner"
          >
            <img className="icon" src={tick}/><p className="share">  Link copied to clipboard.</p>
          </div>
          :
          <div
            className="likes-comment-inner"
            onClick={copyToClipboard}
          >
            <img className="icon" src={link_copy}/><p className="share">  Copy link to post</p>
          </div>
        }
      </div>
      {showCommentBox ? (
        <>
          <input
            onChange={getComment}
            placeholder="Add a Comment"
            className="comment-input"
            name="comment"
            value={inputComment}
          />
          <button className="add-comment-btn" onClick={addComment}>
            Add Comment
          </button>

          {commentCount > 0 ? (
            comments.slice(0, commentsToShow).map((comment) => {
              return (
                <>
                  <CommentCard 
                    comment={comment} 
                    currentUser={currentUser}
                    postId={postId}
                    setComments={setComments}
                    setCommentCount={setCommentCount}
                  />
                </>
              );
            })
          ) : (
            <></>
          )}
          {comments.length > commentsToShow && (
            <button className="load-more-btn" onClick={handleLoadMoreComments}>
              Load More Comments
            </button>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
    <ToastContainer/>
    </>
  );
}
