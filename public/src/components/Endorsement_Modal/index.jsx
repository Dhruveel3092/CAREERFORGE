import React from "react";
import { Modal } from "antd";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import "./index.css";

const EndorsementModal = ({ endorsementModal, setEndorsementModal, allEndorsements }) => {
    const navigate = useNavigate();

    const handleClick = (event,username)=>{
        event.stopPropagation();
        navigate(`/profile/${username}`);
    }

  return (
    <Modal
      title={<span style={{ fontSize: '24px' }}>Endorsements</span>}
      centered
      open={endorsementModal}
      onOk={() => {
        setEndorsementModal(false);
      }}
      onCancel={() => {
        setEndorsementModal(false);
      }}
      footer={null}
      wrapClassName="custom-modal"
    >
    <div className="main">
      <hr style={{ backgroundColor: '#b7b7b7', marginTop: '10px' }} />
      <StyledSuggestions>
      {allEndorsements &&
          allEndorsements.map((item, index) => (
            <StyledButton key={index} onClick={(e)=>handleClick(e,item?.username)}>
              <img src={item?.avatarImage} alt="Profile" />
              <div className="userName">{item?.username}</div>
            </StyledButton>
          ))}
      </StyledSuggestions>
    </div>
    </Modal>
  );
};

export default EndorsementModal;

const StyledSuggestions = styled.div`
  max-height: 400px; /* Maximum height for the list of buttons before scroll bar appears */
  overflow-y: auto; /* Add scroll bar when needed */
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px; /* Increased padding for a larger button */
  border: none;
  background-color: transparent;
  cursor: pointer;
  width:470px;

  img {
    width: 40px; /* Increased image size */
    height: 40px;
    border-radius: 50%;
    margin-right: 15px; /* Increased margin for more spacing */
  }

  &:hover {
    background-color: #f0f0f0; /* Add your desired hover background color */
  }
`;