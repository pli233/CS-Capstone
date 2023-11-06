import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DashboardActions = ({ _id }) => {
  return (
    <div className="dash-buttons">
      <Link to={`/profile/${_id}`} className="btn btn-light">
        <i className="fas fa-user-circle text-primary" /> My Profile
      </Link>
      <Link to="/edit-profile" className="btn btn-light">
        {/* <i className="fas fa-user-circle text-primary" /> Edit Profile */}
        <i className="fa-solid fa-pen-to-square"></i> Edit Profile
      </Link>
      {/* <Link to='/add-experience' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary' /> Add Experience
      </Link> */}
      <Link to="/add-cat" className="btn btn-light">
        <i className="fa-solid fa-cat" style={{ color: '#7f6b06' }} /> Add Cat
      </Link>
    </div>
  );
};
DashboardActions.propTypes = {
  _id: PropTypes.string.isRequired,
};

export default DashboardActions;
