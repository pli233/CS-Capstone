import api from '../utils/api';
import {setAlert} from './alert';

import {
  GET_CAT,
  GET_CATS,
  CAT_ERROR,
  GET_MYCATS,
  CLEAR_CAT,
  UPDATE_CAT,
  UPDATE_CAT_AVATAR
} from './types';

// Create cat
export const addCat =
  (formData, edit = false) =>
    async (dispatch) => {
      try {
        const res = await api.post('/cats', formData);

        dispatch({
          type: GET_CAT,
          payload: res.data
        });

        await dispatch(
          setAlert('Cat Added', 'success')
        )
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
        if (err.response) {
          dispatch({
            type: CAT_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
          });
        }

        return false;
      }
    };

// Get current user cats
export const getMyCats = () => async (dispatch) => {
  try {
    const res = await api.get('/cats/mycats');

    dispatch({
      type: GET_MYCATS,
      payload: res.data
    });
    return true;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    if (err.response) {
      dispatch({
        type: CAT_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }

    return false;
  }
};

// Delete cat
export const deleteCat = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/cats/${id}`);

    dispatch({
      type: CLEAR_CAT,
      payload: res.data
    });

    dispatch(setAlert('Cat Removed', 'success'));
    return true;
  } catch (err) {
    if (err.response) {
      dispatch({
        type: CAT_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    return false;
  }
};

// update cat
export const updateCat =
  (formData, id, edit = false) =>
    async (dispatch) => {
      try {
        const res = await api.post(`/cats/${id}`, formData);
        dispatch({
          type: UPDATE_CAT,
          payload: res.data
        });

        dispatch(
          setAlert('Cat Updated', 'success')
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
        if (err.response) {
          dispatch({
            type: CAT_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
          });
        }

        return false;
      }
    };

// Get cat by ID
export const getCatById = (catId) => async (dispatch) => {
  try {
    const res = await api.get(`/cats/home/${catId}`);

    dispatch({
      type: GET_CAT,
      payload: res.data
    });
    return true;
  } catch (err) {
    if (err.response) {
      dispatch({
        type: CAT_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    return false;
  }
};

// Get cat by ID
export const getCatsByUserId = (user_id) => async (dispatch) => {
  try {
    const res = await api.get(`/cats/user/${user_id}`);

    dispatch({
      type: GET_CATS,
      payload: res.data
    });
    return true;
  } catch (err) {
    if (err.response) {
      dispatch({
        type: CAT_ERROR,
        payload: {msg: err.response.statusText, status: err.response.status}
      });
    }
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    return false;
  }
};

// upload cat avatar
export const uploadCatAvatar = (image, catId) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('avatar', image);
    const res = await api.post(`/cats/avatar/${catId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const data = {
      catId,
      avatar: res.data,
    };
    dispatch({
      type: UPDATE_CAT_AVATAR,
      payload: data
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
