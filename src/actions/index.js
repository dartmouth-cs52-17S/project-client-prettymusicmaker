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

// create a new post
export function createNewPost(userData, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/posts${API_KEY}`, {
      title: userData.title,
      content: userData.content,
      tags: userData.tags,
      cover_url: userData.cover_url,
    })
    .then((response) => {
      // take the person to the main page
      history.push('/');
    })
    .catch((error) => {
      // take the person to the main page
      history.push('/');
    });
  };
}

// delete a specific post
export function deletePost(userID, history) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/posts/${userID}${API_KEY}`)
    .then((response) => {
      // take the person to the main page
      history.push('/');
    })
    .catch((error) => {
      // take the person to the main page
      history.push('/');
    });
  };
}
