import React, { useEffect } from "react";
import styles from "./countdown.module.css";
import { useStopwatch } from "react-timer-hook";

const CountDown = ({ initialTimestamp = Date.now() }) => {
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

  useEffect(() => {
    const currentTimestamp = Date.now() / 1000;
    const offsetTimestamp = initialTimestamp / 1000 - currentTimestamp;

    const stopwatchOffset = new Date();
    stopwatchOffset.setSeconds(
      stopwatchOffset.getSeconds() + Math.abs(offsetTimestamp)
    );

    reset(stopwatchOffset, true);

    return () => {
      pause();
    };
  }, [initialTimestamp]);

  return (
    <div className={styles.timer} onClick={() => {}}>
      {minutes} : {seconds}
    </div>
  );
};

export default CountDown;
