import axios from "axios";
import { baseURL } from "./config";

const setAxios = () => {
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
}

export default setAxios

