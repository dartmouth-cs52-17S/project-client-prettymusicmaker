import axios from 'axios';

// keys for actiontypes
export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
};

// constants for interacting with API
// const ROOT_URL = 'https://cs52-server-orzsik.herokuapp.com/api';
const ROOT_URL = 'http://localhost:9090/api';
const API_KEY = '';

export function signupUser(userData, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signup${API_KEY}`, {
      email: userData.email,
      password: userData.password,
    })
    .then((response) => {
      dispatch({ type: ActionTypes.AUTH_USER });
      // set the token in local storage
      localStorage.setItem('token', response.data.token);
      history.push('/');
    })
    .catch((error) => {
      dispatch({ type: ActionTypes.AUTH_ERROR });
      console.log(error);
      // take the person to the main page
      history.push('/');
    });
  };
}

export function signinUser(userData, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signin${API_KEY}`, {
      email: userData.email,
      password: userData.password,
    })
    .then((response) => {
      dispatch({ type: ActionTypes.AUTH_USER });
      // set the token in local storage
      localStorage.setItem('token', response.data.token);
      history.push('/');
    })
    .catch((error) => {
      dispatch({ type: ActionTypes.AUTH_ERROR });
      console.log(error);
      // take the person to the main page
      history.push('/');
    });
  };
}


// deletes token from localstorage
// and deauths
export function signoutUser(history) {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    history.push('/');
  };
}

// trigger to deauth if there is error
// can also use in your error reducer if you have one to display an error message
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

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
    }, { headers: { authorization: localStorage.getItem('token') } })
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
    axios.delete(`${ROOT_URL}/posts/${postID}${API_KEY}`, { headers: { authorization: localStorage.getItem('token') } })
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
    }, { headers: { authorization: localStorage.getItem('token') } })
    .then((response) => {
      // update the value
      dispatch({ type: ActionTypes.FETCH_POST, payload: response.data });
    })
    .catch((error) => {
      console.log(error);
    });
  };
}
