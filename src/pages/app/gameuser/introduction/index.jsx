import React, { useCallback, useEffect, useRef } from "react";
import styles from "./intro.module.css";
import Button from "../../../../components/common/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { generateGUID, isJSONString } from "../../../../utils/common";
import { getNextQuestionDetails } from "../../../../store/app/user/questions/getNextQuestion";
import { toast } from "react-toastify";
import { extractFileType } from "../../../../utils/helper";
import PDFPreview from "../../../../components/preview/pdfpreview";

const Intro = () => {
  const mediaRef = useRef(null);

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchIntro = useCallback(() => {
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      sessionID: sessionData.SessionID,
      scenarioID: sessionData.ScenarioID,
      currentQuestionID: "",
      currentQuestionNo: 0,
      currentStatus: "InProgress",
      ReConnection: false,

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

  const onSkip = () => {
    fetchIntro();
  };

  useEffect(() => {
    const handleEnded = () => {
      onSkip();
    };

    if (mediaRef.current) {
      mediaRef.current.addEventListener("ended", handleEnded);

      mediaRef.current
        .play()
        .then(() => {})
        .catch((error) => {
          console.error("Autoplay failed:", error);
        });
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (
      questionDetails.success &&
      questionDetails?.data?.IsIntroFile === false
    ) {
      navigate("/gameplay");
    } else if (!questionDetails.success) {
      // toast.error(questionDetails.message);
    }
  }, [questionDetails]);

  const fileType = extractFileType(questionDetails?.data?.IntroMediaURL);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
    >
      <div className={styles.container}>
        <div className={styles.videoContainer}>
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
                      <source
                        src={questionDetails.data.IntroMediaURL}
                        type="audio/mp3"
                      />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                )}

                {fileType.includes("mp4") && (
                  <video
                    ref={mediaRef}
                    width="100%"
                    height="100%"
                    controls={false}
                  >
                    <source
                      src={questionDetails.data.IntroMediaURL}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}

                {fileType.includes("pdf") && (
                  <div className={styles.customizedPDFPreviewContainer}>
                    {/* <iframe
                      src={questionDetails.data.IntroMediaURL}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin"
                    /> */}
                    {/* <embed
                      src={questionDetails.data.IntroMediaURL}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    /> */}
                    <PDFPreview pdfUrl={questionDetails.data.IntroMediaURL} />
                  </div>
                )}

                {(fileType.includes("png") ||
                  fileType.includes("jpg") ||
                  fileType.includes("jpeg")) && (
                  <div className={styles.previewContainer}>
                    <img
                      src={questionDetails.data.IntroMediaURL}
                      alt="Intro Image"
                      className={styles.previewImage}
                    />
                  </div>
                )}
              </>
            )}

          <div
            className={styles.buttonContainer}
            style={{ backgroundImage: 'url("./images/grey_strip.png")' }}
          >
            <Button onClick={onSkip} customStyle={{ fontSize: "1.4rem" }}>
              Skip
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Intro;
