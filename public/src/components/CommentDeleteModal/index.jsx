import React from "react";
import { Modal } from "antd";
import "./index.css";

const CommentDeleteModal = ({
  commentDeleteModal,
  setCommentDeleteModal,
  deleteComment,
}) => {

  return (
    <div>
      <Modal
        title="Delete Comment?"
        centered
        open={commentDeleteModal}
        onOk={() => {
          setCommentDeleteModal(false);
          deleteComment();
        }}
        onCancel={() => {
          setCommentDeleteModal(false);
        }}
        okText="Yes"
        cancelText="No"
      >
        <p className="text">Are you sure to delete this Comment?
        </p>
      </Modal>
    </div>
  );
};

export default CommentDeleteModal;

