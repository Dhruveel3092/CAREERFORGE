import React,{ useState , useEffect } from "react";
import { useNavigate , useParams } from "react-router-dom";
import axios from "axios";
import Topbar from "../components/Topbar/index";
import PostsCard from "../components/PostsCard";
import { getPostById } from "../utils/APIRoutes";
import styled,{ createGlobalStyle } from "styled-components";
import GuestTopbar from "../components/Guest Topbar";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
  }
`;

export default function Post() {
  
  const { postId } = useParams();
  const [currentUser,setCurrentUser] = useState(undefined);
  const [posts,setPosts] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        setCurrentUser(
            await JSON.parse(
              localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            )
          );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const {data} = await axios.get(`${getPostById}/${postId}`);
      setPosts(data[0]);
    };

    fetchData();
  }, [postId]);

  return (
    <div>
      <GlobalStyle/>
      <StyledHome>
        {currentUser ?
        <Top>
            <Topbar currentUser={currentUser}/>
        </Top>:
            <Top>
                <GuestTopbar />
            </Top>
        }
        {posts && <UserName>
            {posts.user.username}'s Post
            </UserName>
        }
        <StyledPosts>
        {
            posts && 
            <PostsCard posts={posts} currentUser={currentUser} />
        }
        </StyledPosts>
      </StyledHome>
    </div>
  );
}

const UserName = styled.div`
    font-size: 24px; /* Increase font size */
    text-align: center; /* Center text horizontally */
    padding: 20px 0; /* Add margin for spacing */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: none;
    text-decoration: none; /* Remove underline */
`

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
  justify-content: center;
  align-items: center;
  position: relative;
  display: flex;
  flex-direction: colomn;

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
  border: 1px solid #ddd;
  border-radius: 8px;
`;