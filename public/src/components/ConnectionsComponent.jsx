import React,{useState, useEffect} from "react";
import axios from 'axios';
import { getAllUsers } from '../utils/APIRoutes';
import ConnectedUser from "./ConnectedUser/Index";
import styled from "styled-components";
import {getConnectedUsers,host} from "../utils/APIRoutes"
import { useNavigate } from "react-router-dom";
import { Space, Spin } from "antd";
import Topbar from "../components/Topbar/index";

function ConnectionsComponent() {
 
    const [users,setUsers]=useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentUser,setCurrentUser]=useState(undefined);

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


    const  getCurrentUser= async(e) => {
      navigate(`/profile/${e.username}`);
    }
    
    useEffect(()=>{
      const fetch=async() => {
      if(currentUser!=undefined)
      {
          const response = await axios.get(`${getConnectedUsers}/${currentUser._id}`);
          setUsers(response.data);      
        }
      }
      fetch();
    }, [currentUser]);

  return (
    loading ? (
      <Loader>
      <div className="loader">
      <p>Loading..Please Wait..</p>
      <Space size="middle">
        <Spin size="large" />
      </Space>
      
    </div>
    </Loader>
    ) 
    : (<>
    <Topbar currentUser={currentUser} />
    <Connect>
    <div className="connections-main">
        {(users.length==0) ? (<h1 style={{color:"white"}}>Not Connected to any user :(</h1>) :users.map((user)=>{    
            return <ConnectedUser user={user} getCurrentUser={getCurrentUser}>

            </ConnectedUser>
        })}
    </div>
    </Connect>
    </>
    )
  )
}

export default ConnectionsComponent

const Loader = styled.div`
.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
    gap: 10px;
  
    p {
      font-family: system-ui;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      font-size: 20px;
    }
  }
`;


const Connect = styled.div`
.connections-main {
    display: grid;
    grid-template-columns: auto auto;
    gap: 60px;
    justify-content: center;
    align-items: center;
    background-color: #242527;
  border-radius: 10px;
  height: 100vh; /* Set maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
    .grid-child {
      border: 1px solid #4f5051aa;
      width: 250px;
      height: 330px;
      margin: 10px;
      padding: 10px;
      display: flex;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      color:white;
      background-color: #31363F;
      align-items: center;
      flex-direction: column;
      border-radius: 10px;
      position: relative;
      cursor: pointer;
  
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin-top: 20px;
      }
  
      .name {
        font-family: system-ui;
        font-size: 16px;
        padding-bottom:10px;
        font-weight: 600;
      }

      button {
        width: 90%;
        height: 40px;
        position: absolute;
  
        bottom: 30px;
        cursor: pointer;
        background-color: white;
        color: #004284;
        border: 1px solid #004284;
        font-size: 16px;
        font-family: system-ui;
        border-radius: 30px;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }
  
      button:hover {
        border: 2px solid #004284;
        background-color: #bbdefb;
      }
    }
  }
  `