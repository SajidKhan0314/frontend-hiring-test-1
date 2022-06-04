import { Fragment, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import FormInput from "../UI/FormInput/FormInput";
import Loader from "../UI/Loader/Loader";
import classes from "./LoginForm.module.scss";

/* This is the user login form */

const LoginForm = () => {
  const { isLoading, error, login } = useContext(AuthContext);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const { target } = e;
    let formData = Object.fromEntries(new FormData(target));
    login(formData);
  };

  return (
    <Fragment>
      <form className={classes.LoginForm} onSubmit={formSubmitHandler}>
        <Loader show={isLoading} />
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Email"
          required
        />
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          required
        />
        <button className={classes.LoginButton}>Login</button>
        {error && <p className={classes.Error}>{error}</p>}
      </form>
    </Fragment>
  );
};

export default LoginForm;
