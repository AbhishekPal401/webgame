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
  const [inProgress, setInProgress] = useState(false);
  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);
  const { isConnectedToServer } = useSelector((state) => state.gameplay);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchIntro = useCallback(() => {
    if (sessionDetails?.data) {
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        sessionID: sessionData.SessionID,
        scenarioID: sessionData.ScenarioID,
        currentQuestionID: "",
        currentQuestionNo: 0,
        currentStatus: "Play",
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
    }
  }, [sessionDetails, credentials]);

  const onsubmit = async () => {
    if (!ready || !isConnectedToServer) return;
    if (sessionDetails?.data) {
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        InstanceID: sessionData.InstanceID,
        SessionID: sessionData.SessionID,
        UserID: credentials.data.userID,
        UserName: credentials.data.userName,
        UserRole: credentials.data.role,
        Designation: credentials?.data?.designation
          ? credentials.data.designation
          : "",
      };

      await signalRService.joinSession(data);
      setReady(false);
    }
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
    const notification = (actionType, message) => {
      console.log("actionType", actionType);
      console.log("message", message);

      if (actionType === "AdminPlayStart") {
        fetchIntro();
      }
    };

    signalRService.ReceiveNotification(notification);

    return () => {
      signalRService.ReceiveNotificationOff(notification);
    };
  }, [fetchIntro]);

  const fetchFirstQuestion = useCallback(() => {
    if (sessionDetails?.data) {
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
    }
  }, [sessionDetails, credentials]);

  const onSkip = useCallback(() => {
    if (sessionDetails?.data) {
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        InstanceID: sessionData.InstanceID,
        UserID: credentials.data.userID,
        UserRole: credentials.data.role,
        QuestionID: questionDetails.data.QuestionDetails.QuestionID,
        GlobalTimer: Date.now().toString(),
        QuestionTimer: "",
        ActionType: "IntroductionSkip",
      };

      console.log(" global skip data", data);

      signalRService.SkipMediaInvoke(data);
    }
  }, [sessionDetails, credentials, questionDetails]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      // toast.success(questionDetails.message);
      if (inProgress) {
        setInProgress(false);
        navigate("/gameplay");
      } else {
        if (questionDetails.data.IntroMediaURL) {
          navigate("/intro");
        } else {
          onSkip();
          fetchFirstQuestion();
          navigate("/gameplay");
        }
      }
    } else {
      // toast.error(questionDetails.message);
    }
  }, [questionDetails]);

  const getCurrentQuestion = async () => {
    if (!ready || !isConnectedToServer) return;
    if (sessionDetails?.data) {
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        InstanceID: sessionData.InstanceID,
        SessionID: sessionData.SessionID,
        UserID: credentials.data.userID,
        UserName: credentials.data.userName,
        UserRole: credentials.data.role,
        Designation: credentials?.data?.designation
          ? credentials.data.designation
          : "",
      };

      await signalRService.joinSession(data);
      setReady(false);
      setInProgress(true);

      const questionPayload = {
        sessionID: sessionData.SessionID,
        scenarioID: sessionData.ScenarioID,
        currentQuestionID: "",
        currentQuestionNo: 0,
        currentStatus: "InProgress",
        ReConnection: true,
        userID: credentials.data.userID,
        currentTotalScore: 0,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getNextQuestionDetails(questionPayload));
    }
  };

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
            JSON.parse(sessionDetails.data)?.SessionID ? (
              JSON.parse(sessionDetails.data)?.CurrentState === "InProgress" ? (
                <Button
                  onClick={getCurrentQuestion}
                  customClassName={
                    ready && isConnectedToServer
                      ? styles.button
                      : styles.buttonDisabled
                  }
                >
                  Join Game
                </Button>
              ) : (
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
              )
            ) : null}
          </div>
          <div>
            {sessionDetails &&
            sessionDetails.data &&
            isJSONString(sessionDetails.data) &&
            JSON.parse(sessionDetails.data)?.SessionID ? (
              JSON.parse(sessionDetails.data)?.CurrentState === "InProgress" ? (
                <></>
              ) : (
                <>
                  {ready && isConnectedToServer
                    ? ""
                    : " Waiting for the Admin to start the game "}
                </>
              )
            ) : (
              <>{" Waiting for the Admin to join the game"}</>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserHomePage;
