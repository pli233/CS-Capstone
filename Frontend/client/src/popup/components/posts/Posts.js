import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import PostItem from './PostItem';
import PostForm from './PostForm';
import {getPosts} from '../../actions/post';
import {FloatButton} from 'antd';
import {Pagination, Input} from 'antd';

const {Search} = Input;

const Posts = ({getPosts, post: {posts, totalPosts}}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const [searchText, setSearchText] = useState('');
  const [postPage, setPostPage] = useState('');
  const [postPageSize, setPostPageSize] = useState('');

  const handlePageChange = async (page, pageSize) => {
    setPostPage(page);
    setPostPageSize(pageSize);
    await getPosts(page, pageSize, searchText);
  }

  const onSearch = async (value, _e, info) => {
    setSearchText(value);
    await getPosts(postPage, postPageSize, value);
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fa-solid fa-comments"></i> Welcome to the community !
      </p>
      <PostForm />
      <Search
        className='my-1'
        placeholder="search posts"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
      />
      <div className='computer-layout'>
        <div className="posts">
          <div className='items-container'>
            {posts.filter((_, index) => index % 3 === 1).map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
          <div className='items-container'>
            {posts.filter((_, index) => index % 3 === 2).map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
          <div className='items-container'>
            {posts.filter((_, index) => index % 3 === 0).map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>

      <div className='mobile-layout'>
        <div className="posts">
          <div className='items-container'>
            {posts.filter((_, index) => index % 2 !== 0).map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
          <div className='items-container'>
            {posts.filter((_, index) => index % 2 === 0).map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
      <div className='m-2'>
        <Pagination
          showSizeChanger
          defaultCurrent={1}
          defaultPageSize={10}
          pageSizeOptions={[1, 5, 10, 20]}
          onChange={handlePageChange}
          total={totalPosts}
        />
      </div>
      <FloatButton.BackTop />
    </section>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post
});

export default connect(mapStateToProps, {getPosts})(Posts);
