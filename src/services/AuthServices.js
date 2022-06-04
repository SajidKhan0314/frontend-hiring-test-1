import axios from "../config/axios";

const getNewRefreshTIme = () => {
  return new Date().setTime(new Date().getTime() + 9 * 60 * 1000);
};

const clearStorage = () => {
  localStorage.removeItem("refresh_time");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("userData");
};

/* This object provides all the api services required to authenticate user */
const AuthServices = {
  refreshToken: ({ refresh_token }, success, error, final) => {
    axios
      .post("/auth/refresh-token", { refresh_token })
      .then((res) => {
        localStorage.setItem("refresh_time", getNewRefreshTIme());
        localStorage.setItem("access_token", res.data.access_token);
        success(res.data);
      })
      .catch((err) => {
        error(err);
        clearStorage();
      })
      .finally(() => {
        final();
      });
  },
  login: ({ email: username, password }, success, error, final) => {
    axios
      .post("/auth/login", { username, password })
      .then((res) => {
        localStorage.setItem("refresh_time", getNewRefreshTIme());
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        localStorage.setItem("userData", JSON.stringify(res.data.user));
        let data = {
          userData: res.data,
          refresh_token: res.data.refresh_token,
        };
        success(data);
      })
      .catch((err) => {
        error(err);
        clearStorage();
      })
      .finally(() => {
        final();
      });
  },
  getUserFromStorage: () => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const refreshTime = +localStorage.getItem("refresh_time");
    return { access_token, refresh_token, userData, refreshTime };
  },
  clearUserData: () => {
    clearStorage();
  },
};

export default AuthServices;
