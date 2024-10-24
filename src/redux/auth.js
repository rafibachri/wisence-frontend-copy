import { USER_LOADED, LOGIN_SUCCESS, LOGOUT, AUTH_ERROR } from "../actions/types";
import setToken from '../utility/setToken';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  roles: null,
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload.data,
        roles: payload.roles,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      setToken(payload.token);
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem("token");
      setToken(null);
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}