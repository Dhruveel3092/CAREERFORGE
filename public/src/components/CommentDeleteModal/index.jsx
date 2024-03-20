import React, { useState } from "react";
import { Button, Modal } from "antd";
import "./index.css";
import styled from 'styled-components';
import "./index.css";

const CommentDeleteModal = ({
  commentDeleteModal,
  setCommentDeleteModal,
  commentId,
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
          deleteComment(commentId);
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

