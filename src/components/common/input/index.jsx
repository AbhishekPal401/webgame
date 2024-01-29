import style from "./input.module.css";

const Input = ({
  textArea,
  type,
  customStyle,
  label,
  name,
  disabled = false,
  value = "",
  labelStyle = "",
  customLabelStyle,
  textAreaStyleClass,
  inputStyleClass,
  onChange = () => {},
  ref,
  ...props
}) => {
  return (
    <div style={customStyle} className={style.formGroup}>
      <label style={customLabelStyle} className={labelStyle}>{label}</label>
      {textArea ? (
        <textarea
          disabled={disabled}
          name={name}
          value={value}
          className={`${style.formControl} ${textAreaStyleClass}`}
          placeholder={label}
          {...props}
          onChange={onChange}
        />
      ) : (
        <input
          disabled={disabled}
          type={type}
          name={name}
          value={value}
          className={`${style.formControl} ${inputStyleClass}`}
          placeholder={label}
          ref={ref}
          {...props}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Input;
