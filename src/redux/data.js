import { LOAD_DATA, REFRESH_DATA, ADD_DATA, EDIT_DATA, EXPORT_DATA, LOAD_DATAUSER, LOAD_DATADAILYTASK, LOAD_DATACOMPANY, LOAD_DATADIVISI, LOAD_DATAPOSISI, LOAD_DATAKALENDAR, LOAD_DATASHIFT, LOAD_DATAWIFI, LOAD_DATAROLE, LOAD_DATAATTENDANCE, LOAD_DATALEAVE, LOAD_DATAMODULE } from "../actions/types";

const initialState = {
  list: null,
  data: null,
  export: null,
  module: "",
  total: 0,
  page: 0,
  loading: true,
};

export default function data(state = initialState, action) {
  const { type, payload, module } = action;

  switch (type) {
    case REFRESH_DATA:
      return {
        ...state,
        list: payload.data,
        total: payload.total,
        data: null,
        page: payload.page,
        module: module,
        loading: false,
      };
    case EXPORT_DATA:
      return {
        ...state,
        export: payload.data,
        module: module,
        loading: false,
      };
    case LOAD_DATA:
    case LOAD_DATAUSER:
    case LOAD_DATADAILYTASK:
    case LOAD_DATACOMPANY:
    case LOAD_DATADIVISI:
    case LOAD_DATAPOSISI:
    case LOAD_DATAKALENDAR:
    case LOAD_DATASHIFT:
    case LOAD_DATAWIFI:
    case LOAD_DATAROLE:
    case LOAD_DATAATTENDANCE:
    case LOAD_DATALEAVE:
    case LOAD_DATAMODULE:
    case ADD_DATA:
    case EDIT_DATA:
      return {
        ...state,
        data: payload.data,
        module: module,
        loading: false,
      };
    default:
      return state;
  }
}
