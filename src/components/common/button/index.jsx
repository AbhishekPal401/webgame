import React from "react";
import styles from "./button.module.css";

const Button = ({
  children,
  buttonType,
  customClassName,
  customStyle = {},
  onClick = () => {},
  ...props
}) => (
  <button
    style={customStyle}
    className={`${styles[buttonType] || customClassName || styles.default}`}
    {...props}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
