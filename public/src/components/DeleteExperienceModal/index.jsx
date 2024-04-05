import React from "react";
import {  Modal } from "antd";
import "./index.css";

const DeleteExperienceModal = ({
  setExperienceUpdateModal,
  deleteExperienceModal,
  setDeleteExperienceModal,
  deleteExperience,
}) => {

  return (
    <div>
      <Modal
        title="Delete Experience?"
        centered
        open={deleteExperienceModal}
        onOk={() => {
          setExperienceUpdateModal(false);
          setDeleteExperienceModal(false);
          deleteExperience();
        }}
        onCancel={() => {
          setDeleteExperienceModal(false);
        }}
        okText="Yes"
        cancelText="No"
      >
        <p className="text">Are you sure to delete this Experience? If you delete the a experience once, you will 
            never be able to retrieve the experience again.
        </p>
      </Modal>
    </div>
  );
};

export default DeleteExperienceModal;

