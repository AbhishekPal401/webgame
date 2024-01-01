import React from "react";
import styles from "./countdown.module.css";
import { useStopwatch } from "react-timer-hook";

const CountDown = ({ duration = 5000 }) => {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  return (
    <div className={styles.timer}>
      {minutes} : {seconds}
    </div>
  );
};

export default CountDown;
