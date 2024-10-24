import axios from "axios";
import qs from "qs";
import moment from "moment/moment";
import { setAlert } from "./alert";
import { ADD_DATA, DELETE_DATA, DELETE_DATAATTENDANCE, DELETE_DATADAILYTASK, DELETE_DATADIVISI, DELETE_DATAKALENDAR, DELETE_DATALEAVE, DELETE_DATAMODULE, DELETE_DATAPOSISI, DELETE_DATAROLE, DELETE_DATASHIFT, DELETE_DATAUSER, DELETE_DATAWIFI, EDIT_DATA, LOAD_DATA, LOAD_DATAATTENDANCE, LOAD_DATACOMPANY, LOAD_DATADAILYTASK, LOAD_DATADIVISI, LOAD_DATAKALENDAR, LOAD_DATALEAVE, LOAD_DATAMODULE, LOAD_DATAPOSISI, LOAD_DATAROLE, LOAD_DATASHIFT, LOAD_DATAUSER, LOAD_DATAWIFI, REFRESH_DATA, UPLOAD_DATA } from "./types";

// Refresh Data
export const refreshData = ({ url, page = 0, limit = 10, search = "", sort = "", filterSearch = {}, rangeDate = {} }) => async (dispatch) => {
  try {
    var filter = qs.stringify(filterSearch);
    filter = filter.replaceAll("&", "|");
    filter = filter.replaceAll("=", ":");

    var date = "";
    if (rangeDate[0] !== undefined) {
      var range = { startDate: moment(rangeDate[0].startDate).format("YYYY-MM-DD"), endDate: moment(rangeDate[0].endDate).format("YYYY-MM-DD") };
      date = qs.stringify(range);
      date = date.replaceAll("&", "|");
      date = date.replaceAll("=", ":");
    }
    // console.log(`/${url}?page=${page}&limit=${limit}&search=${search}&sort=${sort}&filter=${filter}&date=${date}`);
    const res = await axios.get(`/${url}?page=${page}&limit=${limit}&search=${search}&sort=${sort}&filter=${filter}&date=${date}`);
    dispatch({
      type: REFRESH_DATA,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const exportData = ({ url, search = "", sort = "", filterSearch = {} }) => async (dispatch) => {
  try {
    var filter = qs.stringify(filterSearch);
    filter = filter.replaceAll("&", "|");
    filter = filter.replaceAll("=", ":");
    const res = await axios.get(`/${url}?page=0&limit=0&search=${search}&sort=${sort}&filter=${filter}`);
    return Promise.resolve(res.data.data);
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

// Load Data
export const loadDataCompany = ({ url, companyID }) => async (dispatch) => {
  try {
    const res = await axios.get(`/${url}/${companyID}`);

    dispatch({
      type: LOAD_DATACOMPANY,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataDivisi = ({ url, divisionID }) => async (dispatch) => {
  try {

    const res = await axios.get(`/${url}/${divisionID}`);

    dispatch({
      type: LOAD_DATADIVISI,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataPosisi = ({ url, positionID }) => async (dispatch) => {
  try {

    const res = await axios.get(`/${url}/${positionID}`);

    dispatch({
      type: LOAD_DATAPOSISI,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};


export const loadDataKalendar = ({ url, calendarID }) => async (dispatch) => {
  try {

    const res = await axios.get(`/${url}/${calendarID}`);

    dispatch({
      type: LOAD_DATAKALENDAR,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataShift = ({ url, shiftID }) => async (dispatch) => {
  try {

    const res = await axios.get(`/${url}/${shiftID}`);

    dispatch({
      type: LOAD_DATASHIFT,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataWifi = ({ url, locationID }) => async (dispatch) => {
  try {

    const res = await axios.get(`/${url}/${locationID}`);

    dispatch({
      type: LOAD_DATAWIFI,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataUser = ({ url, userID }) => async (dispatch) => {
  try {

    const res = await axios.get(`/${url}/${userID}`);

    dispatch({
      type: LOAD_DATAUSER,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataDailyTask = ({ url, dailyTaskID }) => async (dispatch) => {
  try {
    const res = await axios.get(`/${url}/${dailyTaskID}`);
    dispatch({
      type: LOAD_DATADAILYTASK,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadData = ({ url, id }) => async (dispatch) => {
  try {
    const res = await axios.get(`/${url}/${id}`);
    dispatch({
      type: LOAD_DATA,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataRole = ({ url, roleID }) => async (dispatch) => {
  try {
    const res = await axios.get(`/${url}/${roleID}`);
    dispatch({
      type: LOAD_DATAROLE,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataAttendance = ({ url, attendanceID }) => async (dispatch) => {
  try {
    const res = await axios.get(`/${url}/${attendanceID}`);
    dispatch({
      type: LOAD_DATAATTENDANCE,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataLeave = ({ url, leaveID }) => async (dispatch) => {
  try {
    const res = await axios.get(`/${url}/${leaveID}`);
    dispatch({
      type: LOAD_DATALEAVE,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};

export const loadDataModule = ({ url, moduleID }) => async (dispatch) => {
  try {
    const res = await axios.get(`/${url}/${moduleID}`);
    dispatch({
      type: LOAD_DATAMODULE,
      payload: res.data,
      module: url,
    });
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
  }
};


// Add Data
export const addData = ({ url, body }) => async (dispatch) => {
  try {
    // console.log(body);
    const res = await axios.post(`/${url}`, body);
    dispatch({
      type: ADD_DATA,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Menambah Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

// Edit Data
export const editData = ({ url, body }) => async (dispatch) => {
  try {
    const res = await axios.put(`/${url}`, body);
    dispatch({
      type: EDIT_DATA,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Perbarui Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

// Delete Data
export const deleteData = ({ url, id }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${id}`);
    dispatch({
      type: DELETE_DATA,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

export const deleteDataDailyTask = ({ url, dailyTaskID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${dailyTaskID}`);
    dispatch({
      type: DELETE_DATADAILYTASK,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

export const deleteDataDailyUser = ({ url, userID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${userID}`);
    dispatch({
      type: DELETE_DATAUSER,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

export const deleteDataRole = ({ url, roleID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${roleID}`);
    dispatch({
      type: DELETE_DATAROLE,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

export const deleteDataAttendance = ({ url, attendanceID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${attendanceID}`);
    dispatch({
      type: DELETE_DATAATTENDANCE,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};


export const deleteDataDivisi = ({ url, divisionID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${divisionID}`);
    dispatch({
      type: DELETE_DATADIVISI,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

export const deleteDataPosisi = ({ url, positionID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${positionID}`);
    dispatch({
      type: DELETE_DATAPOSISI,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

export const deleteDataKalendar = ({ url, calendarID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${calendarID}`);
    dispatch({
      type: DELETE_DATAKALENDAR,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

export const deleteDataShift = ({ url, shiftID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${shiftID}`);
    dispatch({
      type: DELETE_DATASHIFT,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};


export const deleteDataWifi = ({ url, locationID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${locationID}`);
    dispatch({
      type: DELETE_DATAWIFI,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};



export const deleteDataLeave = ({ url, leaveID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${leaveID}`);
    dispatch({
      type: DELETE_DATALEAVE,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

export const deleteDataModule = ({ url, moduleID }) => async (dispatch) => {
  try {
    const res = await axios.delete(`/${url}/${moduleID}`);
    dispatch({
      type: DELETE_DATAMODULE,
      payload: res.data,
      module: url,
    });
    dispatch(setAlert("Berhasil Hapus Data", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};

// Upload File
export const uploadFile = ({ url, body }) => async (dispatch) => {
  try {
    dispatch(setAlert("Uploading", "warning"));

    const res = await axios.post(`/${url}/upload-file`, body);
    dispatch({
      type: UPLOAD_DATA,
      payload: res.data,
    });
    dispatch(refreshData({ url }));
    dispatch(setAlert("Data Uploaded", "success"));
    return Promise.resolve();
  } catch (err) {
    let errMessage = "";
    if (err.message) errMessage = err.message;
    if (err.response && err.response.data && err.response.data.message) errMessage = err.response.data.message;
    dispatch(setAlert(errMessage, "danger"));
    return Promise.reject(errMessage);
  }
};
