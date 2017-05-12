import axios from 'axios';

// const ROOT_URL = 'https://cs52-blog.herokuapp.com/api';
// const ROOT_URL = 'http://localhost:9090/api';
const ROOT_URL = 'https://lab5-dylansc.herokuapp.com/api';
const API_KEY = ''; // ?key=yourfirstname_yourlastname


// keys for actiontypes
export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
  CREATE_POST: 'CREATE_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
};


export function fetchPosts() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts${API_KEY}`).then((response) => {
      // do something with response.data  (some json)
      dispatch({ type: 'FETCH_POSTS', payload: { posts: response.data } });
    }).catch((error) => {
      console.log('caught error in fetchPosts');
      // hit an error do something else!
    });
  };
}

export function fetchPost(postId) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts/${postId}${API_KEY}`).then((response) => {
      // do something with response.data  (some json)
      dispatch({ type: 'FETCH_POST', payload: { post: response.data } });
    }).catch((error) => {
      console.log('caught error in fetchPost');
      // hit an error do something else!
    });
  };
}

export function createPost(post, history) {
  return (dispatch) => {
    const fields = { title: post.title, content: post.content, tags: post.tags, cover_url: post.cover_url };
    axios.post(`${ROOT_URL}/posts${API_KEY}`, fields).then((response) => {
      // do something with response.data  (some json)
      // dispatch({ type: 'CREATE_POST', payload: [] });
      history.push('/');
    }).catch((error) => {
      console.log('caught error in createPost');
      // hit an error do something else!
    });
  };
}

export function updatePost(post) {
  return (dispatch) => {
    const fields = { title: post.title, content: post.content, tags: post.tags, cover_url: post.cover_url };
    axios.put(`${ROOT_URL}/posts/${post.id}${API_KEY}`, fields).then((response) => {
      // do something with response.data  (some json)
      // dispatch({ type: 'UPDATE_POST', payload: { post: response.data } });
    }).catch((error) => {
      console.log('caught error in fetchPost');
      // hit an error do something else!
    });
  };
}


export function deletePost(postId, history) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/posts/${postId}${API_KEY}`).then((response) => {
      // do something with response.data  (some json)
      console.log('IRENE');
      // dispatch({ type: 'DELETE_POST', payload: { posts: response.data } });
      history.push('/');
    }).catch((error) => {
      console.log('caught error in deletePost');
      // hit an error do something else!
    });
  };
}
