import React, { useCallback, useEffect, useRef } from "react";
import styles from "./intro.module.css";
import Button from "../../../../components/common/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { generateGUID, isJSONString } from "../../../../utils/common";
import { getNextQuestionDetails } from "../../../../store/app/user/questions/getNextQuestion";
import { toast } from "react-toastify";

const Intro = () => {
  const videoRef = useRef(null);

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

  const handlePlay = () => {
    fetchIntro();
  };

  useEffect(() => {
    const handleEnded = () => {};

    if (videoRef.current) {
      videoRef.current.addEventListener("ended", handleEnded);

      videoRef.current
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
              <video ref={videoRef} width="100%" height="100%" controls={false}>
                <source
                  src={questionDetails.data.IntroMediaURL}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}

          <div
            className={styles.buttonContainer}
            style={{ backgroundImage: 'url("./images/grey_strip.png")' }}
          >
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
