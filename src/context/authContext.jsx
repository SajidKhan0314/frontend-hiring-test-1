import React, { useState } from "react";
import AuthServices from "../services/AuthServices";

/* This context API is responsible for the persistance of the logged in user data */

export const AuthContext = React.createContext({});

const getDifferenceInSeconds = (date1, date2) => {
  const diffInMs = date2 - date1;
  return diffInMs / 1000;
};

const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoginChecked, setAutoLoginChecked] = useState(false);

  // RefeshToken JWT token
  const refreshToken = (refresh_token) => {
    setError(false);
    setIsLoading(true);
    AuthServices.refreshToken(
      { refresh_token },
      (data) => {
        setUserData((oldState) => {
          return { ...oldState, ...data };
        });
      },
      (err) => {
        setError("Something went wrong while refreshing token.");
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  // Login user and save data into localstorage
  const login = ({ email, password }) => {
    setError(false);
    setIsLoading(true);
    AuthServices.login(
      { email, password },
      ({ userData, refresh_token }) => {
        setUserData(userData);
        startRefreshInterval(refresh_token);
      },
      (err) => {
        setError("Something went wrong while loging in.");
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  // Auto login user if there is any valid data in the localstorage
  const autoLogin = () => {
    const { access_token, refresh_token, userData, refreshTime } =
      AuthServices.getUserFromStorage();
    setAutoLoginChecked(true);

    if (!userData) {
      return;
    }
    setUserData({
      access_token,
      refresh_token,
      user: userData,
    });

    let timeDiff = getDifferenceInSeconds(new Date(), new Date(refreshTime));

    // If token has expired, clear the storage
    if (timeDiff < 0) {
      AuthServices.clearUserData();
      return;
    }
    // If there is some time in token expiration, then call the first refresh token after that "leftover" time
    // and then start the refresh interval
    console.log(timeDiff * 1000);
    setTimeout(() => {
      refreshToken(refresh_token).then(startRefreshInterval(refresh_token));
    }, timeDiff * 1000);
  };

  // Start an interval of 9 minutes
  const startRefreshInterval = (token) => {
    setInterval(() => {
      refreshToken(token);
    }, 9 * 60 * 1000);
  };

  return (
    <AuthContext.Provider
      value={{ userData, login, autoLogin, isLoading, error, autoLoginChecked }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
