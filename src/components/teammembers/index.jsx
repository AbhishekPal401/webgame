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
      {/* <div>
        <div className={styles.item}>
          <div>Admin</div>
          <div>
            <div>A</div>
            <div>Abhishek</div>
            <div>CFO</div>
            <div></div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TeamMembers;
