import style from "./input.module.css";

const Input = ({
  textArea,
  type,
  customStyle,
  label,
  name,
  value = "",
  labelStyle = "",
  textAreaStyleClass,
  onChange = () => {},
  ...props
}) => {
  return (
    <div style={customStyle} className={style.formGroup}>
      <label className={labelStyle}>{label}</label>
      {textArea ? (
        <textarea
          name={name}
          value={value}
          className={`${style.formControl} ${textAreaStyleClass}`}
          placeholder={label}
          {...props}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
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
