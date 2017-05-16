import { combineReducers } from 'redux';
import MusicReducer from './music-reducer';

const rootReducer = combineReducers({
  music: MusicReducer,
});

export default rootReducer;
