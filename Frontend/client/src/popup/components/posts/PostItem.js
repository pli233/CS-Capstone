import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import timeSince from '../../utils/calculateDate';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import './PostItem.css';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, title, name, avatar, user, likes, created, profile, cover, cat },
}) => {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (likes && Array.isArray(likes)) {
      const userLiked = likes.some((like) => like.user.toString() === auth.user._id.toString());
      setLiked(userLiked);
    }
  }, [likes, auth.user._id]);

  const handleOnClickLikePost = async () => {
    if (liked) {
      await removeLike(_id);
      setLiked(false);
    } else {
      await addLike(_id);
      setLiked(true);
    }
  };

  return (
    <Fragment>
      <div className="bg-light post-item ">
        <Link to={`/posts/${_id}`}>
          {cover && <img src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + cover} alt={''} />}
        </Link>
        <div className="post-title">
          <h4 className="my">{title}</h4>
        </div>
        <div className="post-grid">
          <div className="post-avatar ">
            {cat ? (
              <Link to={`/profile/${user}`}>
                {cat.avatar ? (
                  <img src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + cat.avatar} alt="" />
                ) : (
                  <img
                    src={
                      process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT +
                      'public/user/avatar/cat-default-avatar.png'
                    }
                    alt=""
                  />
                )}
              </Link>
            ) : (
              <Link to={`/profile/${user}`}>
                {avatar ? (
                  <img src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + avatar} alt="" />
                ) : (
                  <img
                    src={
                      process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT +
                      'public/user/avatar/default-avatar.jpeg'
                    }
                    alt=""
                  />
                )}
              </Link>
            )}
          </div>
          <div className="post-name">
            <Link to={`/profile/${user}`}>
              <div className="mobile-layout">
                <h5>{cat && cat.name ? cat.name : name}</h5>
              </div>
              <div className="computer-layout">
                <h4>{cat && cat.name ? cat.name : name}</h4>
              </div>
            </Link>
          </div>
          <div className="post-date">
            <small className="form-text">{timeSince(created)}</small>
          </div>
          <div className="post-like ">
            <div className="icon-box" onClick={handleOnClickLikePost}>
              {liked ? (
                <i className="fa-solid fa-heart" style={{ color: '#ed0202' }} />
              ) : (
                <i className="fa-regular fa-heart"></i>
              )}
            </div>{' '}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);
