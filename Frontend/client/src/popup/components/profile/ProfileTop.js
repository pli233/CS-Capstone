import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({
  profile: {
    name,
    website,
    status,
    location,
    social,
    user: {avatar}
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <div className='avatar-container'>
        <div className='avatar'>
          {avatar ? <img src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + avatar} alt='' />
            : <img src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + 'public/user/avatar/default-avatar.jpeg'} alt='' />}
        </div>
      </div>
      <h1 className="large">{name}</h1>

      <p>{location ? <span>{location}</span> : null}</p>
      <div className="icons my-1">
        {website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-globe fa-2x" />
          </a>
        ) : null}
        {social
          ? Object.entries(social)
            .filter(([_, value]) => value)
            .map(([key, value]) => (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={`fab fa-${key} fa-2x`}></i>
              </a>
            ))
          : null}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
