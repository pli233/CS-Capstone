import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import timeSince from '../../utils/calculateDate';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';
import { Dropdown, message } from 'antd';
import './PostItem.css';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, title, name, avatar, user, likes, created, profile, text, pictures, cat },
}) => {
  const [liked, setLiked] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  useEffect(() => {
    if (likes && Array.isArray(likes)) {
      const userLiked = likes.some((like) => like.user.toString() === auth.user._id.toString());
      setLiked(userLiked);
    }
  }, [likes, auth.user._id]);

  const handleImageClick = (imgId) => {
    setSelectedImg(imgId);
  };

  const handleBackgroundClick = () => {
    setSelectedImg(null);
  };

  const handleDeletedClick = async (id) => {
    const isDelete = await deletePost(id);
    if (isDelete) {
      messageApi.open({
        type: 'success',
        content: 'Post deleted',
      });
      navigate('/posts');
    } else {
      messageApi.open({
        type: 'error',
        content: 'Post deleted failed',
      });
    }
  };

  const items = [
    {
      label: (
        <div onClick={() => {}}>
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div
          onClick={() => {
            handleDeletedClick(_id);
          }}
        >
          <i className="fa-solid fa-trash-can"></i> Delete
        </div>
      ),
      key: '2',
      danger: true,
    },
  ];

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
      {contextHolder}
      <div className="post-container bg-light p-1 my-1">
        <div className="post-avatar-name-field">
          {cat ? (
            <Link to={`/profile/${user}`}>
              {cat.avatar ? (
                <img
                  className="avatar-post-img"
                  src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + cat.avatar}
                  alt=""
                />
              ) : (
                <img
                  className="avatar-post-img"
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
                <img
                  className="avatar-post-img"
                  src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + avatar}
                  alt=""
                />
              ) : (
                <img
                  className="avatar-post-img"
                  src={
                    process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT +
                    'public/user/avatar/default-avatar.jpeg'
                  }
                  alt=""
                />
              )}
            </Link>
          )}
          <Link to={`/profile/${user}`} className="post-user-name">
            <h3>{cat && cat.name ? cat.name : name}</h3>
          </Link>
          <p className="post-date m-1">Posted on {timeSince(created)}</p>
          <div className="post-user-option">
            {!auth.loading && user === auth.user._id ? (
              <Dropdown
                menu={{
                  items,
                }}
              >
                <div className="icon-box">
                  <i className="fa-solid fa-ellipsis"></i>
                </div>
              </Dropdown>
            ) : (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <div onClick={() => {}}>
                          <i className="fa-solid fa-star" style={{ color: '#e5d957' }} /> Collect
                        </div>
                      ),
                      key: '1',
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

        {/* <div>
        <h3>{title}</h3>

        <button onClick={handleOnClickLikePost} type="button" className="btn btn-gray">
          {liked ? (
            <i className="fa-solid fa-heart" style={{ color: '#ed0202' }} />
          ) : (
            <i className="fa-regular fa-heart"></i>
          )}{' '}
          <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
        </button>
      </div> */}
        <div className="post-content">
          {pictures && pictures.length > 0 && (
            <div className="image-container">
              {pictures.map((picture) => (
                <div
                  key={picture._id}
                  className={`image ${selectedImg === picture._id ? 'zoom' : ''}`}
                  onClick={() => handleImageClick(picture._id)}
                >
                  <img
                    src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + picture.picture}
                    alt={picture._id}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedImg && (
            <div className="zoom-container" onClick={handleBackgroundClick}>
              <img
                src={
                  process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT +
                  pictures.find((p) => p._id === selectedImg).picture
                } // 找到选中的图片
                alt={selectedImg}
                className="zoom-image"
                style={{ transform: 'scale(1.5)' }}
              />
            </div>
          )}
          <h3 className="post-text">{text}</h3>
          <div className="post-like-collection-field ">
            <div className="post-like">
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
