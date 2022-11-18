import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

const KEY = "biblioteca-app";

export const axiosWithoutToken = (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;
  return axios({ method, url, data });
};

export const axiosWithToken = (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;
  const token = JSON.parse(localStorage.getItem(KEY)).token || "";
  return axios({
    method,
    url,
    data,
    headers: { "Content-Type": "application/json", "x-token": token },
  });
};
