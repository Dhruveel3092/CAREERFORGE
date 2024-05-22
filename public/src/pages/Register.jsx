import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import {host} from "../utils/APIRoutes"
import home from "../assets/home.png";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [currentUser, setCurrentUser] = useState(undefined);

  // useEffect(() => {
  //   if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
  //     navigate("/home");
  //   }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
       // console.log("current",currentUser)
       // console.log(response,"response")
        const response = await axios.get(`${host}/login/sucess`, {withCredentials: true});
        console.log(response,"response");
        if(response.data.sta==1){
          if(response.data.user) 
          {
              setCurrentUser(response.data.user)
              navigate("/home");
          }
        }
  
    } catch (error) {
      console.log(error)
      navigate("/login")
    }

    };

    
    fetchData();
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      },{withCredentials: true});

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        navigate("/home");
      }
    }
  };

  return (
    <>
      <nav className='navb'>
       <Link to='/' className='link-na'>Home</Link>
       <Link to='/login' className='link-na'>Sign-in</Link>
       <Link to='/register' className='link-na'>Sign-up</Link>
      </nav>
      <div className="container-7866">
        <div class="image-container">
          <img src={home} alt="login" />
        </div>
      <div className="form-container">
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span className="create-one">
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      </div>
      <ToastContainer />
      </div>
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #9195F6;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: black;
      text-transform: uppercase;
    }
  }
  .navb{
    background-color: black;
    padding: 20px;
    width:100vw;
    position:sticky;
    display: flex;
    gap:2rem;
    justify-content: flex-end;
  }
  .link-na{
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-size: 15px; 
    margin-top: 8px;
    &:hover{
      color: #10b981;
      cursor: pointer;
      transition: 0.3s;
    }
  }

  .input-container {
    padding-left: 10px;
    margin: 0px;
    border: solid 2px white;
    border-radius: 0.4rem;
    background-color: white;
}

#password{
  display: flex;
}
#password > input{
  flex: 1;
}
#password > a{
  text-decoration: none;
  margin-top: 7px;
  padding-top: 3px;
  padding-right: 15px;
  padding-left: 8px;
  color: rgb(114, 113, 113);
  font-size: 14px;
  border-left: 0.1px solid rgb(101, 100, 100);
  height:25px;
}
#password > i{
  padding-top:12px;
}

.separator::before, .separator::after {
  content: "";
  display: inline-block;
  height: 1px;
  background-color:rgb(169, 209, 249);
  width: 39%;
}
.separator::before {
  margin-right: 10px;
}
.separator::after {
  margin-left: 10px;
}
.google-signin-btn:hover{
  background-color: rgb(10, 19, 139);
}
.google:hover{
  background-color: rgb(10, 19, 139);
}
.google{
  display: flex;
  gap: 1.5rem;
  border-radius: 15px;
  padding: 10px;
  width: 80%;
  border: 1px solid;
  background-color: black;
  margin: auto;
  margin-bottom:10px;
}

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: white;
    padding: 1rem;
    border: none;
    border-radius: 0.4rem;
    color: black;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: black;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: black;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
