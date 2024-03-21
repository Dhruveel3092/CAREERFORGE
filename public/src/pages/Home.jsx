import React, { useState, useEffect ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar/index";
import PostStatus from "../components/postUpdate";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import { io } from "socket.io-client";
import { host } from "../utils/APIRoutes"; 
import { getAllPost } from "../utils/APIRoutes";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useWindowScroll } from "@uidotdev/usehooks";

export default function Home() {
  const socket = useRef();
  const [{ x, y }, scrollTo] = useWindowScroll();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allPosts,setAllPosts] = useState([]);
  const [pages,setPages] = useState(1);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    };

    fetchData();
  }, []);

  const getCardData = async () => {
    if(currentUser)
    {
      const {data} = await axios.get(`${getAllPost}/${currentUser._id}/${pages}`);
      setAllPosts((allPosts) => [...allPosts,...data]);
      setPages((prev) => prev+1);
      setLoading(false);
    }
  }

  useEffect(() => {
    getCardData();
  },[currentUser])

  // const handleInfiniteScroll = async () => {
  //   console.log(window.innerHeight,document.documentElement.scrollTop,document.documentElement.scrollHeight)
  //   try{
  //     if(window.innerHeight + document.documentElement.scrollTop + 1 >= 
  //         document.documentElement.scrollHeight  
  //     ){
  //       setLoading(true);
  //       await getCardData();
  //     }
  //   }catch(error){
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   // console.log(window.innerHeight , document.documentElement.scrollTop ,
  //   //   document.documentElement.scrollHeight )
  //   console.log(x,y);
  //   // window.addEventListener("scroll",handleInfiniteScroll);
  //   // return () => window.removeEventListener("scroll",handleInfiniteScroll);
  // },[x,y])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
     // socket.emit("setup", currentUser._id);
    }
  }, [currentUser]);


  return (
    <>
      <StyledHome>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
          <PostStatus currentUser={currentUser} allPosts={allPosts} setAllPosts={setAllPosts}/>
        </StyledPosts>
      </StyledHome>
      {loading && (
        <button className="load-post-btn"><IoIosAddCircleOutline size={45}/></button>
      )}
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
  border: 1px solid #ddd;
  border-radius: 8px;
`;
