import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Button } from 'antd';

const Login = ({ logout, isAuthenticated, setRoute }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    logout();
    setRoute('login');
  };

  return (
    <div>
      <Button className="btn btn-primary" onClick={onSubmit}>
        Logout
      </Button>
    </div>
  );
};

Login.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  setRoute: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(Login);
