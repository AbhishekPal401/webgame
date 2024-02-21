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
import { getCurrentTimeStamp } from "../../../../utils/helper";

const UserHomePage = () => {
  const [ready, setReady] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [callSessionApi, setCallSessionApi] = useState(false);
  const [callQuestionApi, setCallQuestionApi] = useState(false);

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

  const JoinWithUserID = useCallback(() => {
    const data = {
      UserID: credentials.data.userID,
      UserRole: credentials.data.role,
    };

    console.log("user joined ", data);
    signalRService.joinWithUserId(data);
  }, [credentials]);

  useEffect(() => {
    dispatch(resetNextQuestionDetailsState());
  }, []);

  const fetchSession = useCallback(() => {
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
    JoinWithUserID();
  }, [JoinWithUserID]);

  useEffect(() => {
    fetchSession();
    localStorage.setItem("refresh", false);
  }, []);

  useEffect(() => {
    if (callQuestionApi) {
      fetchSession();
    }
  }, [fetchSession, callQuestionApi]);

  useEffect(() => {
    const gameavailable = () => {
      console.log("game available called");
      setCallQuestionApi(true);
      setReady(true);
    };

    signalRService.GameAvailableOff(gameavailable);

    console.log("game available listener");

    signalRService.GameAvailable(gameavailable);

    return () => {
      signalRService.GameAvailableOff(gameavailable);
    };
  }, []);

  useEffect(() => {
    if (callSessionApi) {
      fetchIntro();
    }
  }, [fetchIntro, callSessionApi]);

  useEffect(() => {
    const notification = (actionType, message) => {
      if (actionType === "AdminPlayStart") {
        setCallSessionApi(true);
      }
    };

    signalRService.ReceiveNotificationOff(notification);

    signalRService.ReceiveNotification(notification);

    return () => {
      signalRService.ReceiveNotificationOff(notification);
    };
  }, []);

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

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      // toast.success(questionDetails.message);
      // console.log("Intro Media data", questionDetails.data);

      if (inProgress) {
        setInProgress(false);
        navigate("/gameplay");
      } else {
        if (questionDetails.data.IntroMediaURL) {
          if (questionDetails?.data?.IntroSkipped) {
            if (questionDetails?.data?.IntroSkipped === true) {
              navigate("/gameplay");
            } else {
              navigate("/intro");
            }
          } else {
            navigate("/intro");
          }
        } else {
          fetchFirstQuestion();
          navigate("/gameplay");
        }
      }

      setCallQuestionApi(false);
    } else {
      // toast.error(questionDetails.message);
    }
  }, [questionDetails]);

  useEffect(() => {
    if (sessionDetails && sessionDetails.success) {
      setCallSessionApi(false);
    }
  }, [sessionDetails]);

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
