import React, { useEffect } from "react";
import styles from "./gameplay.module.css";
import { motion } from "framer-motion";
import CountDown from "../../../../components/ui/countdown";
import Question from "../../../../components/ui/gameplay/question";
import { useSelector } from "react-redux";
import { signalRService } from "../../../../services/signalR";
import { isJSONString } from "../../../../utils/common";

const GamePlay = () => {
  const { questionDetails } = useSelector((state) => state.getNextQuestion);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);

  useEffect(() => {
    signalRService.ProceedToNextQuestionListener((isFinal) => {
      console.log("isFinal", isFinal);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <div className={styles.header_left}>
          <div>Objectives</div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>
        <div className={styles.header_middle}>
          <svg className={styles.strip1} onClick={() => {}}>
            <use xlinkHref={"sprite.svg#gameplay-header-1"} />
          </svg>
          <svg className={styles.strip2} onClick={() => {}}>
            <use xlinkHref={"sprite.svg#gameplay-header-2"} />
          </svg>
        </div>
        <div className={styles.header_right}>
          <div className={styles.counter}>
            <div>Time elapsed</div>
            <CountDown />
            <div>MIN</div>
          </div>
          <div className={styles.vertical_line}></div>
          <div className={styles.score}>
            <div>Score</div>
            <div>
              {questionDetails?.data?.CurrentScore
                ? questionDetails?.data?.CurrentScore
                : 0}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.left}>
          <div></div>
          <div></div>
        </div>
        <div className={styles.middle}>
          <div className={styles.questionContainer}>
            <Question />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.notification}>
            <div>
              <svg
                onClick={() => {
                  if (!isJSONString(sessionDetails.data)) return;
                  const sessionData = JSON.parse(sessionDetails.data);

                  const data = {
                    InstanceID: sessionData.InstanceID,
                    UserID: credentials.data.userID,
                    isFinalPlay: "Yes",
                  };

                  signalRService.ProceedToNextQuestionInvoke(data);
                }}
              >
                <use xlinkHref={"sprite.svg#notifcation"} />
              </svg>
            </div>

            <div></div>
          </div>
          <div className={styles.accordian}>
            <div>Team Members</div>
            <div>
              <svg onClick={() => {}}>
                <use xlinkHref={"sprite.svg#up_arrow"} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GamePlay;
