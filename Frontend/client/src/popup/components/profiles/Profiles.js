import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import {getProfiles} from '../../actions/profile';
import {Pagination, Input} from 'antd';

const {Search} = Input;

const Profiles = ({getProfiles, profile: {profiles, loading, totalProfile}}) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  const [searchText, setSearchText] = useState('');
  const [profilePage, setProfilePage] = useState('');
  const [profilePageSize, setProfilePageSize] = useState('');
  const handlePageChange = async (page, pageSize) => {
    setProfilePage(page);
    setProfilePageSize(pageSize);
    await getProfiles(page, pageSize, searchText);
  }

  const onSearch = async (value, _e, info) => {
    setSearchText(value);
    await getProfiles(profilePage, profilePageSize, value);
  };

  return (
    <section className="container">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Kats</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and explore with
            fun cats
          </p>
          <Search
            className='my-1'
            placeholder="search user name"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
          <div className='m-2'>
            <Pagination
              showSizeChanger
              defaultCurrent={1}
              defaultPageSize={10}
              pageSizeOptions={[1, 5, 10, 20]}
              onChange={handlePageChange}
              total={totalProfile}
            />
          </div>
        </Fragment>
      )}
    </section>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(mapStateToProps, {getProfiles})(Profiles);
