import style from "./input.module.css";

const Input = ({
  textArea,
  type,
  customStyle,
  label,
  name,
  labelStyle = "",
  onChange = () => {},
  ...props
}) => {
  return (
    <div style={customStyle} className={style.formGroup}>
      <label className={labelStyle}>{label}</label>
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
