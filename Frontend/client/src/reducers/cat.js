import {
  GET_CAT,
  GET_CATS,
  GET_MYCATS,
  UPDATE_CAT,
  CAT_ERROR,
  CLEAR_CAT,
  UPDATE_CAT_AVATAR
} from '../actions/types';

const initialState = {
  cat: null,
  cats: [],
  mycats: [],
  loading: true,
  error: {}
};

function catReducer(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case GET_CAT:
    case UPDATE_CAT:
      return {
        ...state,
        cat: payload,
        loading: false,
        error: {}
      };
    case GET_CATS:
      return {
        ...state,
        cats: payload,
        loading: false,
        error: {}
      };
    case CAT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        cat: null
      };
    case CLEAR_CAT:
      return {
        ...state,
        cat: null,
        error: {},
      };
    case UPDATE_CAT_AVATAR:
      return {
        ...state,
        mycats: state.mycats.map((cat) =>
          cat._id === payload.catId ? {...cat, avatar: payload.avatar.url} : cat
        ),
        loading: false,
        error: {}
      };
    case GET_MYCATS:
      return {
        ...state,
        mycats: payload,
        loading: false,
        error: {}
      };
    default:
      return state;
  }
}

export default catReducer;
