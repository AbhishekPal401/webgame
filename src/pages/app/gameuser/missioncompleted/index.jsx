import React from "react";
import styles from "./missioncompleted.module.css";

const MissionCompleted = () => {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: 'url("./images/user_background.png")' }}
    >
      <div className={styles.missionContainer}>Mission Completed</div>
    </div>
  );
};

export default MissionCompleted;
