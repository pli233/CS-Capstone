import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import Cat from './Cat';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { getMyCats } from '../../actions/cat';
import Avatar from './Avatar';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile },
  getMyCats,
  cat: { mycats },
}) => {
  useEffect(() => {
    getCurrentProfile();
    getMyCats();
  }, [getCurrentProfile, getMyCats]);
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');

    if (confirmDelete) {
      deleteAccount();
      console.log('Account deleted.');
    } else {
      // console.log('Account deletion canceled.');
    }
  };
  return (
    <section className="container">
      <h1 className="large text-primary">Dashboard</h1>
      <div>
        <div>
          <div className="my-2">{user && <Avatar user={user} />}</div>
          <p className="lead">
            <i className="fas fa-user" /> {profile ? profile.name : user && user.username}
          </p>
          {profile !== null ? (
            <>
              <div>{user && <DashboardActions _id={user._id} />}</div>
              {/* <Experience experience={profile.experience} /> */}
              {mycats.length > 0 && <Cat />}
              <div className="my-2">
                <button className="btn btn-danger" onClick={() => handleDeleteAccount()}>
                  <i className="fas fa-user-minus" /> Delete My Account
                </button>
              </div>
            </>
          ) : (
            <>
              <p>You have not yet setup a profile, please add some info</p>
              <Link to="/create-profile" className="btn btn-primary my-1">
                Create Profile
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  getMyCats: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  cat: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  cat: state.cat,
});

export default connect(mapStateToProps, { getMyCats, getCurrentProfile, deleteAccount })(Dashboard);
