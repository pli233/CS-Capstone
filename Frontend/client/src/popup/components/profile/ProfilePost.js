import React from 'react';
import PropTypes from 'prop-types';
import PostItem from './PostItem';

import './Profile.css';
import './PostItem.css';

const ProfilePost = ({ posts }) => (
  <div className="profile-posts-grid">
    <div className="items-container">
      {posts
        .filter((_, index) => index % 2 !== 0)
        .map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
    </div>
    <div className="items-container">
      {posts
        .filter((_, index) => index % 2 === 0)
        .map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
    </div>
  </div>
);

ProfilePost.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default ProfilePost;
