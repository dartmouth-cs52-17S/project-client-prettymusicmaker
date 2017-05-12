import { ActionTypes } from '../actions';


const PostsReducer = (state = { all: [], post: null }, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_POSTS:
      return { ...state, all: action.payload.posts };
    case ActionTypes.FETCH_POST:
      return { ...state, post: action.payload.post };
    case ActionTypes.DELETE_POST:
      return { ...state, all: action.payload.posts };
    default:
      return 'post reducer returning null';
  }
};

export default PostsReducer;
