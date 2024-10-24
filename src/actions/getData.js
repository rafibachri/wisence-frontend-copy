import axios from "axios";
import qs from "qs";
import { setAlert } from "./alert";
import {
  ATTENDANCE_WORKINGHOUR,
  SYNC_DATE, ATTENDANCE_HOUR, LOAD_POSITION, LOAD_COMPANY, LOAD_DIVISION,
  LOAD_SHIFT,
  LOAD_ATTENDANCE,
  LOAD_CALENDAR
} from "./types";


// Get Sync
export const getSync = () => async (dispatch) => {
  try {
    const res = await axios.get(`/setting?filter=code:sync`);
    dispatch({
      type: SYNC_DATE,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
  }
};


// Sync Now
export const syncNow = () => async (dispatch) => {
  try {
    const res = await axios.get(`/helper/sync`);
    return Promise.resolve(res.data);
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
    // return Promise.reject(errMessage);
  }
};

export const setAttendanceWorkingHour = ({ id, dateIn, isDeleted, start, end }) => async (dispatch) => {
  try {
    const body = { id, dateIn, isDeleted, start, end };
    const res = await axios.post(`/attendance/setWorkingHour`, body);

    dispatch({
      type: ATTENDANCE_WORKINGHOUR,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadWorkingHour = () => async (dispatch) => {
  try {
    const res = await axios.get(`/Attendance/WorkingHour`);
    dispatch({
      type: ATTENDANCE_HOUR,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
  }
};


export const loadPosition = () => async (dispatch) => {
  try {
    const res = await axios.get(`/position`);

    dispatch({
      type: LOAD_POSITION,
      payload: res.data,
    });
  }
  catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // console.log("err mess", err.response.data.message)
    // dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDivision = () => async (dispatch) => {
  try {
    const res = await axios.get(`/division`);

    dispatch({
      type: LOAD_DIVISION,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
  }
};


export const loadCompany = () => async (dispatch) => {
  try {
    const res = await axios.get(`/company`);
    dispatch({
      type: LOAD_COMPANY,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadShift = () => async (dispatch) => {
  try {
    const res = await axios.get(`/shift`);
    dispatch({
      type: LOAD_SHIFT,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadAttendance = () => async (dispatch) => {
  try {
    const res = await axios.get(`/attendance`);
    dispatch({
      type: LOAD_ATTENDANCE,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadCalendar = () => async (dispatch) => {
  try {
    const res = await axios.get(`/calendar`);
    dispatch({
      type: LOAD_CALENDAR,
      payload: res.data,
    });
  } catch (err) {
    console.error(err);
    // let errMessage = "";
    // if (err.message) errMessage = err.message;
    // if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    // dispatch(setAlert(errMessage, "danger"));
  }
};


