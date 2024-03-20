import React from "react";
import {  Modal } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Login_Modal = ({
  loginModal,
  setLoginModal,
}) => {

  const navigate = useNavigate();

  return (
    <div>
      <Modal
        title="TOMAN"
        centered
        open={loginModal}
        onOk={() => {
          setLoginModal(false);
        }}
        onCancel={() => {
          setLoginModal(false);
        }}
        footer={null}
        style={{ textAlign: "center" }}
      >
        <div className="login-sinup-buttons">
          <button className="login-buttons" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="signup-buttons" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </div>
        <p className="button-description">Log in to like or comment or view profile</p>
      </Modal>
    </div>
  );
};

export default Login_Modal;

