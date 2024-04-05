import React from "react";
import {  Modal } from "antd";
import "./index.css";

const DeleteEducationModal = ({
  deleteEducationModal,
  setDeleteEducationModal,
  deleteEducation,
}) => {

  return (
    <div>
      <Modal
        title="Delete Education?"
        centered
        open={deleteEducationModal}
        onOk={() => {
          setDeleteEducationModal(false);
          deleteEducation();
        }}
        onCancel={() => {
          setDeleteEducationModal(false);
        }}
        okText="Yes"
        cancelText="No"
      >
        <p className="text">Are you sure to delete this Education? If you delete the a education once, you will 
            never be able to retrieve the education again.
        </p>
      </Modal>
    </div>
  );
};

export default DeleteEducationModal;

