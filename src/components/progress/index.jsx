import React, { useEffect, useState } from "react";
import styles from "./progress.module.css";

const interpolate = (lowestValue, highestValue, minValue, maxValue, value) => {
  const percentage =
    (Math.min(Math.max(value, minValue), maxValue) - minValue) /
    (maxValue - minValue);
  return lowestValue + (highestValue - lowestValue) * percentage;
};

const progress = ({ progress = 0 }) => {
  const [rotationDegree, setRotationDegree] = useState(0);
  const [pointerPosition, setPointerPosition] = useState(0);

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const targetDegree = interpolate(-85, 85, 0, 100, progress); // Assuming progress ranges from 0 to 1
    setRotationDegree(targetDegree);
    const targetPosition = interpolate(-5, 93, 0, 100, progress);
    setPointerPosition(targetPosition);
  }, [progress, pointerPosition]);
  return (
    <div
      className={styles.container}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img src="./images/meter.png" className={styles.meter} />
      <svg
        className={styles.tick}
        style={{ transform: `rotate(${rotationDegree}deg)` }}
      >
        <use xlinkHref={"sprite.svg#progress-tick"} />
      </svg>

      <svg className={styles.info}>
        <use xlinkHref={"sprite.svg#info"} />
      </svg>
      {showTooltip && (
        <div className={styles.detailContainer}>
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
              style={{ left: `${pointerPosition}%` }}
            >
              <use xlinkHref={"sprite.svg#progress-pointer"} />
            </svg>
          </div>
          <div className={styles.progresslabels}>
            <div className={styles.label}>Bad</div>
            <div className={styles.label}>Below Average</div>
            <div className={styles.label}>Average</div>
            <div className={styles.label}>Above Average</div>
            <div className={styles.label}>Good</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default progress;
