import api from '../utils/api';
import {setAlert} from './alert';

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS,
  NO_REPOS,
  UPDATE_AVATAR
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await api.get('/profile/home');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err
    });
  }
};

// Get all profiles
export const getProfiles = (pageNum = 1, pageSize = 10, name) => async (dispatch) => {
  dispatch({type: CLEAR_PROFILE});

  try {
    const res = await api.get('/profile/all', {
      params: {
        pageNum: pageNum,
        pageSize: pageSize,
        name: name
      }
    });
    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err
    });
  }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    return true;
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err
    });
    return false;
  }
};

// Get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await api.get(`/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NO_REPOS
    });
  }
};

// Create or update profile
export const createProfile =
  (formData, edit = false) =>
    async (dispatch) => {
      try {
        const res = await api.post('/profile', formData);

        dispatch({
          type: GET_PROFILE,
          payload: res.data
        });

        dispatch(
          setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
        );
        return true;
      } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        const msg = err.response.data.msg;
        if (msg) {
          dispatch(setAlert(err.response.data.msg, 'danger'));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: err
        });
        return false;
      }
    };

// Add Experience
export const addExperience = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/profile/experience', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Added', 'success'));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Add Education
export const addEducation = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/profile/education', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Added', 'success'));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status}
    });
  }
};

// Delete experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err
    });
  }
};

// Delete education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err
    });
  }
};

// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete('/profile');

      dispatch({type: CLEAR_PROFILE});
      dispatch({type: ACCOUNT_DELETED});

      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err
      });
    }
  }
};

// upload avatar
export const uploadAvatar = (image) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('avatar', image);
    console.log(formData)
    const res = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({
      type: UPDATE_AVATAR,
      payload: res.data
    });

    return true;
  } catch (err) {
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    return false;
  }
};
