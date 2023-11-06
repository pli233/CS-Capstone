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
  UPDATE_COMMENT_LIKES
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

function postReducer(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload.posts,
        totalPosts: payload.totalPosts,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.id ? {...post, likes: payload.likes} : post
        ),
        post: {...state.post, likes: payload.likes},
        loading: false
      };
    case UPDATE_COMMENT_LIKES:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.map(comment =>
            comment._id === payload._id ? payload : comment
          )
        },
        loading: false
      };
    case ADD_COMMENT: {
      const updatedComments = state.post.comments.slice();
      const existingCommentIndex = updatedComments.findIndex(comment => comment._id === payload._id);

      if (existingCommentIndex !== -1) {
        updatedComments[existingCommentIndex] = payload;
      } else {
        updatedComments.push(payload);
      }

      return {
        ...state,
        post: {
          ...state.post,
          comments: updatedComments
        },
        loading: false
      };
    }
    case GET_COMMENTS:
      return {
        ...state,
        post: {...state.post, comments: payload.comments, totalComments: payload.totalComments},
        loading: false
      };
    case COMMENT_ERROR:
      return {
        ...state,
        post: {...state.post, comments: null},
        loading: false
      };
    case REMOVE_COMMENT: {
      const updatedComments = state.post.comments.slice();
      let newComments;
      if (payload.data._id) {
        const existingCommentIndex = updatedComments.findIndex(comment => comment._id === payload.data._id);
        if (existingCommentIndex !== -1) {
          updatedComments[existingCommentIndex] = payload.data;
        }
        newComments = updatedComments;
      } else {
        newComments = updatedComments.filter(comment => comment._id !== payload.commentId);
      }
      return {
        ...state,
        post: {
          ...state.post,
          comments: newComments
        },
        loading: false
      };
    }
    default:
      return state;
  }
}

export default postReducer;
