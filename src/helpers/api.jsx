import axios from "axios";
import { getJwt } from "./jwt";

// const apiUrl = "http://3.11.87.189:8080/";
const apiUrl = "http://localhost:8080/";

export const apiPost = (url, data, config) => {
  let properties = {
    method: "POST",
    url: apiUrl + url,
    data: data,
  };
  for (let x in config) {
    properties[x] = config[x];
  }

  return axios({
    ...properties,
  });
};

export const apiGet = (url, config) => {
  let properties = {
    method: "GET",
    url: apiUrl + url,
  };
  for (let x in config) {
    properties[x] = config[x];
  }
  return axios({
    ...properties,
  });
};
