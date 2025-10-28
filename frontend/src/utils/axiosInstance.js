// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // change when deploying
  withCredentials: true,
});

export default axiosInstance;
