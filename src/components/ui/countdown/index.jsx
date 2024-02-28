import React, { useEffect } from "react";
import styles from "./countdown.module.css";
import { useStopwatch } from "react-timer-hook";

const CountDown = ({ initialTimestamp = null }) => {
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
    if (initialTimestamp) {
      const stopwatchOffset = new Date();

      stopwatchOffset.setSeconds(
        stopwatchOffset.getSeconds() + initialTimestamp
      );

      reset(stopwatchOffset, true);
    } else {
      const stopwatchOffset = new Date();

      stopwatchOffset.setSeconds(stopwatchOffset.getSeconds());
      reset(stopwatchOffset, true);
    }

    return () => {
      pause();
    };
  }, [initialTimestamp]);

  return (
    <>
      <div className={styles.timer} onClick={() => {}}>
        {hours === 0 ? null : hours > 9 ? `${hours} :` : `0${hours} :`}{" "}
        {minutes > 9 ? minutes : `0${minutes}`} :{" "}
        {seconds > 9 ? seconds : `0${seconds}`}
      </div>
      <div>{hours === 0 ? "MIN" : "HRS"}</div>
    </>
  );
};

export default CountDown;
