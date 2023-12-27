import React from "react";
import styles from "./countdown.module.css";
import Countdown from "react-countdown";

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <div className={styles.timer}>0 : 0</div>;
  } else {
    return (
      <div className={styles.timer}>
        {minutes} : {seconds}
      </div>
    );
  }
};

//duration is milliseconds (5000 ms => 5sec)

const CountDown = ({ duration = 5000 }) => {
  return (
    <Countdown
      date={Date.now() + duration}
      renderer={renderer}
      autoStart={true}
    />
  );
};

export default CountDown;
