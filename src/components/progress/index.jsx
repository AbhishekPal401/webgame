import React, { useEffect, useState } from "react";
import styles from "./progress.module.css";
import { toPng } from "html-to-image";

const interpolate = (lowestValue, highestValue, minValue, maxValue, value) => {
  const percentage =
    (Math.min(Math.max(value, minValue), maxValue) - minValue) /
    (maxValue - minValue);
  return lowestValue + (highestValue - lowestValue) * percentage;
};

const scoreMasterDefault = [
  {
    ScoreDisplay: "Bad",
  },
  {
    ScoreDisplay: "Below Average",
  },
  {
    ScoreDisplay: "Average",
  },
  {
    ScoreDisplay: "Above Average",
  },
  {
    ScoreDisplay: "Good",
  },
];

const progress = ({ 
  progress = 0, 
  scoreMaster = [], 
  tickStyleClass, 
  meterContainerClass, 
  customMeterClass,
  customInfoClass 
}) => {
  const [rotationDegree, setRotationDegree] = useState(0);
  const [pointerPosition, setPointerPosition] = useState(0);

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const targetDegree = interpolate(-98, 98, 0, 100, progress); // Assuming progress ranges from 0 to 100
    setRotationDegree(targetDegree);
    const targetPosition = interpolate(-5, 93, 0, 100, progress);
    setPointerPosition(targetPosition);
  }, [progress, pointerPosition]);

  return (
    <div
      id="progressmeter"
      className={`${styles.container} ${meterContainerClass}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img width={"100%"} src="./images/meter.png" className={`${styles.meter} ${customMeterClass}`} />

      <svg
        className={`${styles.tick} ${tickStyleClass}`}
        width={"4.5rem"}
        height={"8rem"}
        style={{ transform: `rotate(${rotationDegree}deg)` }}
        viewBox="0 0 39 65"
      >
        <g clipPath="url(#clip0_476_24)">
          <path
            d="M19.5685 3.00892C21.0415 2.99092 23.9365 56.8179 24.0685 58.5449C24.2005 60.2719 24.3385 61.8979 24.3385 63.5639C24.3385 64.8281 23.8364 66.0405 22.9425 66.9343C22.0486 67.8282 20.8362 68.3304 19.572 68.3304C18.3079 68.3304 17.0955 67.8282 16.2016 66.9343C15.3077 66.0405 14.8055 64.8281 14.8055 63.5639C14.8055 62.0109 14.8905 60.5829 14.9845 59.0639C15.0785 57.5449 18.1025 3.02692 19.5685 3.00892Z"
            fill="#5E5E5E"
          />
        </g>
        <defs>
          <clipPath id="clip0_476_24">
            <rect
              width="23.982"
              height="65.792"
              fill="white"
              transform="translate(15.2848 0.919922) rotate(13)"
            />
          </clipPath>
        </defs>
      </svg>

      <svg className={`${styles.info} ${customInfoClass}`}>
        <use xlinkHref={"sprite.svg#info"} />
      </svg>

      <div
        id="progressbar_tooltip"
        className={styles.detailContainer}
        style={{ display: showTooltip ? "flex" : "none" }}
      >
        <div className={styles.progressBar}>
          <div
            className={styles.progressBarItem}
            style={{ backgroundColor: "#D04A02" }}
          ></div>
          <div
            className={styles.progressBarItem}
            style={{ backgroundColor: "#FFB600" }}
          ></div>
          <div
            className={styles.progressBarItem}
            style={{ backgroundColor: "#3DD5B0" }}
          ></div>
          <div
            className={styles.progressBarItem}
            style={{ backgroundColor: "#299D8F" }}
          ></div>

          <div className={styles.line}></div>
          <svg
            className={styles.pointer}
            style={{ left: `${pointerPosition ? pointerPosition : 0}%` }}
          >
            <use xlinkHref={"sprite.svg#progress-pointer"} />
          </svg>
        </div>
        <div className={styles.progresslabels}>
          {scoreMaster && Array.isArray(scoreMaster) && scoreMaster.length > 0
            ? scoreMaster.map((scoreMasterItem, index) => {
                return (
                  <div className={styles.label} key={index}>
                    {scoreMasterItem.ScoreDisplay}
                  </div>
                );
              })
            : scoreMasterDefault.map((scoreMasterItem, index) => {
                return (
                  <div className={styles.label} key={index}>
                    {scoreMasterItem.ScoreDisplay}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default progress;
