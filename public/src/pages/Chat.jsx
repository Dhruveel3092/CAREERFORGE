import React, { createContext, useContext,useEffect, useState, useRef, Children } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { host,allUsersRoute ,getUserById} from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Topbar from "../components/Topbar";
import socket from "../components/socket";
const ChatContext = createContext();

export default function Chat() {
  
  
  const navigate = useNavigate();
  //const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect( () => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${host}/login/sucess`, { withCredentials: true });
       if(response.data.user) setCurrentUser(response.data.user);
        // console.log("current",currentUser)
        // console.log("response",response.data.user)
    } catch (error) {
      console.log(error)
      navigate("/login")
    }

    };

    
    fetchData();
  }, []);

  useEffect(() => {
    if (currentUser) {
     // socket.current = io(host);
      socket.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect( () => {
    const fetchData = async ()=>{
      if (currentUser) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
      }
    }
    fetchData();
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const reArrangeContact = async function (_id) {
    try {
      const { data } = await axios.get(`${getUserById}/${_id}`);
  
      setContacts((prevContacts) => {
        const filteredContacts = prevContacts.filter(
          (contact) => contact._id !== data._id
        );
        // Using unshift to add the new contact at the beginning
        return [data, ...filteredContacts];
      });
    } catch (error) {
      console.error("Error rearranging contacts:", error);
    }
  };
  
  
  return (
    <>
      <ChatContext.Provider
      value={{
        handleChatChange,
      }}
    >
    </ChatContext.Provider>
      <Topbar currentUser={currentUser} />
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange}  currentUser={currentUser}/>
          {currentChat === undefined ? (
            <Welcome currentUser={currentUser}/>
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} reArrangeContact={reArrangeContact}/>
          )}
        </div>
      </Container>   
    </>
  );

  
};
export const ChatState = () => {
  return useContext(ChatContext);
};



const Container = styled.div`
  height: 93vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
