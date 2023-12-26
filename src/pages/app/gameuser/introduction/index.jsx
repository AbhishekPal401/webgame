import React, { useEffect, useRef } from "react";
import styles from "./intro.module.css";
import Button from "../../../../components/common/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const Intro = () => {
  const videoRef = useRef(null);

  const navigate = useNavigate();

  const handlePlay = () => {
    // videoRef.current.play().catch((error) => {});
    navigate("/gameplay");
  };

  useEffect(() => {
    const handleEnded = () => {
      // Video has ended, restart it
      videoRef.current.currentTime = 0; // Rewind to the beginning
      videoRef.current.play();
      videoRef.current.muted = false;
    };

    // Attach the event listener
    videoRef.current.addEventListener("ended", handleEnded);

    // Start the video
    videoRef.current
      .play()
      .then(() => {})
      .catch((error) => {
        console.error("Autoplay failed:", error);
      });

    return () => {};
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
    >
      <div className={styles.container}>
        <div className={styles.videoContainer}>
          <video ref={videoRef} width="100%" height="100%" controls={false}>
            <source src="./example.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className={styles.buttonContainer}>
            <Button onClick={handlePlay} customStyle={{ fontSize: "1.4rem" }}>
              Skip
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Intro;
