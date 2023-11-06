import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  COMMENT_ERROR,
  GET_COMMENTS,
  UPDATE_COMMENT_LIKES,
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Get posts
export const getPosts =
  (pageNum = 1, pageSize = 10, title) =>
  async (dispatch) => {
    try {
      const res = await api.get('/posts', {
        params: {
          pageNum: pageNum,
          pageSize: pageSize,
          title: title,
        },
      });

      dispatch({
        type: GET_POSTS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: err,
      });
    }
  };

// Get user posts
export const getUserPostsById =
  (pageNum = 1, pageSize = 4, title = '', userId) =>
  async (dispatch) => {
    try {
      const res = await api.get(`/posts/user/${userId}`, {
        params: {
          pageNum: pageNum,
          pageSize: pageSize,
          title: title,
        },
      });
      dispatch({
        type: GET_POSTS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: err,
      });
    }
  };

// Add like
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
  }
};

// Remove like
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
  }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.delete(`/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert('Post Removed', 'success'));
    return true;
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    return false;
  }
};

// Add post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert('Post Created', 'success'));
    return true;
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    return false;
  }
};

// Get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
  }
};

// Add comment
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await api.post(`/posts/comment/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(setAlert('Comment Added', 'success'));
    return true;
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
    return false;
  }
};

// Delete comment
export const deleteComment = (postId, commentId, rootId) => async (dispatch) => {
  try {
    const res = await api.delete(`/posts/comment/${postId}/${commentId}?root=${rootId}`);
    dispatch({
      type: REMOVE_COMMENT,
      payload: {
        commentId, // Include commentId in the payload
        data: res.data, // Include res.data in the payload under a different key
      },
    });

    dispatch(setAlert('Comment Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
  }
};

// Get post & Comment
export const getPostComments = (id) => async (dispatch) => {
  try {
    const resComment = await api.get(`/posts/comment/${id}`);
    const resPost = await api.get(`/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: resPost.data,
    });
    dispatch({
      type: GET_COMMENTS,
      payload: resComment.data,
    });
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
  }
};
// Add like
export const addCommentLike = (commentId, rootId) => async (dispatch) => {
  try {
    const res = await api.post(`/posts/comment/like/${commentId}?root=${rootId}`);

    dispatch({
      type: UPDATE_COMMENT_LIKES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });
    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
  }
};

// Remove like
export const removeCommentLike = (commentId, rootId) => async (dispatch) => {
  try {
    const res = await api.post(`/posts/comment/unlike/${commentId}?root=${rootId}`);

    dispatch({
      type: UPDATE_COMMENT_LIKES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err,
    });

    const msg = err.response.data.msg;
    if (msg) {
      dispatch(setAlert(err.response.data.msg, 'danger'));
    }
  }
};
