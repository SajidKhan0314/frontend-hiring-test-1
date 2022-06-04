import classes from "./Loader.module.scss";

const Loader = ({ show }) => {
  let loader = null;

  if (show) {
    loader = (
      <div className={classes.Loader}>
        <div className={classes.LdsDualRing}></div>
      </div>
    );
  }
  return loader;
};

export default Loader;
