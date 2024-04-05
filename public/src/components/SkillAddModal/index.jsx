import React from "react";
import { Button, Modal } from "antd";
import "./index.css";

export default function SkillAddModal({
  skillAddModal,
  setSkillAddModal,
  inputSkill,
  setInputSkill,
  addSkill
}) {

  return (
    <div>
      <Modal
        title="Add Skill"
        centered
        open={skillAddModal}
        onOk={addSkill}
        onCancel={() => {
            setSkillAddModal(false)
            setInputSkill('');
        }
            }
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={addSkill}
            disabled={inputSkill.trim()==''}
          >
            Save
          </Button>
        ]}
      >
        <input
          className="skill-input"
          placeholder="Skill (ex: Web Development)"
          onChange={(event)=>setInputSkill(event.target.value)}
          value={inputSkill}
        />
      </Modal>
    </div>
  );
}