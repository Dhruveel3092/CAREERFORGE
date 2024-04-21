import React, { useState, useEffect ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar/index";
import PostStatus from "../components/postUpdate";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { host } from "../utils/APIRoutes"; 
import { getMorePost } from "../utils/APIRoutes";
import { IoIosAddCircleOutline } from "react-icons/io";
// import { useWindowScroll } from "@uidotdev/usehooks";
import socket from "../components/socket";
import notificationSound from './ting_iphone.mp3';
import Loading from "../assets/loading.gif";

export default function Home() {
  //const socket = useRef();
  // const [{ x, y }, scrollTo] = useWindowScroll();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allPosts,setAllPosts] = useState([]);
  const [pages,setPages] = useState(1);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("current",currentUser)
       // console.log(response,"response")
        const response = await axios.get(`${host}/login/sucess`, {withCredentials: true});
        console.log(response,"response")
       if(response.data.user) setCurrentUser(response.data.user);
        console.log("current",currentUser)
        console.log("response",response.data.user)
    } catch (error) {
      console.log(error)
      navigate("/login")
    }

    };

    
    fetchData();
  }, []);

  const getCardData = async () => {
    if(currentUser)
    {
      const {data} = await axios.get(`${getMorePost}/${currentUser._id}/${pages}`);
      setAllPosts((allPosts) => [...allPosts,...data]);
      setPages((prev) => prev+1);
      setLoading(false);
    }
  }

  useEffect(() => {
    getCardData();
  },[currentUser])

  const handleInfiniteScroll = async (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    try{
      if(loading==false && scrollTop + clientHeight + 500 >= scrollHeight)
      {
        setLoading(true);
        await getCardData();
      }
    }catch(error){
      console.log(error);
    }

  }
 
 
  // useEffect(() => {
  //   if (currentUser) {
      
  //     socket.emit("add-user", currentUser._id);
  //    // socket.emit("setup", currentUser._id);
  //   }
  // }, [currentUser]);
 
  // useEffect(() => {

  //   //Listen for new notifications
    
  //   socket.on("newNotification", (data) => {
  //     toast.success('New Notification Check it', {
  //       position: toast.POSITION.TOP_CENTER
  //     });
  //     document.getElementById('notification').play();
  //   });

    
  // }, [currentUser]);

  return (
    <>
      <StyledHome onScroll={handleInfiniteScroll}>
        <Top>
          <Topbar currentUser={currentUser}/>
        </Top>
        <StyledPosts>
          <PostStatus currentUser={currentUser} allPosts={allPosts} setAllPosts={setAllPosts}/>
        </StyledPosts>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px" // Adjust as needed for spacing
        }}>
          <img 
            src={Loading} 
            alt="loading" 
            className="loading"
            style={{
              width: "40px", // Adjust size as needed
              height: "40px", // Adjust size as needed
            }}
          />
        </div>
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
