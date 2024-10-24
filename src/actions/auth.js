import axios from 'axios';
import { setAlert } from './alert';
import { USER_LOADED, LOGIN_SUCCESS, LOGOUT, AUTH_ERROR, FORGET_PASSWORD, RECOVERY_PASSWORD, CHANGE_PROFILE } from "./types";

export const loadUser = () => async dispatch => {
  try {
    const res = await axios.get('/auth/current-user');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    var errMessage = "";
    if (err.message != null)
      errMessage = err.message;
    if (err.response != null && err.response.data != null && err.response.data.message != null)
      errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, 'danger'));
    dispatch({
      type: AUTH_ERROR
    })
  }
}

// export const login = ({ email, password }) => async dispatch => {
//   try {
//     const body = { email, password };
//     const res = await axios.post('/auth/login', body);
//     dispatch({
//       type: LOGIN_SUCCESS,
//       payload: res.data
//     });
//     dispatch(loadUser());
//   } catch (err) {
//     var errMessage = "";
//     if (err.message != null)
//       errMessage = err.message;
//     if (err.response != null && err.response.data != null && err.response.data.message != null)
//       errMessage = err.response.data.message;
//     dispatch(setAlert(errMessage, 'danger'));
//     dispatch({
//       type: AUTH_ERROR
//     })
//   }
// }


export const login = ({ email, password }) => async dispatch => {
  try {
    const body = { email, password };
    const res = await axios.post('/auth/login', body);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    let errMessage = "Terjadi kesalahan. Silakan coba lagi.";

    if (err.response != null && err.response.data != null && err.response.data.message != null) {
      if (err.response.data.message.includes("Email or password is incorrect")) {
        errMessage = "Maaf Email atau Password yang anda masukkan masih salah";
      } else {
        errMessage = err.response.data.message;
      }
    }
    dispatch(setAlert(errMessage, 'danger'));

    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const logout = ({ email }) => async dispatch => {
  try {
    const body = { email };
    await axios.post('/auth/logout', body);
    dispatch({ type: LOGOUT });
    return Promise.resolve();
  } catch (err) {
    var errMessage = "";
    if (err.message != null)
      errMessage = err.message;
    if (err.response != null && err.response.data != null && err.response.data.message != null)
      errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
}

export const forgetPassword = ({ email }) => async dispatch => {
  try {
    const body = { email };
    const res = await axios.post('/auth/forget-password', body);
    dispatch({
      type: FORGET_PASSWORD,
      payload: res.data
    });
    return Promise.resolve();
  } catch (err) {
    var errMessage = "";
    if (err.message != null)
      errMessage = err.message;
    if (err.response != null && err.response.data != null && err.response.data.message != null)
      errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
}

export const recoveryPassword = ({ body }) => async dispatch => {
  try {
    const res = await axios.post('/auth/recovery-password', body);
    dispatch({
      type: RECOVERY_PASSWORD,
      payload: res.data
    });
    return Promise.resolve();
  } catch (err) {
    var errMessage = "";
    if (err.message != null)
      errMessage = err.message;
    if (err.response != null && err.response.data != null && err.response.data.message != null)
      errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
}

export const changeProfile = ({ body }) => async dispatch => {
  try {
    const res = await axios.post('/auth/change-profile', body);
    dispatch({
      type: CHANGE_PROFILE,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    var errMessage = "";
    if (err.message != null)
      errMessage = err.message;
    if (err.response != null && err.response.data != null && err.response.data.message != null)
      errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
}



