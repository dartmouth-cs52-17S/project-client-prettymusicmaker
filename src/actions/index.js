import axios from 'axios';

// keys for action types
const ROOT_URL = 'https://prettymusicmaker.herokuapp.com';
// const ROOT_URL = 'http://localhost:9090';


export const ActionTypes = {
  ADD_MUSIC_TILE: 'ADD_MUSIC_TILE',
  REDUCE_ALL_TILES: 'REDUCE_ALL_TILES',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
};

export const ToneTypes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4'];
export const NOTELENGTH = 500; // in ms...1000ms=1s
export const NUMROWS = 10;
export const NUMCOLS = 8;
export const DEFAULT_TILE_STATE = [
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
];

// updates the entire tile state in redux
export function toggleTile(data) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.REDUCE_ALL_TILES, payload: data.tiles });
  };
}

export function flattenArray(array) {
  const flatArray = [];
  for (let col = 0; col < NUMCOLS; col += 1) {
    for (let row = 0; row < NUMROWS; row += 1) {
      flatArray.push(array[col][row]);
    }
  }
  return flatArray;
}

export function unFlattenArray(flatArray) {
  const array = [];
  for (let col = 0; col < NUMCOLS; col += 1) {
    const tmpRow = [];
    for (let row = 0; row < NUMROWS; row += 1) {
      tmpRow.push(flatArray[NUMROWS * col + row]); //eslint-disable-line
    }
    array.push(tmpRow);
  }
  return array;
}

// save the 2 dimensional array to the api endpoint
export function saveMusic(data, history) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/api/music/`, {
      title: 'My Song II',
      author: 'Eddy Orzsik',
      music: flattenArray(data.tiles),
      tempo: data.tempo,
    }, { headers: { authorization: localStorage.getItem('token') } })
    .then((response) => {
      // main page
      // history.push('/');
    })
    .catch((error) => {
      // main page
      // history.push('/');
    });
  };
}

// save the 2 dimensional array to the api endpoint
export function updateMusic(data) {
  console.log(data.tiles);
  return (dispatch) => {
    const id = data.id;
    console.log(id);
    axios.put(`${ROOT_URL}/api/music/${id}`, {
      title: 'Updated song title',
      author: 'Eddy Orzsik',
      music: flattenArray(data.tiles),
      tempo: data.tempo,
    }, { headers: { authorization: localStorage.getItem('token') } })
    .then((response) => {
    }).catch((error) => {
      console.log(error);
    });
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
