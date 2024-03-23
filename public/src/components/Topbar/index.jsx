import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import app_logo from "../../assets/app_logo.png";
import axios from 'axios';
import Logout from "../Logout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchModal from "../Search_Modal";
import { SearchUsers } from '../../utils/APIRoutes';
import { Link, useLocation } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import socket from "../socket";
import notificationSound from '../ting_iphone.mp3';
import {getnotifi} from "../../utils/APIRoutes"

import {
  AiOutlineHome,
  AiOutlineUserSwitch,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineBell,
} from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import "./index.css";


toast.configure();

export default function Topbar( { currentUser } ) {
  const [currentUserImage,setCurrentUserImage] = useState(undefined);
  const [modalOpen,setModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredData, setFilteredData] = useState(undefined);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [sh,setsh]=useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  }; 

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  function handleNavAndClose() {
    handleMenuClose();
  }


  useEffect(() => {
    const fetchData = async () => {
      if(currentUser && query!='')
      {
        const response = await axios.get(`${SearchUsers}/${currentUser._id}`, { params: { query: query } });
        setFilteredData(response.data);
      }
      else if(query=='')
        setFilteredData(undefined);
    };
    fetchData();
  }, [query,currentUser]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
  };

  const handleButtonClick = (name) => {
    setModalOpen(false);
    navigate(`/profile/${name}`);
    setQuery('');
  };
  useEffect(() => {
    if (currentUser) {
      
      socket.emit("add-user", currentUser._id);
     // socket.emit("setup", currentUser._id);
    }
  }, [currentUser]);
 
  useEffect(() => {

    //Listen for new notifications
    
    socket.on("newNotification", (notifi) => {
      
      const audio=new Audio(notificationSound);
     audio.play().catch(console.warn);
    
     toast.success('New Notification Check it', {
      position: toast.POSITION.TOP_RIGHT
    })
      setNotifications((prevNotifications) => [notifi, ...prevNotifications]);
    });

    
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      
      if(currentUser!=undefined){
        
      try {
        const response = await axios.post(getnotifi, {
          userid: currentUser._id, // Replace with the actual user ID or get it dynamically
        });
        console.log(response.data.notifications);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } 
    };
  }
  
    fetchNotifications();
  }, [currentUser]); // The empty dependency array ensures that this effect runs once when the component mounts
  function fun(){
    setsh(old=>{
      return(!old)
    })
  }

  useEffect(() => {
    if(currentUser){
      setCurrentUserImage(currentUser.avatarImage);
    }
  }, [currentUser]);

  return (<>
    <div className="topbar-main">
      <div className="react-icons">
      <img src={app_logo} alt="app_logo" className="app-logo" onClick={()=>navigate("/home")}/>
        <div className="icon-container">
          <AiOutlineSearch onClick={()=>setModalOpen(true)} size={30} className="react-icon" />
            <SearchModal 
              modalOpen={modalOpen} 
              setModalOpen={setModalOpen} 
              query={query} 
              setQuery={setQuery}
              filteredData={filteredData }
              handleInputChange={handleInputChange}
              handleButtonClick={handleButtonClick}
            />
          <span className="icon-name">Search</span>
        </div>
        <div className="icon-container">
            <AiOutlineHome size={30} className="react-icon" onClick={()=>navigate("/home")}/>
          <span className="icon-name">Home</span>
        </div>
        <div className="icon-container">
          <AiOutlineUserSwitch size={30} className="react-icon" onClick={handleMenuOpen} />
          <span className="icon-name">Connections</span>
        </div>
        
        <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={handleNavAndClose}
                  component={Link}
                  to="/connections/connection"
                >
                  Connections
                </MenuItem>
                <MenuItem
                  onClick={handleNavAndClose}
                  component={Link}
                  to="/connections/addfriend"
                >
                  Add friend
                </MenuItem>
                <MenuItem
                  onClick={handleNavAndClose}
                  component={Link}
                  to="/pending"
                >
                  New Request
                </MenuItem>
              </Menu>
        <div className="icon-container">
          <BsBriefcase size={30} className="react-icon" />
          <span className="icon-name">Jobs</span>
        </div>
        <div className="icon-container">

            <AiOutlineMessage size={30} className="react-icon" onClick={()=>navigate("/chat")}/>
          <span className="icon-name">Message</span>
        </div>
        <div className="icon-container">

          <AiOutlineBell size={30} className="react-icon"  onClick={fun}/>
          <span className="icon-name">Notification</span>
        </div>
       
        <div className="icon-container">
          <img className="user-logo" src={currentUserImage} alt="user" onClick={()=>navigate(`/profile/${currentUser.username}`)}/>
          <span className="icon-name">Profile</span>
        </div>
        <Logout />
      </div>
    </div>
             
  {(sh==true) && 
    <>
      {/* component */}
     
    
      <div
        className="w-full h-full bg-gray-800 bg-opacity-90 top-0 overflow-y-auto overflow-x-hidden fixed sticky-0"
        id="chec-div"
        style={{position: "fixed",zIndex:999999999}}
      >
        {/*- more free and premium Tailwind CSS components at https://tailwinduikit.com/ -*/}
        <div
          className="w-full absolute z-10 right-0 h-full overflow-x-hidden transform translate-x-0 transition ease-in-out duration-700"
          id="notification"
        >
          <div className="2xl:w-4/12 bg-gray-50 h-screen overflow-y-auto p-8 absolute right-0">
            <div className="flex items-center justify-between">
              <p
                tabIndex={0}
                className="focus:outline-none text-2xl font-semibold leading-6 text-gray-800"
              >
                Notifications
              </p>
              <button
                role="button"
                aria-label="close modal"
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md cursor-pointer"
                onClick={fun}
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="#4B5563"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="#4B5563"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
              
            {notifications.map(item=>{
  return(<>
  <Link >
  <div className="w-full p-3 mt-4 bg-white rounded flex">
              <div
                tabIndex={0}
                aria-label="post icon"
                role="img"
                className="focus:outline-none w-8 h-8 border rounded-full border-gray-200 flex items-center justify-center"
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.30325 12.6667L1.33325 15V2.66667C1.33325 2.48986 1.40349 2.32029 1.52851 2.19526C1.65354 2.07024 1.82311 2 1.99992 2H13.9999C14.1767 2 14.3463 2.07024 14.4713 2.19526C14.5963 2.32029 14.6666 2.48986 14.6666 2.66667V12C14.6666 12.1768 14.5963 12.3464 14.4713 12.4714C14.3463 12.5964 14.1767 12.6667 13.9999 12.6667H4.30325ZM5.33325 6.66667V8H10.6666V6.66667H5.33325Z"
                    fill="#4338CA"
                  />
                </svg>
              </div>
              <div className="pl-3">
                <p tabIndex={0} className="focus:outline-none text-sm leading-none">
      <span className="text-indigo-700">{item.message}</span>
                </p>
                <p
                  tabIndex={0}
                  className="focus:outline-none text-xs leading-3 pt-1 text-gray-500"
                >
                 {item.timestamp}
                </p>
              </div>
            </div>
            </Link>
  </>)
})}







            <div className="flex items-center justiyf-between">
              <hr className="w-full" />
              <p
                tabIndex={0}
                className="focus:outline-none text-sm flex flex-shrink-0 leading-normal px-3 py-16 text-gray-500"
              >
                Thats it for now :)
              </p>
              <hr className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </>}
    </>
  );
}
