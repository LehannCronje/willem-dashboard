import axios from "axios";
import { getJwt } from "./jwt";

export const apiPost = (url, data, config) => {
  let properties = {
    method: "POST",
    url: "http://3.11.87.189:8080/" + url,
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
    url: "http://3.11.87.189:8080/" + url,
  };
  for (let x in config) {
    properties[x] = config[x];
  }
  return axios({
    ...properties,
  });
};
