import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

// import '../../App.css';

const Navbar = ({ auth: { isAuthenticated }, logout, setRoute }) => {
  const handleLinkClick = (route) => {
    setRoute(route);
  };
  const authLinks = (
    <div className="navbar-container">
      <div className="link-button" onClick={() => handleLinkClick('chat')}>
        Chat
      </div>
      <div className="link-button" onClick={() => handleLinkClick('history')}>
        <span>History</span>
      </div>
      <div className="link-button" onClick={() => handleLinkClick('profile')}>
        <span>Profile</span>
      </div>
    </div>
  );

  const guestLinks = (
    <div className="navbar-container">
      <div className="link-button" onClick={() => handleLinkClick('register')}>
        Register
      </div>
      <div className="link-button" onClick={() => handleLinkClick('login')}>
        Login
      </div>
    </div>
  );

  return (
    <nav className="bg-dark">
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  setRoute: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
