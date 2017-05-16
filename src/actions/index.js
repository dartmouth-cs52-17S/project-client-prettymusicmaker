import axios from 'axios';

// keys for action types
const ROOT_URL = 'https://prettymusicmaker.herokuapp.com';


export const ActionTypes = {
  ADD_MUSIC_TILE: 'ADD_MUSIC_TILE',
  REDUCE_ALL_TILES: 'REDUCE_ALL_TILES',
};

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
