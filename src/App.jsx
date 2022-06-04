import CallLog from "./components/CallLog/CallLog";
import LoginForm from "./components/LoginForm/LoginForm";
import { AuthContext } from "./context/authContext";
import classes from "./App.module.scss";
import { Fragment, useContext } from "react";
import useEffectOnce from "./hooks/useEffectOnce";
import Loader from "./components/UI/Loader/Loader";

function App() {
  const { autoLogin, autoLoginChecked, userData } = useContext(AuthContext);

  useEffectOnce(() => {
    autoLogin();
  });

  let displayEl = null;

  if (autoLoginChecked) {
    displayEl = (
      <Fragment>
        {/* Show Login form if not authenticated */}
        {!userData && (
          <div className={classes.App}>
            <LoginForm />
          </div>
        )}
        {/* Show call log if  authenticated */}
        {userData && <CallLog />}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {/* Show modal until the localsotorage is checked */}
      <Loader show={!autoLoginChecked} />
      {displayEl}
    </Fragment>
  );
}

export default App;
