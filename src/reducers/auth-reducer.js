import { ActionTypes } from '../actions';

const AuthReducer = (state = { authenticated: false }, action) => {
  switch (action.type) {

    case ActionTypes.AUTH_ERROR:
      return { authenticated: false };

    case ActionTypes.AUTH_USER:
      return { authenticated: true };

    case ActionTypes.DEAUTH_USER:
      return { authenticated: false };

    default:
      return state;
  }
};

export default AuthReducer;
