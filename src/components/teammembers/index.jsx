import React from "react";
import styles from "./teammembers.module.css";

const TeamMembers = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>Team Members</div>
        <div className={styles.arrow}>
          <svg onClick={() => {}}>
            <use xlinkHref={"sprite.svg#up_arrow"} />
          </svg>
        </div>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.item}>
          <div>Admin</div>
          <div className={styles.userContainer}>
            <div className={styles.itemDetails}>
              <div>A</div>
              <div>Abhishek</div>
              <div>CFO</div>
              <div></div>
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <div>CTO</div>
          <div className={styles.userContainer}>
            <div className={styles.itemDetails}>
              <div>B</div>
              <div>Bushan</div>
              <div>CTO</div>
              <div></div>
            </div>
            <hr />
            <div className={styles.itemDetails}>
              <div>C</div>
              <div>Chandan</div>
              <div>CTO</div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
