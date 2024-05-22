import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import styled from "styled-components";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getpending,addConnection,host} from '../utils/APIRoutes';
import { useNavigate } from "react-router-dom";
import Topbar from './Topbar';
import ConnectedUser from "./ConnectedUser/Index";

const Pending = () => {
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState(false); // New state for tracking accepted requests
  const [currentUser,setCurrentUser]=useState(undefined);
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

  const  getCurrentUser= async(e) => {
    console.log(e);
    const newUser=currentUser.email;
    const data= await axios.post(`${addConnection}/${e.senderEmail}`, { newUser } );
    // Display a success toast
    // Update the state to trigger a re-render
    setAccepted(true);
    navigate(`/profile/${e.username}`);
   
  }

  useEffect(() => {
    const fetchpending = async () => {
      if(currentUser!=undefined){
      const data = {
        newUser: currentUser.email,
      };
      try {
        const res = await axios.post(getpending, data);
        // Convert the object values into an array
        console.log( res);
        const pendingArray = Object.values(res.data);
        setPending(pendingArray);
      } catch (error) {
        console.error(error);
      }
    }
    };
  
    fetchpending();
  }, [currentUser,accepted]); // Add accepted to the dependency array

  // const acceptrequest = async ( senderEmail) => {
  //   const newUser=currentUser.email;
  //   const data= await axios.post(`${addConnection}/${senderEmail}`, { newUser } );
  //   // Display a success toast
  //   toast.success('You both are now connected to each other', {
  //     position: toast.POSITION.TOP_RIGHT,
  //   });

  //   // Update the state to trigger a re-render
  //   setAccepted(true);
    
  // };

  return (

    <>
    <Topbar currentUser={currentUser} />
    <Connect>
    <div className="connections-main">
      
        {(pending.length === 0) ? (<h1 style={{color:"white"}} className='pen'>No pending requests :)</h1>) : pending.map((user)=>{    
            return <ConnectedUser user={user} msg="Accept" getCurrentUser={getCurrentUser}>

            </ConnectedUser>
        })}
    </div>
    </Connect>
    </>
    // <div>
    //    <Topbar currentUser={currentUser} />
    //   <section className="text-gray-600 body-font">
    //     <div className="container px-5 py-24 mx-auto">
    //       <div className="flex flex-wrap -m-2">
    //         {pending.map((element) => {
    //           return (
    //             <div className="p-2 lg:w-1/3 md:w-1/2 w-full" key={element.senderEmail}>
    //               <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg bg-cyan-8009">
    //                 <img
    //                   alt="team"
    //                   className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
    //                   src="https://dummyimage.com/80x80"
    //                 />
    //                 <div className="flex-grow">
    //                   <h2 className="text-gray-900 title-font font-medium">
    //                     {element.senderEmail}
    //                   </h2>
    //                   <Button
    //                     variant="contained"
    //                     onClick={() => acceptrequest(currentUser.email, element.senderEmail)}
    //                   >
    //                     Accept
    //                   </Button>
    //                 </div>
    //               </div>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //   </section>
    //   <ToastContainer />
    // </div>
  );
};

export default Pending;

const Connect = styled.div`
.connections-main {
  display: grid;
  grid-template-columns: auto auto;
  gap: 60px;
  justify-content: center;
  align-items: center;
  padding-top:40px;
  padding-bottom:70px;
  text-align: center;

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
        margin-top:10px;
        font-size: 16px;
        font-weight: 600;
      }
  
      .headline {
        padding-top:60px;
        margin-top: 100px;
        font-family: system-ui;
        font-size: 15px;
        font-weight: 400;
      }
  
      button {
        width: 90%;
        height: 40px;
        position: absolute;
  
        bottom: 10px;
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
