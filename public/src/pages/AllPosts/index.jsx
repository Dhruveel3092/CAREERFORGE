import React, { useState , useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { getAllPostsByUserId ,host } from "../../utils/APIRoutes";
import axios from "axios";
import PostsCard from "../../components/PostsCard";
import Topbar from "../../components/Topbar";
import styled from "styled-components";
import "./index.css";


export default function AllPosts() {
  const [currentUser,setCurrentUser] = useState(undefined);
  const [allPosts,setAllPosts] = useState(undefined);
  const { userId , username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("current",currentUser)
       // console.log(response,"response")
        const response = await axios.get(`${host}/login/sucess`, {withCredentials: true});
        console.log(response,"response");
        if(response.data.sta==1){
          if(response.data.user) setCurrentUser(response.data.user);
        }else{
          navigate("/login")
        }
  
    } catch (error) {
      console.log(error)
      navigate("/login")
    }

    };

    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const {data} = await axios.get(`${getAllPostsByUserId}/${userId}`);
      setAllPosts(data);
      console.log(data);
    };  
    fetchData();
  }, [userId]);

  return (
    <>
    <StyledHome>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
        <div className="all-posts">
          <div className="username-posts">Posts</div>
          {allPosts!==undefined && allPosts.map((posts) => {
            return (
                <div key={posts.id}>
                    <PostsCard posts={posts} currentUser={currentUser} allPosts={allPosts} setAllPosts={setAllPosts}/>
                </div>
            );
          })}
        </div>
       </StyledPosts>
    </StyledHome>
    </>
  );
}

const StyledHome = styled.div`
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

const Top = styled.div`
  position: sticky;
  top: 0px;
  z-index:100;
`

const StyledPosts = styled.div`
  flex: 1;
  padding: 10px;

  /* Webkit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3498db;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: #ecf0f1;
    border-radius: 8px;
  }

  /* Additional styling for the content */
  // background-color: #fff;
  border: 1px solid #242527;
  border-radius: 8px;
`;