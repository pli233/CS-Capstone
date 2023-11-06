import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileCat from './ProfileCat';
import { getProfileById } from '../../actions/profile';
import { getCatsByUserId } from '../../actions/cat';
import { getUserPostsById } from '../../actions/post';
import ProfilePost from './ProfilePost';
import { Pagination, Input } from 'antd';

const { Search } = Input;

const Profile = ({
  getProfileById,
  getCatsByUserId,
  getUserPostsById,
  profile: { profile },
  auth,
  cat: { cats },
  post: { posts, totalPosts },
}) => {
  const { id } = useParams();

  useEffect(() => {
    if (!auth.loading) {
      getProfileById(id);
      getCatsByUserId(id);
      getUserPostsById(1, 4, '', id);
    }
  }, [getProfileById, getCatsByUserId, getUserPostsById, id, auth.loading]);

  const [searchText, setSearchText] = useState('');
  const [postPage, setPostPage] = useState(1);
  const [postPageSize, setPostPageSize] = useState(4);

  const handlePageChange = async (page, pageSize) => {
    setPostPage(page);
    setPostPageSize(pageSize);
    await getUserPostsById(page, pageSize, searchText, id);
  };

  const onSearch = async (value, _e, info) => {
    setSearchText(value);
    await getUserPostsById(postPage, postPageSize, value, id);
  };

  return (
    <section className="container">
      {profile === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
            <Link to="/edit-profile" className="btn btn-dark">
              Edit Profile
            </Link>
          )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-post bg-white p-2">
              <h2 className="text-primary">Posts</h2>
              {!auth.isAuthenticated && (
                <>
                  <h3>Login to see posts</h3>
                  <Link to="/login" className="btn btn-gray my-1">
                    Login
                  </Link>
                </>
              )}
              {posts.length > 0 && (
                <>
                  <ProfilePost posts={posts} />
                  <div className="my-1">
                    <Pagination
                      showSizeChanger
                      defaultCurrent={1}
                      defaultPageSize={4}
                      pageSizeOptions={[1, 5, 10, 20]}
                      onChange={handlePageChange}
                      total={totalPosts}
                    />
                  </div>
                </>
              )}
              {auth.isAuthenticated && (
                <>
                  <Search
                    className="my-1"
                    placeholder="search posts"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                  />
                </>
              )}
            </div>
            <div className="profile-cat bg-white p-2">
              <h2 className="text-primary">Cats</h2>
              {cats.length > 0 ? (
                <Fragment>
                  {cats.map((cat) => (
                    <ProfileCat key={cat._id} cat={cat} />
                  ))}
                </Fragment>
              ) : (
                <h4>No Cats</h4>
              )}
            </div>

            {/* {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )} */}
          </div>
        </Fragment>
      )}
    </section>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  getCatsByUserId: PropTypes.func.isRequired,
  getUserPostsById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  cat: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
  cat: state.cat,
  post: state.post,
});

export default connect(mapStateToProps, { getProfileById, getCatsByUserId, getUserPostsById })(
  Profile,
);
