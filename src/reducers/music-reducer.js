import { ActionTypes } from '../actions';

const MusicReducer = (state = 0, action) => {
  switch (action.type) {
    case ActionTypes.ADD_MUSIC_NOTE:
      return { test: 1 };
    default:
      return state;
  }
};

export default MusicReducer;
