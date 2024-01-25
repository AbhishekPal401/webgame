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
  }, [sessionDetails, credentials]);

  const fetchIntro = useCallback(() => {
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
  }, [sessionDetails, credentials]);

  const joinRoom = useCallback(async () => {
    if (!isJSONString(sessionDetails.data)) return;
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

    console.log("Joining the room...", data);
    await signalRService.joinSession(data);
  }, [sessionDetails, credentials]);

  useEffect(() => {
    const startJoiningRoom = async () => {
      try {
        await joinRoom();

        signalRService.connectedUsers((users) => {
          console.log("ConnectedUsers", users);
          dispatch(setActiveUsers(users));
        });

        signalRService.ReceiveNotification((actionType, message) => {
          console.log("actionType", actionType);
          console.log("message", message);

          if (actionType === "AdminPlayStart") {
            fetchIntro();
          }
        });
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

    if (isConnectedToServer && !isReconnection) {
      startJoiningRoom();
    }
  }, [sessionDetails, isConnectedToServer]);

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
  }, [instanceID]);

  useEffect(() => {
    if (activeUsers && activeUsers.length >= 3) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [activeUsers]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      if (inProgress) {
        navigate("/gameplay");
      } else {
        navigate("/intro");
      }
    } else {
      toast.error(questionDetails.message);
      setJoinClick(false);
    }
  }, [questionDetails]);

  const getCurrentQuestion = async () => {
    if (!isConnectedToServer) return;
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
                customClassName={ready ? styles.button : styles.buttonDisabled}
              >
                Start
              </Button>
            )}
          </div>
          {sessionDetails &&
          sessionDetails.data &&
          isJSONString(sessionDetails.data) &&
          JSON.parse(sessionDetails.data)?.SessionID &&
          JSON.parse(sessionDetails.data)?.CurrentState === "InProgress" ? (
            <div></div>
          ) : (
            <div className={styles.wait}>
              <div>Waiting for players to join</div>
              <div className={styles.users}>
                {activeUsers &&
                  Array.isArray(activeUsers) &&
                  activeUsers.map((userDetails, index) => {
                    if (userDetails.userID === credentials.data.userID)
                      return null;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: "6em" }}
                        animate={{ opacity: 1, x: "0" }}
                        exit={{ opacity: 0, x: "-6rem" }}
                        transition={{ duration: 0.8, damping: 10 }}
                        className={styles.userbadge}
                      >
                        {userDetails.designation}
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminGameLanding;
