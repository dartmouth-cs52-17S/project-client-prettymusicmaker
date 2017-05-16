import { ActionTypes } from '../actions';

const MusicReducer = (state = [false, false, false], action) => {
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
