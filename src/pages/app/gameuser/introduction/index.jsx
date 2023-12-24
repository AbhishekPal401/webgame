import React, { useEffect, useRef } from "react";
import styles from "./intro.module.css";
import Button from "../../../../components/common/button";

const Intro = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = () => {
      videoRef.current.currentTime = 0; // Rewind to the beginning
      videoRef.current.play();
      setTimeout(() => {
        videoRef.current.muted = false;
      }, 2000);
    };

    // Event listener to start the video when loaded
    const handleLoadedData = () => {
      playVideo();
    };

    // Attach the event listener
    videoRef.current.addEventListener("loadeddata", handleLoadedData);

    return () => {
      // Cleanup: remove the event listener
      videoRef.current.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer} controls>
        <video ref={videoRef} width="100%" height="100%" controls>
          <source src="./example.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.buttonContainer}>
          <Button customStyle={{ fontSize: "1.4rem" }}>Skip</Button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
