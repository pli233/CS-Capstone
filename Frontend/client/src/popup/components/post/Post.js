import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Link, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../post/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import {getPost, getPostComments} from '../../actions/post';
import {FloatButton} from 'antd';

const Post = ({getPost, getPostComments, post: {post, loading}}) => {
  const {id} = useParams();
  useEffect(() => {
    getPostComments(id);
  }, [id, getPostComments]);
  return loading || post === null || post.comments === null ? (
    <Spinner />
  ) : (
    <section className="container">
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
        {post.comments && post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
      <FloatButton.BackTop />
    </section>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  getPostComments: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, {getPost, getPostComments})(Post);
