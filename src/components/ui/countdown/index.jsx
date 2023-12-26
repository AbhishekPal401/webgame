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

const CountDown = () => {
  return (
    <Countdown
      date={Date.now() + 500000}
      renderer={renderer}
      autoStart={true}
    />
  );
};

export default CountDown;
