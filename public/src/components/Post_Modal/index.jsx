import React, { useState } from "react";
import { Button, Modal, Progress } from "antd";
import { AiOutlinePicture} from "react-icons/ai";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./index.css";

const ModalComponent = ({
  modalOpen,
  setModalOpen,
  sendStatus,
  setStatus,
  status,
  files,
  setFiles,
}) => {

  return (
    <div className="modal-style">
      <Modal
        title="Create a post"
        centered
        open={modalOpen}
        onOk={() => {
          setModalOpen(false);
        }}
        onCancel={() => {
          setModalOpen(false);
          setFiles([]);
          setStatus("");
        }}
        footer={[
          <Button
            onClick={sendStatus}
            key="submit"
            type="primary"
            disabled={status.length > 0 || files.length > 0 ? false : true}
          >
            Post
          </Button>,
        ]}
        className="custom-modal"
      >
        <div className="modal-body">
        <div className="posts-body">
          <ReactQuill className="modal-input" theme="snow" value={status} onChange={setStatus} />
          <hr/>
          {files.length > 0 ? (
            <div className="image-preview-container">
              {files.map((file, index) => (
                file.type.split("/")[0] === "image" ? (
                  <img
                    key={index}
                    className="preview-img"
                    src={URL.createObjectURL(file)}
                    alt={`postImage-${index}`}
                  />
                ) : (
                  <video width="470" height="300" controls key={index}>
                    <source src={URL.createObjectURL(file)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              ))}

            </div>
          ) : (
            <></>
          )}
        </div>
        </div>
        <label for="pic-upload">
          <AiOutlinePicture size={35} className="picture-icon" />
        </label>
        <input
          id="pic-upload"
          type={"file"}
          hidden
          multiple
          accept="image/*,video/*"
          onChange={(event) =>
            setFiles([...event.target.files])
          }
        />
      </Modal>
    </div>
  );
};

export default ModalComponent;