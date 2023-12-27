import React, { useCallback, useEffect, useState } from "react";
import styles from "./homepage.module.css";
import Button from "../../../../components/common/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getSessionDetails,
  resetSessionDetailsState,
} from "../../../../store/app/user/session/getSession";
import { useDispatch, useSelector } from "react-redux";
import { generateGUID } from "../../../../utils/common";
import {
  getNextQuestionDetails,
  resetNextQuestionDetailsState,
} from "../../../../store/app/user/questions/getNextQuestion";
import { toast } from "react-toastify";

const UserHomePage = () => {
  const [ready, setReady] = useState(true);

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchIntro = useCallback(() => {
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      sessionID: sessionData.SessionID,
      scenarioID: sessionData.ScenarioID,
      currentQuestionID: "",
      currentQuestionNo: 0,
      currentStatus: "Play",
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

  const onsubmit = () => {
    fetchIntro();
  };

  useEffect(() => {
    if (!credentials) return;

    const data = {
      userID: credentials.data.userID,
      type: "",
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };

    dispatch(getSessionDetails(data));
  }, []);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      toast.success(questionDetails.message);
      navigate("./intro");
    } else {
      toast.error(questionDetails.message);
    }
  }, [questionDetails]);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
    >
      <div className={styles.contentContainer}>
        <h3>Welcome to</h3>
        <h1>Game of Risks</h1>
        <div className={styles.players}>
          <div>
            <Button
              onClick={onsubmit}
              customClassName={ready ? styles.button : styles.buttonDisabled}
            >
              Ready
            </Button>
          </div>
          <div className={styles.wait}>
            {/* <div>Waiting for players to join</div>
            <div className={styles.users}>
              <motion.div
                initial={{ opacity: 0, x: "6em" }}
                animate={{ opacity: 1, x: "0" }}
                exit={{ opacity: 0, x: "-6rem" }}
                transition={{ duration: 0.8, damping: 10 }}
                className={styles.userbadge}
              >
                COO
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: "6em" }}
                animate={{ opacity: 1, x: "0" }}
                exit={{ opacity: 0, x: "-6rem" }}
                transition={{ duration: 0.8, damping: 10 }}
                className={styles.userbadge}
              >
                CTO
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: "6em" }}
                animate={{ opacity: 1, x: "0" }}
                exit={{ opacity: 0, x: "-6rem" }}
                transition={{ duration: 0.8, damping: 10 }}
                className={styles.userbadge}
              >
                CFO
              </motion.div>
            </div> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserHomePage;
