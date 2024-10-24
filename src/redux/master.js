import { LOAD_MODULE, LOAD_ROLE, LOAD_USER, SYNC_DATE, LOAD_POSITION, LOAD_COMPANY, LOAD_DIVISION, LOAD_SHIFT, LOAD_ATTENDANCE, LOAD_CALENDAR } from "../actions/types";

const initialState = {
  user: null,
  role: null,
  module: null,
  sync: null,

  position: null,
  company: null,
  division: null,
  shift: null,
  attendance: null,
  calendar: null
};

export default function master(state = initialState, action) {
  const { type, payload } = action;

  // console.log(payload);
  switch (type) {
    case LOAD_USER:
      return { ...state, user: payload.data };
    case LOAD_ROLE:
      return { ...state, role: payload.data };
    case LOAD_MODULE:
      return { ...state, module: payload.data };
    case LOAD_POSITION:
      return { ...state, position: payload.data };
    case LOAD_COMPANY:
      return { ...state, company: payload.data };
    case LOAD_DIVISION:
      return { ...state, division: payload.data };
    case LOAD_SHIFT:
      return { ...state, shift: payload.data };
    case LOAD_ATTENDANCE:
      return { ...state, attendance: payload.data };
    case LOAD_CALENDAR:
      return { ...state, calendar: payload.data };
    case SYNC_DATE:
      return { ...state, sync: payload.data.length > 0 ? payload.data[0] : null };
    default:
      return state;
  }
}
