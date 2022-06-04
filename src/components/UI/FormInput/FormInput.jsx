import classes from "./FormInput.module.scss";

const FormInput = ({ id, label, name, type, placeholder, required }) => {
  return (
    <div className={classes.FormInput}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default FormInput;
