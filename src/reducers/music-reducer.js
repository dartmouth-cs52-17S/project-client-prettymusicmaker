import { ActionTypes, DEFAULT_TILE_STATE } from '../actions';

const MusicReducer = (state = DEFAULT_TILE_STATE, action) => {
  switch (action.type) {
    case ActionTypes.REDUCE_ALL_TILES:
      return { tiles: action.payload };
    case ActionTypes.FETCH_ALL_MUSIC:
      return { allMusic: action.payload };
    case ActionTypes.FETCH_ONE_MUSIC:
      return { oneMusic: action.payload };
    default:
      return state;
  }
};

export default MusicReducer;
