import React, { useState } from "react";
import styles from "./nudges.module.css";
import Button from "../common/button";

const Nudges = () => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        onClick={() => {
          setShow((prev) => {
            return !prev;
          });
        }}
      >
        <div>Nudges</div>
        <div className={`${styles.arrow} ${show ? styles.show : ""}`}>
          <svg onClick={() => {}}>
            <use xlinkHref={"sprite.svg#up_arrow"} />
          </svg>
        </div>
      </div>
      {show && (
        <div className={styles.description}>
          <div className={styles.input}>
            <textarea draggable={false}></textarea>
          </div>
          <div className={styles.buttonContainer}>
            <Button>Send</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nudges;
