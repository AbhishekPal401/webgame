import React, { useState, useRef } from "react";
import styles from "./videocontrol.module.css";

const VideoController = ({ videoUrl, onCompleted }) => {
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
        controls={false}
        muted={false}
        onClick={handlePlayPause}
        onEnded={handleVideoEnd} // Callback for video completion
      />
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
