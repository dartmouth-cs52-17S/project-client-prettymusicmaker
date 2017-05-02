import { ActionTypes } from '../actions';

const PostsReducer = (state = 0, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_POSTS:
      return { all: action.payload };
    case ActionTypes.FETCH_POST:
      return Object.assign({}, state, { post: action.payload });
    default:
      return state;
  }
};

export default PostsReducer;
