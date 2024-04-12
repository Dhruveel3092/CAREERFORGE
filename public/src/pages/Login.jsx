import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { FaGoogle } from "react-icons/fa";
import {host} from "../utils/APIRoutes"

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  // useEffect(() => {
  //   if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
  //     navigate("/home");
  //   }
  // }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const simulateGoogleSignIn= async ()=>{
   
     window.open("http://localhost:8080/auth/google","_self");

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <div class="separator">or</div>
                <div class="google">
                <FaGoogle size={30}/>
                
                </div>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
        <button class="google-signin-btn" onClick={simulateGoogleSignIn}>Sign in with Google</button>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  
.separator {
  text-align: center;
  margin: 2px 0;
  color: white;
  position: relative;
  font-weight: 600;
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
.google-signin-btn {
  color: white;
  padding: 10px 0px 10px 0px;
  border: none;
  border-radius: 3px;
  font-weight: 500;
  background-color: transparent;
  margin-right: 0%;
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
  border: 1px solid rgb(80, 80, 251);
  background-color: rgb(10, 19, 139);
  background-color: rgb(80, 80, 251);
  margin: auto;
  margin-bottom:10px;
}

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
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
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
