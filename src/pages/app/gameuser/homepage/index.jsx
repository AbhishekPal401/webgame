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
import { generateGUID, isJSONString } from "../../../../utils/common";
import {
  getNextQuestionDetails,
  resetNextQuestionDetailsState,
} from "../../../../store/app/user/questions/getNextQuestion";
import { toast } from "react-toastify";
import { signalRService } from "../../../../services/signalR";

const UserHomePage = () => {
  const [ready, setReady] = useState(true);

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);
  const { isConnectedToServer } = useSelector((state) => state.gameplay);

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

  const onsubmit = async () => {
    if (!ready || !isConnectedToServer) return;
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      InstanceID: sessionData.InstanceID,
      SessionID: sessionData.SessionID,
      UserID: credentials.data.userID,
      UserName: credentials.data.userName,
      Designation: credentials?.data?.designation
        ? credentials.data.designation
        : "",
    };

    await signalRService.joinSession(data);
    setReady(false);
  };

  useEffect(() => {
    if (!credentials) return;

    const data = {
      userID: credentials.data.userID,
      type: "",

      InstanceID: "",
      IsPlayStart: false,

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
    signalRService.ReceiveNotification((actionType, message) => {
      console.log("actionType", actionType);
      console.log("message", message);

      if (actionType === "AdminPlayStart") {
        fetchIntro();
      }
    });
  });

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      // toast.success(questionDetails.message);
      navigate("/intro");
    } else {
      // toast.error(questionDetails.message);
    }
  }, [questionDetails]);

  return (
    <motion.div
      className={styles.container}
      style={{ backgroundImage: 'url("/images/user_background.png")' }}
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
            {sessionDetails &&
              sessionDetails.data &&
              isJSONString(sessionDetails.data) &&
              JSON.parse(sessionDetails.data)?.SessionID && (
                <Button
                  onClick={onsubmit}
                  customClassName={
                    ready && isConnectedToServer
                      ? styles.button
                      : styles.buttonDisabled
                  }
                >
                  Ready
                </Button>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserHomePage;
