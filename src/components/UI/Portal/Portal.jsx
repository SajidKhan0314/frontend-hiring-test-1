import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  return createPortal(children, document.querySelector("#modal"));
};

export default Portal;
