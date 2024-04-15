import React, { useState } from "react";
import { Button, Modal, Progress } from "antd";
import { AiOutlinePicture} from "react-icons/ai";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./index.css";

const ArticleModal = ({
  articleModal,
  setArticleModal,
  sendStatusForArticle,
  setStatus,
  status,
}) => {

  return (
    <div className="modal-style">
      <Modal
        title="Create a article"
        centered
        open={articleModal}
        onOk={() => {
          setArticleModal(false);
        }}
        onCancel={() => {
          setArticleModal(false);
          setStatus("");
        }}
        footer={[
          <Button
            onClick={sendStatusForArticle}
            key="submit"
            type="primary"
            disabled={status.length > 0 ? false : true}
          >
            Post
          </Button>,
        ]}
        className="custom-modal"
      >
        <div className="modal-body">
        <div className="posts-body">
          <ReactQuill className="modal-input" theme="snow" value={status} onChange={setStatus} />
        </div>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleModal;