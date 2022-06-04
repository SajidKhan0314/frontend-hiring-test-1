import Portal from "../Portal/Portal";
import classes from "./Modal.module.scss";

const Modal = ({ children, show, onClickOutside }) => {
  let modal = null;

  if (show) {
    modal = (
      <Portal>
        <div onClick={onClickOutside} className={classes.Backdrop}></div>
        <div className={classes.Modal}>{children}</div>
      </Portal>
    );
  }

  return modal;
};

export default Modal;
