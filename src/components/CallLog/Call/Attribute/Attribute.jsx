import classes from "./Attribute.module.scss";

/* This component is used to add an element to the list with "key" and "value"*/

const Attribute = ({ title, value }) => {
  return (
    <li className={classes.Attribute}>
      <strong>{title}</strong> {value}
    </li>
  );
};

export default Attribute;
