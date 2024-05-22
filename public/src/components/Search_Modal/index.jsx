import React, { useState } from "react";
import { Button, Modal } from "antd";
import "./index.css";
import styled from 'styled-components';
import "./index.css";

const SearchModal = ({
  modalOpen,
  setModalOpen,
  query,
  setQuery,
  filteredData,
  handleInputChange,
  handleButtonClick,
}) => {

  return (
    <div>
      <Modal
        className="like-mdl"
        title="Search Users"
        centered
        open={modalOpen}
        onOk={() => {
          setModalOpen(false);
        }}
        onCancel={() => {
          setModalOpen(false);
          setQuery('');
        }}
        footer={null}
      >
        <input
          className="modal-input search-218329"
          placeholder="Search"
          onChange={(event)=>handleInputChange(event)}
          value={query}
        />
        <StyledSuggestions>
        {filteredData &&
          filteredData.map((item, index) => (
            <StyledButton key={index} onClick={() => handleButtonClick(item.username)}>
              <img src={item.avatarImage} alt="Profile" />
              <div className="userName userName-984802">{item.username}</div>
            </StyledButton>
          ))}
      </StyledSuggestions>
      </Modal>
    </div>
  );
};

export default SearchModal;

const StyledSuggestions = styled.div`
  max-height: 400px; /* Maximum height for the list of buttons before scroll bar appears */
  overflow-y: auto; /* Add scroll bar when needed */
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  width:470px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 15px;
  }

  &:hover {
    background-color: #4a515e; /* Add your desired hover background color */
  }
`;