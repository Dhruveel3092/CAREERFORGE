import React from "react";
import {  Modal } from "antd";
import "./index.css";

const DeleteSkillModal = ({
  deleteSkillModal,
  setDeleteSkillModal,
  deleteSkill,
}) => {

  return (
    <div>
      <Modal
        title="Delete Skill?"
        centered
        open={deleteSkillModal}
        onOk={() => {
          setDeleteSkillModal(false);
          deleteSkill();
        }}
        onCancel={() => {
          setDeleteSkillModal(false);
        }}
        okText="Yes"
        cancelText="No"
      >
        <p className="text">Are you sure to delete this Skill? If you delete the a skill once, you will 
            never be able to retrieve the skill again.
        </p>
      </Modal>
    </div>
  );
};

export default DeleteSkillModal;

