import axios from "axios";

// Create a new interceptor with custom configurations
const services = axios.create({
  baseURL: "https://frontend-test-api.aircall.io",
});

services.interceptors.request.use(
  // Do something before request is sent
  (config) => {
    let userToken = localStorage.getItem("access_token");

    // If user is logged in, add the token in the header
    if (userToken) {
      config.headers = {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      };
    } else {
      config.headers = { "Content-Type": "application/json" };
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default services;
