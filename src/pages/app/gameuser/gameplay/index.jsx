import React from "react";
import styles from "./gameplay.module.css";
import { motion } from "framer-motion";
import CountDown from "../../../../components/ui/countdown";
const GamePlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <div className={styles.header_left}>
          <div>Objectives</div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>
        <div className={styles.header_middle}>
          <svg className={styles.strip1} onClick={() => {}}>
            <use xlinkHref={"sprite.svg#gameplay-header-1"} />
          </svg>
          <svg className={styles.strip2} onClick={() => {}}>
            <use xlinkHref={"sprite.svg#gameplay-header-2"} />
          </svg>
        </div>
        <div className={styles.header_right}>
          <div className={styles.counter}>
            <div>Time elapsed</div>
            <CountDown />
            <div>MIN</div>
          </div>
          <div className={styles.vertical_line}></div>
          <div className={styles.score}>
            <div>Score</div>
            <div>000</div>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.left}>
          <div></div>
          <div></div>
        </div>
        <div className={styles.middle}>
          <div className={styles.questionContainer}></div>
        </div>
        <div className={styles.right}>
          <div className={styles.notification}>
            <div>
              <svg onClick={() => {}}>
                <use xlinkHref={"sprite.svg#notifcation"} />
              </svg>
            </div>

            <div></div>
          </div>
          <div className={styles.accordian}>
            <div>Team Members</div>
            <div>
              <svg onClick={() => {}}>
                <use xlinkHref={"sprite.svg#up_arrow"} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GamePlay;
