import React, { useCallback, useEffect, useState } from "react";
import styles from "./gamelanding.module.css";
import Button from "../../../../components/common/button";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
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
import { setActiveUsers } from "../../../../store/local/gameplay";
import { Tooltip } from "react-tooltip";
import { getCurrentTimeStamp } from "../../../../utils/helper";
import moment from "moment";

const AdminGameLanding = () => {
  const [ready, setReady] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [joinClick, setJoinClick] = useState(false);

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);
  const { isConnectedToServer, activeUsers } = useSelector(
    (state) => state.gameplay
  );

  const { instanceID } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startGame = useCallback(() => {
    if (sessionDetails?.data) {
      const sessionData = JSON.parse(sessionDetails.data);

      const payload = {
        InstanceID: sessionData.InstanceID,
        SessionID: sessionData.SessionID,
        UserID: credentials.data.userID,
        UserName: credentials.data.userName,
        ActionType: "AdminPlayStart",
        Message: "Success",
      };

      signalRService.AdminMessage(payload);
    }
  }, [sessionDetails, credentials]);

  useEffect(() => {
    dispatch(resetNextQuestionDetailsState());
  }, []);

  const fetchIntro = useCallback(() => {
    if (sessionDetails?.data) {
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        sessionID: sessionData.SessionID,
        scenarioID: sessionData.ScenarioID,
        currentQuestionID: "",
        currentQuestionNo: 0,
        currentStatus: "Play",
        userID: credentials.data.userID,
        ReConnection: false,
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

  const joinRoom = useCallback(async () => {
    if (sessionDetails?.data) {
      if (!isJSONString(sessionDetails.data)) return;
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

      console.log("Joining the room...", data);
      await signalRService.joinSession(data);
    }
  }, [sessionDetails, credentials]);

  const JoinWithUserID = useCallback(() => {
    const data = {
      UserID: credentials.data.userID,
      UserRole: credentials.data.role,
    };
    signalRService.joinWithUserId(data);
  }, [credentials]);

  useEffect(() => {
    const ReceiveNotification = (actionType, message) => {
      if (actionType === "AdminPlayStart") {
        fetchIntro();
      }
    };

    const startJoiningRoom = async () => {
      try {
        await joinRoom();

        signalRService.connectedUsers((users) => {
          console.log("ConnectedUsers", users);
          dispatch(setActiveUsers(users));
        });

        signalRService.ReceiveNotification(ReceiveNotification);
      } catch (error) {
        console.error("Error during join room:", error);
      }
    };
    let isReconnection = false;
    if (
      sessionDetails &&
      sessionDetails.data &&
      isJSONString(sessionDetails.data) &&
      JSON.parse(sessionDetails.data)?.SessionID &&
      JSON.parse(sessionDetails.data)?.CurrentState === "InProgress"
    ) {
      isReconnection = true;
    }
    if (
      sessionDetails &&
      sessionDetails.data &&
      isJSONString(sessionDetails.data) &&
      JSON.parse(sessionDetails.data)?.SessionID &&
      JSON.parse(sessionDetails.data)?.CurrentState === "Start"
    ) {
      const sessionData = JSON.parse(sessionDetails.data);

      signalRService.NotifyPlayers(sessionData.InstanceID);
    }

    if (isConnectedToServer && !isReconnection) {
      startJoiningRoom();
      JoinWithUserID();
    }

    return () => {
      signalRService.ReceiveNotificationOff(ReceiveNotification);
    };
  }, [sessionDetails, isConnectedToServer, JoinWithUserID]);

  useEffect(() => {
    if (!credentials) return;

    const data = {
      userID: credentials.data.userID,
      type: "",
      InstanceID: instanceID,
      IsPlayStart: true,
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };

    dispatch(getSessionDetails(data));
    localStorage.setItem("refresh", false);
  }, [instanceID]);

  useEffect(() => {
    if (activeUsers && activeUsers.length >= 3) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [activeUsers]);

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
        GlobalTimer: getCurrentTimeStamp(),
        QuestionTimer: getCurrentTimeStamp(),
        TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ActionType: "IntroductionSkip",
      };

      console.log("SkipMediaInvoke for  admin", data);

      signalRService.SkipMediaInvoke(data);
    }
  }, [sessionDetails, credentials, questionDetails]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      console.log("inProgress", inProgress);
      if (inProgress) {
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
          onSkip();
          fetchFirstQuestion();
          navigate("/gameplay");
        }
      }
    } else {
      toast.error(questionDetails.message);
      setJoinClick(false);
    }
  }, [questionDetails]);

  const getCurrentQuestion = async () => {
    if (!isConnectedToServer) return;
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
      setInProgress(true);

      signalRService.connectedUsers((users) => {
        console.log("ConnectedUsers", users);
        dispatch(setActiveUsers(users));
      });

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
      style={{ backgroundImage: 'url("./images/user_background.png")' }}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
    >
      <div className={styles.contentContainer}>
        <h3>Welcome to</h3>
        <h1>Game of Risks</h1>
        <div className={styles.players}>
          {sessionDetails && sessionDetails.success ? (
            <div>
              {sessionDetails &&
              sessionDetails.data &&
              isJSONString(sessionDetails.data) &&
              JSON.parse(sessionDetails.data)?.SessionID &&
              JSON.parse(sessionDetails.data)?.CurrentState === "InProgress" ? (
                <Button
                  onClick={() => {
                    if (!joinClick) {
                      getCurrentQuestion();
                      setJoinClick(false);
                    }
                  }}
                  customClassName={
                    !joinClick && isConnectedToServer
                      ? styles.button
                      : styles.buttonDisabled
                  }
                >
                  Join Game
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (ready) {
                      startGame();
                    }
                  }}
                  customClassName={
                    ready ? styles.button : styles.buttonDisabled
                  }
                >
                  Start
                </Button>
              )}
            </div>
          ) : (
            <div></div>
          )}
          {sessionDetails &&
          sessionDetails.data &&
          isJSONString(sessionDetails.data) &&
          JSON.parse(sessionDetails.data)?.SessionID &&
          JSON.parse(sessionDetails.data)?.CurrentState === "InProgress" ? (
            <div></div>
          ) : (
            <div className={styles.wait}>
              {sessionDetails && sessionDetails.success ? (
                <>
                  <div>Waiting for players to join</div>
                  <div className={styles.users}>
                    {activeUsers &&
                      Array.isArray(activeUsers) &&
                      activeUsers.map((userDetails, index) => {
                        if (userDetails.userID === credentials.data.userID)
                          return null;

                        const shortenedDesignation =
                          userDetails.designation.substring(0, 3);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: "6em" }}
                            animate={{ opacity: 1, x: "0" }}
                            exit={{ opacity: 0, x: "-6rem" }}
                            transition={{ duration: 0.8, damping: 10 }}
                            className={styles.userbadge}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={userDetails.designation}
                          >
                            {shortenedDesignation}
                          </motion.div>
                        );
                      })}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {sessionDetails?.message ? sessionDetails.message : ""}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Tooltip id="my-tooltip" />
    </motion.div>
  );
};

export default AdminGameLanding;
