import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import timeSince from '../../utils/calculateDate';
import SubCommentForm from './SubCommentForm';
import SubCommentItem from './SubCommentItem';
import { deleteComment, addCommentLike, removeCommentLike } from '../../actions/post';
import { Dropdown } from 'antd';
import './PostItem.css';
import './Comment.css';

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, created, subcomments, likes },
  comment,
  auth,
  deleteComment,
  addCommentLike,
  removeCommentLike,
}) => {
  const checkUserLiked = (likes, auth) => {
    if (likes && Array.isArray(likes)) {
      return likes.some((like) => like.user.toString() === auth.user._id.toString());
    }
    return false;
  };
  const handleOnClickLikeComment = async (liked, commentId) => {
    let rootId = '';
    if (commentId !== _id) {
      rootId = _id;
    }
    if (liked) {
      await removeCommentLike(commentId, rootId);
    } else {
      await addCommentLike(commentId, rootId);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete the comment?');
      if (confirmDelete) {
        let rootId = '';
        if (_id !== commentId) {
          rootId = _id;
        }
        const deleted = await deleteComment(postId, commentId, rootId);
        if (deleted) {
        }
      } else {
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  return (
    <Fragment>
      <div className="comment-container bg-white">
        <div className="comment-avatar-name-field">
          <div className="comment-avatar-img">
            <Link to={`/profile/${user}`}>
              {avatar ? (
                <img
                  className="round-img"
                  src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + avatar}
                  alt=""
                />
              ) : (
                <img
                  className="round-img"
                  src={
                    process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT +
                    'public/user/avatar/default-avatar.jpeg'
                  }
                  alt=""
                />
              )}
            </Link>
          </div>
          <Link to={`/profile/${user}`} className="comment-user-name ">
            <h4>{name}</h4>
          </Link>
          <p className="comment-user-date post-date">Posted on {timeSince(created)}</p>
          <div className="comment-user-option">
            {!auth.loading && user === auth.user._id && (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <div
                          onClick={() => {
                            handleDeleteComment(_id);
                          }}
                        >
                          <i className="fa-solid fa-trash-can"></i> Delete
                        </div>
                      ),
                      key: '1',
                      danger: true,
                    },
                  ],
                }}
              >
                <div className="icon-box">
                  <i className="fa-solid fa-ellipsis"></i>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="comment-content">
          <p className="my-1">{text}</p>
        </div>
        <div>
          <div className="comment-action-field">
            <SubCommentForm postId={postId} rootId={_id} replyComment={comment} />
            <div className="comment-user-like">
              <div className="comment-like">
                <div
                  onClick={() => {
                    handleOnClickLikeComment(checkUserLiked(likes, auth), _id);
                  }}
                  className="icon-box"
                >
                  {checkUserLiked(likes, auth) ? (
                    <i className="fa-solid fa-heart like-icon" style={{ color: '#ed0202' }} />
                  ) : (
                    <i className="fa-regular fa-heart like-icon"></i>
                  )}{' '}
                  {'  '}
                </div>
              </div>
              <span className="comment-like-number">
                {likes.length > 0 && <span>{likes.length}</span>}
              </span>
            </div>
          </div>
        </div>
        {subcomments &&
          subcomments.map((subcomment) => (
            <SubCommentItem comment={subcomment} root={_id} postId={postId} />
          ))}
      </div>
    </Fragment>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  addCommentLike: PropTypes.func.isRequired,
  removeCommentLike: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment, addCommentLike, removeCommentLike })(
  CommentItem,
);
