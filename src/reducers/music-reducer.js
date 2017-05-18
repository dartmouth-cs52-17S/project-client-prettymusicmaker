import { ActionTypes, DEFAULT_TILE_STATE } from '../actions';

const MusicReducer = (state = DEFAULT_TILE_STATE, action) => {
  switch (action.type) {
    case ActionTypes.ADD_MUSIC_TILE:
      return { test: 1 };
    case ActionTypes.REDUCE_ALL_TILES:
      return { tiles: action.payload };
    default:
      return state;
  }
};

export default MusicReducer;
