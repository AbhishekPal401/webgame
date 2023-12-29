import React from "react";
import styles from "./checkbox.module.css";

const Checkbox = ({ label, checked, ...props }) => {
  return (
    <div className={styles.checkboxContainer}>
      <div>
        <input type="checkbox" checked={checked} {...props} />
      </div>
      {label && <div className={styles.checkboxLabel}>{label}</div>}
    </div>
  );
};

export default Checkbox;
