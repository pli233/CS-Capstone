import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({
  profile: {
    user: {_id, avatar},
    name,
    status,
    location,
  }
}) => {
  return (
    <div className='profile bg-light'>
      <div className='avatar-container'>
        <div className='avatar'>
          {avatar ? <img src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + avatar} alt={name} />
            : <img src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + 'public/user/avatar/default-avatar.jpeg'} alt={name} />}
        </div>
      </div>
      <div>
        <h2>{name}</h2>

        <p>
          {status}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
      {/* <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check' /> {skill}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
