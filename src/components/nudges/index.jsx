import React from "react";
import styles from "./nudges.module.css";
import Button from "../common/button";

const Nudges = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>Nudges</div>
        <div className={styles.arrow}>
          <svg onClick={() => {}}>
            <use xlinkHref={"sprite.svg#up_arrow"} />
          </svg>
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.input}>
          <textarea draggable={false}></textarea>
        </div>
        <div className={styles.buttonContainer}>
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Nudges;
