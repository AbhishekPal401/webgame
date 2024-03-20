import { TextArea } from "@appkit4/react-components";
import style from "./customInput.module.css";
import React from 'react';
import { Input } from "@appkit4/react-components/field";
import "@appkit4/styles/appkit.min.css";


const CustomInput = ({
  textArea = false,
  type,
  customStyle,
  label,
  title,
  name,
  disabled = false,
  value = "",
  labelStyle = "",
  customLabelStyle,
  textAreaStyleClass,
  inputStyleClass,
  customInputStyles,
  error = "",
  onChange = () => { },
  ref,
  ...props
}) => {
  return (
    <div style={customStyle} className={style.formGroup}>
      <label style={customLabelStyle} className={labelStyle}>{label}</label>
      {/* {textArea ? (
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
      )} */}
      {textArea ? (
        <TextArea
          type={type}
          value={value}
          style={customInputStyles}
          name={name}
          title={title}
          className={`${style.defaultTextAreaStyles} ${textAreaStyleClass}`}
          onChange={onChange}
          errorNode={(<div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">{error}</div>)}
          error={error === "" ? false : true}
          disabled={disabled}
          {...props}
        />
      ) : (
        <Input
          type={type}
          name={name}
          value={value}
          style={customInputStyles}
          title={title}
          className={`${style.input} ${inputStyleClass}`}
          onChange={onChange}
          errorNode={(<div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">{error}</div>)}
          error={error === "" ? false : true}
          disabled={disabled}
          {...props}
        />
      )}
    </div>
  );
};

export default CustomInput;
