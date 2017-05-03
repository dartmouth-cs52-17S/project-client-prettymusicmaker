import axios from 'axios';

// keys for actiontypes
export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
};

// constants for interacting with API
const ROOT_URL = 'https://cs52-blog.herokuapp.com/api';
const API_KEY = '?key=odon_orzsik';

// fetch all the posts
export function fetchPosts() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts${API_KEY}`)
    .then((response) => {
      dispatch({ type: ActionTypes.FETCH_POSTS, payload: response.data });
      console.log(response.data);
    })
    .catch((error) => {
      console.log('error');
    });
  };
}
