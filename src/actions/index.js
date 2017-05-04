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
export function deletePost(postID, history) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/posts/${postID}${API_KEY}`)
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

// fetch one post
export function fetchPost(postID, data) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts/${postID}${API_KEY}`)
    .then((response) => {
      dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
    })
    .catch((error) => {
      console.log('error');
    });
  };
}

// fetch one post
export function updatePost(postData, postID) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/posts/${postID}${API_KEY}`, {
      title: postData.title,
      content: postData.content,
      tags: postData.tags,
      cover_url: postData.cover_url,
    })
    .then((response) => {
      // update the value
      dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
    })
    .catch((error) => {
      console.log(error);
    });
  };
}
