import React from "react";
import {  Modal } from "antd";
import "./index.css";

const DeletePostModal = ({
  modalOpen,
  setModalOpen,
  deletePost,
}) => {

  return (
    <div>
      <Modal
        title="Delete Post?"
        centered
        open={modalOpen}
        onOk={() => {
          setModalOpen(false);
          deletePost();
        }}
        onCancel={() => {
          setModalOpen(false);
        }}
        okText="Yes"
        cancelText="No"
      >
        <p className="text">Are you sure to delete this Post? If you delete the a post once, you will 
            never be able to retrieve the post again.
        </p>
      </Modal>
    </div>
  );
};

export default DeletePostModal;

