import React from 'react';
import PropTypes from 'prop-types';
import calculateAge from '../../utils/calculateAge';

import './Profile.css'

const Profilecats = ({
  cat: {name, sex, status, birthday, bio, avatar}
}) => (
  <div className="cat-profile bg-light my-1 p-1">
    <div className='cat-profile-grid '>
      <h3 className="text-dark cat-profile-name">{name}</h3>
      <div className='cat-profile-about'>
        <p>
          <strong>Age: </strong> {calculateAge(birthday)}
        </p>
        <p>
          <strong>Sex: </strong> {sex}
        </p>
        <p>
          <strong>Current status: </strong> {status}
        </p>
        {bio && <p>
          <strong>Description: </strong> {bio}
        </p>}
      </div>
      <div className='cat-profile-avatar'>
        {avatar ? (
          <img className='round-img-xs'
            src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + avatar}
            alt=""
          />
        ) : (
          <img className='round-img-xs'
            src={process.env.REACT_APP_FILE_DOWNLOAD_APIENDPOINT + 'public/user/avatar/cat-default-avatar.png'} alt='' />
        )}
      </div>
    </div>
  </div>
);

Profilecats.propTypes = {
  cat: PropTypes.object.isRequired
};

export default Profilecats;
