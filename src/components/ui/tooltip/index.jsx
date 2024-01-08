import React, { useState } from "react";
import styles from "./tooltip.module.css";

const ToolTip = ({ text = "", description = "", children }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  console.log("isTooltipVisible", isTooltipVisible);

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isTooltipVisible && (
        <div className={styles.tooltip}>
          <div>{text}</div>
          <div>{description}</div>
        </div>
      )}
    </div>
  );
};

export default ToolTip;
