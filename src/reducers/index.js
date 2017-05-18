import { combineReducers } from 'redux';
import MusicReducer from './music-reducer';
import AuthReducer from './auth-reducer';

const rootReducer = combineReducers({
  music: MusicReducer,
  auth: AuthReducer,
});

export default rootReducer;
