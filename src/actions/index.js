import axios from 'axios';

// keys for action types
const ROOT_URL = 'https://prettymusicmaker.herokuapp.com';
// const ROOT_URL = 'http://localhost:9090';


export const ActionTypes = {
  REDUCE_ALL_TILES: 'REDUCE_ALL_TILES',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  FETCH_ALL_MUSIC: 'FETCH_ALL_MUSIC',
  FETCH_ONE_MUSIC: 'FETCH_ONE_MUSIC',
};

export const ToneTypes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4'];
export const NOTELENGTH = 320; // in ms...1000ms=1s
export const NUMROWS = 10;
export const NUMCOLS = 12;
export const NUMBASSROWS = 3;
export const DEFAULT_TILE_STATE = [
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
];
export const DEFAULT_BASS_ROW = [false, false, false, false, false, false, false, false, false, false, false, false];
export const DEFAULT_SNARE_ROW = [false, false, false, false, false, false, false, false, false, false, false, false];
export const DEFAULT_HH_ROW = [false, false, false, false, false, false, false, false, false, false, false, false];


// updates the entire tile state in redux
export function toggleTile(data) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.REDUCE_ALL_TILES, payload: data.tiles });
  };
}

// save the 2 dimensional array to the api endpoint
export function saveMusic(data, history) {
  return (dispatch) => {
    console.log('data title ');
    console.log(data.title);
    axios.post(`${ROOT_URL}/api/music/`, {
      title: data.title,
      music: data.tiles,
      tempo: data.tempo,
      bass: data.bassRow,
      snare: data.snareRow,
      hh: data.hhRow,
    }, { headers: { authorization: localStorage.getItem('token') } })
    .then((response) => {
      history.push('/profile');
    })
    .catch((error) => {
    });
  };
}

// save the 2 dimensional array to the api endpoint
export function updateMusic(id, data, history) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/api/music/${id}`, {
      title: data.title,
      music: data.tiles,
      tempo: data.tempo,
      bass: data.bassRow,
      snare: data.snareRow,
      hh: data.hhRow,
    }, { headers: { authorization: localStorage.getItem('token') } })
    .then((response) => {
      console.log('update happened');
    }).catch((error) => {
      console.log(error);
    });
  };
}

// fetch all the music
export function fetchMusic() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/api/music/`, { headers: { authorization: localStorage.getItem('token') } })
    .then((response) => {
      dispatch({ type: ActionTypes.FETCH_ALL_MUSIC, payload: response.data });
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  };
}

export function fetchOneMusic(musicID) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/api/music/${musicID}`)
    .then((response) => {
      console.log('in fetchOneMusic');
      console.log(response.data);
      dispatch({ type: ActionTypes.FETCH_ONE_MUSIC, payload: response.data });
    })
    .catch((error) => {
      console.log(error);
    });
  };
}

// delete the song
export function deleteMusic(musicID, history) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/api/music/${musicID}`, { headers: { authorization: localStorage.getItem('token') } })
    .then((response) => {
      console.log(response);
      fetchMusic()(dispatch);
    })
    .catch((error) => {
      console.log('failed to delete');
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
      localStorage.setItem('email', response.data.email);

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
      localStorage.setItem('email', response.data.email);

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
