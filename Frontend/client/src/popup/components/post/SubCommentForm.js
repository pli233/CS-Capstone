import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addComment} from '../../actions/post';
import {Modal, message} from 'antd';

const CommentForm = ({postId, rootId, replyComment, addComment}) => {
  const [text, setText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const created = await handleSubmit();
    if (!created) {
      messageApi.open({
        type: 'error',
        content: 'Comment submit failed',
      });
      return;
    }
    setIsModalOpen(false);
    setText('');
    messageApi.open({
      type: 'success',
      content: 'Comment submitted',
    });
  };
  const handleCancel = () => {
    setText('');
    setIsModalOpen(false);
  };
  const handleSubmit = async () => {

    const formData = new FormData();

    formData.append("text", text);
    formData.append('root', rootId);
    if (replyComment) {
      formData.append("reply", replyComment._id);
      formData.append("replyToName", replyComment.name);
    }
    try {
      const created = await addComment(postId, formData);
      return created;
    } catch (error) {
      console.error("Error uploading post:", error);
      return false;
    }
  };
  return (
    <Fragment>
      {contextHolder}
      <div className='icon-box'
        onClick={() => {
          showModal()
        }}>
        <p className="my-1 reply-icon">reply</p>
      </div>
      <Modal
        title={replyComment ? 'Reply to ' + replyComment.name : 'Reply'}
        okText='Submit'
        okType='danger'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <div className='post-form'>
          <div className='bg-primary p'>
            <h3>Leave a Comment</h3>
          </div>
          <form
            className='form my-1'
          >
            <textarea
              name='text'
              cols='30'
              rows='5'
              placeholder='Reply the comment'
              value={text}
              onChange={e => setText(e.target.value)}
              required
            />
          </form>
        </div>
      </Modal>
    </Fragment>

  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  rootId: PropTypes.string.isRequired
};

export default connect(
  null,
  {addComment}
)(CommentForm);
