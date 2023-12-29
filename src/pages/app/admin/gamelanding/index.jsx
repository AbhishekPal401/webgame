import React, { useCallback, useEffect, useState } from "react";
import styles from "./gamelanding.module.css";
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
  const [ready, setReady] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);

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
    };

    await signalRService.joinSession(data);
  }, [sessionDetails, credentials]);

  useEffect(() => {
    //signalR connection initiated and joining room
    const startConnection = async () => {
      try {
        // Start the SignalR connection
        await signalRService.startConnection();
      } catch (error) {
        console.error("Error during connection ", error);
      }
    };

    startConnection();
  }, []);

  useEffect(() => {
    const startJoiningRoom = async () => {
      try {
        await joinRoom();

        signalRService.connectedUsers((users) => {
          console.log("ConnectedUsers", users);
          setConnectedUsers(users);
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

    startJoiningRoom();
  }, [sessionDetails]);

  //get session details by id api call
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
    if (connectedUsers && connectedUsers.length >= 2) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [connectedUsers]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      navigate("/intro");
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
              onClick={() => {
                if (ready) {
                  startGame();
                }
              }}
              customClassName={ready ? styles.button : styles.buttonDisabled}
            >
              Start
            </Button>
          </div>
          <div className={styles.wait}>
            <div>Waiting for players to join</div>
            <div className={styles.users}>
              {connectedUsers &&
                Array.isArray(connectedUsers) &&
                connectedUsers.map((userString, index) => {
                  if (userString === credentials.data.userName) return null;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: "6em" }}
                      animate={{ opacity: 1, x: "0" }}
                      exit={{ opacity: 0, x: "-6rem" }}
                      transition={{ duration: 0.8, damping: 10 }}
                      className={styles.userbadge}
                    >
                      {userString[0]}
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserHomePage;
