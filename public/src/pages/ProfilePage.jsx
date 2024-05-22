import React,{ useEffect , useState } from "react";
import { useNavigate , useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import ProfileComponent from "../components/ProfileComponent";
import axios from "axios";
import { getUserByName } from "../utils/APIRoutes";
import styled, { createGlobalStyle } from "styled-components";
import {host} from "../utils/APIRoutes"
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
  }
`;

export default function ProfilePage() {
  
  const { username } = useParams();


  const [guestUser,setGuestUser] = useState(undefined);

  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate=useNavigate();
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
      const {data} = await axios.get(`${getUserByName}/${username}`);
      setGuestUser(data);
    };

    fetchData();
  }, [username]);

  return (
    <div>
      <GlobalStyle/>
        <StyledHome>
          <Top>
            <Topbar currentUser={ currentUser }/>
          </Top>
          <StyledPosts>
            <ProfileComponent currentUser={currentUser} guestUser={guestUser} setCurrentUser={setCurrentUser}/>
          </StyledPosts>
        </StyledHome>
    </div>
  );
}

const StyledHome = styled.div`
  display: flex;
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
