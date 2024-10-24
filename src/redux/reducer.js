import { combineReducers } from "@reduxjs/toolkit";
import alert from './alert';
import auth from './auth';
import data from './data';
import master from './master';
// import dashboard from './dashboard';

export default combineReducers({
  alert,
  auth,
  data,
  master,
  // dashboard,
})
