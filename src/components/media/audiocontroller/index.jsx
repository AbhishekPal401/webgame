// import React, { useRef, useState } from "react";
// import styles from "./audiocontrol.module.css";

// const AudioController = ({ audioUrl = "", onCompleted = () => {} }) => {
//   const [isPlaying, setPlaying] = useState(false);

//   const audio = useRef();

//   const handlePlayPause = () => {
//     if (audio.current.paused) {
//       audio.current.play();
//     } else {
//       audio.current.pause();
//     }
//     setPlaying(!isPlaying);
//   };

//   const handleAudioEnd = () => {
//     setPlaying(false);
//     if (onCompleted) {
//       onCompleted();
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div>You have an incoming audio message...</div>
//       <audio
//         ref={audio}
//         src={audioUrl}
//         controls={false}
//         onClick={handlePlayPause}
//         onEnded={handleAudioEnd} // Callback for video completion
//       />
//       <div className={styles.image}>
//         <img src="./images/audio_background.png" />
//       </div>
//     </div>
//   );
// };

// export default AudioController;

import React, { useRef, useState, useEffect } from "react";
import styles from "./audiocontrol.module.css";

const AudioController = ({ audioUrl = "", onCompleted = () => {} }) => {
  const [isPlaying, setPlaying] = useState(false);
  const audio = useRef();
  const seekTrackRef = useRef();

  useEffect(() => {
    audio.current = new Audio(audioUrl);

    // Set up event listener for updating seek track position
    audio.current.addEventListener("timeupdate", () => {
      const seekPosition =
        (audio.current.currentTime / audio.current.duration) * 100;
      seekTrackRef.current.value = seekPosition;
    });

    return () => {
      audio.current.pause();
      audio.current = null;
    };
  }, [audioUrl]);

  const handlePlayPause = (event) => {
    if (audio.current.paused) {
      audio.current.play();
    } else {
      audio.current.pause();
    }
    setPlaying(!isPlaying);
    event.stopPropagation();
  };

  const handleAudioEnd = () => {
    setPlaying(false);
    if (onCompleted) {
      onCompleted();
    }
  };

  const handleSeek = (event) => {
    const seekPercentage = event.target.value;
    const seekTime = (seekPercentage / 100) * audio.current.duration;
    audio.current.currentTime = seekTime;
    event.stopPropagation();
  };

  return (
    <div className={styles.container}>
      <div>You have an incoming audio message...</div>

      <div className={styles.image} onClick={handlePlayPause}>
        <img src="./images/audio_background.png" alt="Audio Background" />
        {/* <input
          ref={seekTrackRef}
          type="range"
          defaultValue="0"
          step="1"
          max="100"
          className={styles.seekTrack}
          onChange={handleSeek}
        /> */}
        <audio
          ref={audio}
          src={audioUrl}
          controls={true}
          onClick={handlePlayPause}
          onEnded={handleAudioEnd}
        />
        {/* {!isPlaying && (
          <div className={styles.overlay}>
            <svg onClick={handlePlayPause}>
              <use xlinkHref={"sprite.svg#video_play"} />
            </svg>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AudioController;
