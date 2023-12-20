
import React from 'react';
import styles from "./checkbox.module.css";

const Checkbox = ({ label, checked, ...props }) => {
  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        {...props}
      />
      {label &&
        <label className={styles.checkboxLabel}>
          {label}
        </label> 
      }
    </div>
  );
};

export default Checkbox;
