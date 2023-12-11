import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../actions/post';

const Posts = ({ getPosts, post: { posts }, search, setRoute, handleSetMessages }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <section>
      <div className="posts">
        {posts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            search={search}
            setRoute={setRoute}
            handleSetMessages={handleSetMessages}
          />
        ))}
      </div>
    </section>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  setRoute: PropTypes.func.isRequired,
  handleSetMessages: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
