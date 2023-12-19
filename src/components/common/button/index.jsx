import React from "react";
import styles from "./button.module.css";

const Button = ({
  children,
  buttonType,
  customClassName,
  onClick = () => {},
  ...props
}) => (
  <button
    className={`${styles[buttonType] || customClassName || styles.default}`}
    {...props}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
