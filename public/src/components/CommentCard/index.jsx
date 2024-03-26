import React,{ useState } from "react";
import CommentDeleteModal from "../CommentDeleteModal";
import PostTime from "../PostTime";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { deleteCommentAPI } from "../../utils/APIRoutes";

export default function CommentCard({comment , currentUser , postId , setComments , setCommentCount }) {
    const [commentDeleteModal,setCommentDeleteModal] = useState(false);
    const navigate = useNavigate();

    const deleteComment = async () => {
        const {data} = await axios.delete(`${deleteCommentAPI}/${postId}/${comment._id}`);
        setComments(data);
        setCommentCount(data.length);
        // console.log(data);
        return data?.message;
      };

  return (
    <>
                <div className="commenter-container">
                  <img src={comment.user.avatarImage} alt="profile" className="commenter-image" onClick={() => navigate(`/profile/${comment.user.username}`)}/>
                  <div className="all-comments">
                    <p className="name" onClick={()=>navigate(`/profile/${comment.user.username}`)}>{comment.user.username}</p>
                    <p className="headline" >
                      <span onClick={() => navigate(`/profile/${comment.user.username}`)}>
                        { 
                          comment?.user?.headline?.length > 50
                          ? `${comment.user.headline.substring(0, 50)}...`
                          : comment?.user?.headline
                        }
                      </span>
                    </p>
                    <p className="comment">{comment.comment}</p>
                    <p className="timestamp">
                      <PostTime timestamp={comment.timeStamp} />
                      {currentUser?.username==comment.user.username && <BsTrash 
                        onClick={()=>setCommentDeleteModal(true)} 
                        className="trash-button" 
                        style={{ fontSize: '21px' }}
                      />}
                    </p>
                    {commentDeleteModal&&
                      <CommentDeleteModal
                        commentDeleteModal={commentDeleteModal}
                        setCommentDeleteModal={setCommentDeleteModal}
                        deleteComment={deleteComment}
                      />
                    }
                  </div>
                </div>
    </>
  );
}
