import React from "react";
import styles from "./question.module.css";
import SmallCountDown from "../smallcountdown";
import Button from "../../../common/button";

const Question = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>Make a decision</div>
        <div>
          <div className={styles.smallCountContainer}>
            <div></div>
            <SmallCountDown
              height={16}
              width={16}
              duration={20000}
              loops={1}
              reverse={true}
              inverse={false}
            />
          </div>
          <div className={styles.timer}>Time Left to Vote 01:10min</div>
        </div>
      </div>
      <div className={styles.questionContainer}>
        <div>1.</div>
        <div className={styles.question}>
          <div>
            The Finance team and IT heads confirmed impact in terms of
            application downtime and data encryption.
            <p>
              Restoration is possible but new infrastructure procurement will
              take time leading to additional downtime.
            </p>
          </div>
          <div>
            <p style={{ marginTop: "1rem" }}>
              Do you want to restore or preserve the systems?
            </p>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.answerContainer}>
          <div className={styles.answer}>
            A. Perform restoration on the systems
          </div>
          <div className={styles.answer}>
            A. Perform restoration on the systems
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button customClassName={styles.button}>Vote</Button>
        </div>
      </div>
    </div>
  );
};

export default Question;
