import style from "./input.module.css";

const Input = ({
  textArea,
  type,
  customStyle,
  label,
  name,
  onChange = () => {},
  ...props
}) => {
  return (
    <div style={customStyle} className={style.formGroup}>
      <label>{label}</label>
      {textArea ? (
        <textarea
          className={style.formControl}
          placeholder={label}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          className={style.formControl}
          placeholder={label}
          {...props}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Input;
