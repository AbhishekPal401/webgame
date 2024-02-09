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

  console.log("hours");

  console.log("minutes", minutes);
  console.log("seconds", seconds);

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
