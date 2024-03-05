import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./intro.module.css";
import Button from "../../../../components/common/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { generateGUID, isJSONString } from "../../../../utils/common";
import { getNextQuestionDetails } from "../../../../store/app/user/questions/getNextQuestion";
import { toast } from "react-toastify";
import { extractFileType, getCurrentTimeStamp } from "../../../../utils/helper";
import PDFPreview from "../../../../components/preview/pdfpreview";
import { signalRService } from "../../../../services/signalR";
import moment from "moment";
import {
  getFileStream,
  resetFileStreamState,
} from "../../../../store/app/admin/fileStream/getFileStream";
import QuestionLoader from "../../../../components/loader/questionLoader";
// import PDFPreview from "../../../../components/preview/pdfpreview";

const Intro = () => {
  const mediaRef = useRef(null);

  const [skipData, setSkipData] = useState(null);

  const [isPlaying, setPlaying] = useState(false);

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails, loading: questionLoading } = useSelector(
    (state) => state.getNextQuestion
  );
  const { fileStream, fileType, loading } = useSelector(
    (state) => state.getFileStream
  );

  // console.log("fileStream: ", fileStream);
  // console.log("fileType: ", fileType);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchIntro = useCallback(() => {
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      sessionID: sessionData.SessionID,
      scenarioID: sessionData.ScenarioID,
      currentQuestionID: "",
      ReConnection: false,
      currentQuestionNo: 0,
      currentStatus: "InProgress",
      userID: credentials.data.userID,
      currentTotalScore: 0,
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };

    dispatch(getNextQuestionDetails(data));
  }, [sessionDetails, credentials]);

  const onSkip = useCallback(() => {
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      InstanceID: sessionData.InstanceID,
      UserID: credentials.data.userID,
      UserRole: credentials.data.role,
      QuestionID: questionDetails.data.QuestionDetails.QuestionID,
      GlobalTimer: getCurrentTimeStamp(),
      QuestionTimer: "",
      TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ActionType: "IntroductionSkip",
    };

    console.log("SkipMediaInvoke admin", data);

    signalRService.SkipMediaInvoke(data);

    // navigate("/gameplay");

    // fetchIntro();
  }, [sessionDetails, credentials, questionDetails]);

  useEffect(() => {
    // const handleEnded = () => {};

    // if (mediaRef.current) {
    //   mediaRef.current.addEventListener("ended", handleEnded);

    //   mediaRef.current
    //     .play()
    //     .then(() => {})
    //     .catch((error) => {
    //       console.error("Autoplay failed:", error);
    //     });
    // }

    localStorage.setItem("refresh", false);

    return () => {};
  }, []);

  useEffect(() => {
    const skipMedia = (data) => {
      setSkipData(data);
    };
    signalRService.SkipMediaListener(skipMedia);

    return () => {
      signalRService.SkipMediaOff(skipMedia);
    };
  }, []);

  useEffect(() => {
    if (skipData) {
      fetchIntro();
      setSkipData(null);
    }
  }, [skipData, fetchIntro]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (
      questionDetails.success &&
      questionDetails?.data?.IsIntroFile === false
    ) {
      navigate("/gameplay");
    } else if (
      questionDetails.success &&
      questionDetails?.data?.IsIntroFile === true
    ) {
      const data = {
        fileName: questionDetails?.data?.IntroMediaURL,
        module: "Scenario",
      };
      dispatch(getFileStream(data));
      // toast.error(questionDetails.message);
    }
  }, [questionDetails]);

  const handlePlayPause = () => {
    if (mediaRef.current.paused) {
      mediaRef.current.play();
    } else {
      mediaRef.current.pause();
    }
    setPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setPlaying(false);
  };

  // const fileType = extractFileType(questionDetails?.data?.IntroMediaURL);
  // console.log(
  //   "questionDetails?.data?.IntroMediaURL",
  //   questionDetails?.data?.IntroMediaURL
  // );

  // console.log("fileType", fileType);
  // console.log("fileStream", fileStream);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
    >
      <div className={styles.container}>
        {loading || questionLoading ? (
          <QuestionLoader size={140} />
        ) : (
          <div
            className={styles.videoContainer}
            style={{
              justifyContent: fileType.includes("mp4") ? "flex-end" : "center",
            }}
          >
            {questionDetails &&
              questionDetails.data &&
              questionDetails.data.IsIntroFile && (
                <>
                  {fileType.includes("mp3") && (
                    <div className={styles.audioContainer}>
                      <img
                        src="./images/icon-audio.png"
                        alt="Audio icon png"
                        className={styles.previewAudioImage}
                      />
                      <audio ref={mediaRef} controls autoPlay>
                        <source src={fileStream} type="audio/mp3" />
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )}

                  {fileType.includes("mp4") && (
                    <div className={styles.videoWrapper}>
                      <video
                        ref={mediaRef}
                        width="100%"
                        height="100%"
                        controls={false}
                        onClick={handlePlayPause}
                        onEnded={handleVideoEnd}
                      >
                        <source src={fileStream} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      {!isPlaying && (
                        <div className={styles.overlay}>
                          <svg onClick={handlePlayPause}>
                            <use xlinkHref={"sprite.svg#video_play"} />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}

                  {fileType.includes("pdf") && (
                    <div className={styles.customizedPDFPreviewContainer}>
                      <PDFPreview pdfUrl={fileStream} />
                    </div>
                  )}

                  {(fileType.includes("png") ||
                    fileType.includes("jpg") ||
                    fileType.includes("jpeg")) && (
                    <div className={styles.previewContainer}>
                      <img
                        src={fileStream}
                        alt="Intro Image"
                        className={styles.previewImage}
                      />
                    </div>
                  )}
                </>
              )}

            {questionDetails?.data?.IntroMediaURL && (
              <div
                className={styles.buttonContainer}
                style={{ backgroundImage: 'url("./images/grey_strip.png")' }}
              >
                <Button onClick={onSkip} customStyle={{ fontSize: "1.4rem" }}>
                  Skip
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Intro;
