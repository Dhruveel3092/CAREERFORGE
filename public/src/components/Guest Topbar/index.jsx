import React from "react";
import { useNavigate } from "react-router-dom";
import app_logo from "../../assets/app_logo.png";
import "./index.css";

export default function GuestTopbar() {
  const navigate = useNavigate();

  return (
    <div className="topbar-main">
      <div className="react-icons">
        <img src={app_logo} alt="app_logo" className="app-logo" onClick={()=>navigate("/login")}/>
        <div className="login-sinup-buttons">
          <button className="login-button" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="signup-button" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
