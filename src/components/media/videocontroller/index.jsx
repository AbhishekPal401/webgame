import React, { useState, useRef } from "react";
import styles from "./videocontrol.module.css";
import Button from "../../common/button";

const VideoController = ({
  videoUrl,
  onCompleted,
  showButton = false,
  onButtonClick = () => {},
  buttonLabel = "Skip",
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setPlaying(false);
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay={false}
        controls={false}
        muted={false}
        onClick={handlePlayPause}
        onEnded={handleVideoEnd}
      />

      {isPlaying && showButton && (
        <div
          className={styles.skipContainer}
          style={{
            backgroundImage: 'url("./images/grey_strip.png")',
          }}
        >
          <Button onClick={onButtonClick}>{buttonLabel}</Button>
        </div>
      )}

      {!isPlaying && (
        <div className={styles.overlay}>
          <svg onClick={handlePlayPause}>
            <use xlinkHref={"sprite.svg#video_play"} />
          </svg>
        </div>
      )}
    </div>
  );
};

export default VideoController;
