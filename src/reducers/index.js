import { combineReducers } from 'redux';
import MusicReducer from './music-reducer';

const rootReducer = combineReducers({
  musicColumns: MusicReducer,
});

export default rootReducer;
