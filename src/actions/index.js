import axios from 'axios';

// keys for action types
// const ROOT_URL = 'https://prettymusicmaker.herokuapp.com';
const ROOT_URL = 'http://localhost:9090';


export const ActionTypes = {
  ADD_MUSIC_TILE: 'ADD_MUSIC_TILE',
  REDUCE_ALL_TILES: 'REDUCE_ALL_TILES',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
};

export const ToneTypes = ['C4', 'E4'];
export const NOTELENGTH = 800; // in ms...1000ms=1s
export const NUMROWS = 2;
export const NUMCOLS = 2;

 // dispatch action with a column id, and the clicked note array
export function addTile(data) {
  return (dispatch) => {
    const fields = { title: 'title', tags: 'tags', content: 'data', cover_url: 'cover' };
    axios.post(`${ROOT_URL}/api/music`, fields).then((response) => {
      // do something with response.data  (some json)
      console.log('b4 add musictile');

      dispatch({ type: ActionTypes.ADD_MUSIC_TILE });
      console.log('success');
      console.log(response);
    }).catch((error) => {
      console.log('caught error in addTile:');
      console.log(error);
      // hit an error do something else!
    });
  };
}

// updates the entire tile state in redux
export function toggleTile(data) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.REDUCE_ALL_TILES, payload: data.tiles });
  };
}


// =============================================================================
//                               LAB5 PART2 - AUTH
// =============================================================================

// trigger to deauth if there is error
// can also use in your error reducer if you have one to display an error message
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}


export function signinUser({ email, password }, history) {
  // takes in an object with email and password (minimal user object)
  // returns a thunk method that takes dispatch as an argument (just like our create post method really)
  // does an axios.post on the /signin endpoint
  // on success does:
  //  dispatch({ type: ActionTypes.AUTH_USER });
  //  localStorage.setItem('token', response.data.token);
  // on error should dispatch(authError(`Sign In Failed: ${error.response.data}`));

  return (dispatch) => {
    axios.post(`${ROOT_URL}/api/signin`, { email, password })
    .then((response) => {
      console.log(`token: ${response.data.token}`);
      console.log(response.data);

      dispatch({ type: ActionTypes.AUTH_USER });
      localStorage.setItem('token', response.data.token);
      history.push('/profile');
    })
    .catch((error) => {
      dispatch(authError(`Sign In Failed: ${error.response.data}`));
    });
  };
}


export function signupUser({ email, password, username }, history) {
  // takes in an object with email and password (minimal user object)
  // returns a thunk method that takes dispatch as an argument (just like our create post method really)
  // does an axios.post on the /signup endpoint (only difference from above)
  // on success does:
  //  dispatch({ type: ActionTypes.AUTH_USER });
  //  localStorage.setItem('token', response.data.token);
  // on error should dispatch(authError(`Sign Up Failed: ${error.response.data}`));

  return (dispatch) => {
    axios.post(`${ROOT_URL}/api/signup`, { email, password, username })
    .then((response) => {
      console.log(`token: ${response.data.token}`);
      console.log(response.data);

      dispatch({ type: ActionTypes.AUTH_USER });
      localStorage.setItem('token', response.data.token);
      history.push('/profile');
    })
    .catch((error) => {
      console.log(error);
      dispatch(authError(`Sign Up Failed: ${error.response.data}`));
    });
  };
}


// deletes token from localstorage
// and deauths
export function signoutUser(history) {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: ActionTypes.DEAUTH_USER });
    if (history) { history.push('/'); }
  };
}
