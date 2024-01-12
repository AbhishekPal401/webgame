import React, { useCallback, useEffect, useState } from "react";
import styles from "./gameplay.module.css";
import { motion } from "framer-motion";
import CountDown from "../../../../components/ui/countdown";
import Question from "../../../../components/ui/gameplay/question";
import { useDispatch, useSelector } from "react-redux";
import { signalRService } from "../../../../services/signalR";
import { generateGUID, isJSONString } from "../../../../utils/common";
import {
  submitAnswerDetails,
  resetAnswerDetailsState,
} from "../../../../store/app/user/answers/postAnswer";
import { toast } from "react-toastify";
import { PlayingStates } from "../../../../constants/playingStates";
import {
  getNextQuestionDetails,
  resetNextQuestionDetailsState,
} from "../../../../store/app/user/questions/getNextQuestion";
import { useNavigate } from "react-router-dom";
import ModalContainer from "../../../../components/modal";
import RealTimeTree from "../../../../components/trees/realtime";
import Loader from "../../../../components/loader/index.jsx";

import {
  getInstanceProgressyById,
  resetInstanceProgressByIDState,
} from "../../../../store/app/admin/gameinstances/getInstanceProgress.js";

const DecisionTree = ({ onCancel = () => {} }) => {
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);
  const { instanceProgress, loading } = useSelector(
    (state) => state.getInstanceProgress
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isJSONString(sessionDetails.data)) {
      const sessionData = JSON.parse(sessionDetails.data);

      if (sessionData && credentials) {
        const data = {
          instanceID: sessionData.InstanceID,
          userID: credentials.data.userID,
          isAdmin: true,
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
        };

        dispatch(getInstanceProgressyById(data));
      }
    }
  }, []);

  return (
    <div className={"modal_content"} style={{ width: "80vw" }}>
      <div className={"modal_header"}>
        <div>Decision Tree</div>
        <div>
          <svg className="modal_crossIcon" onClick={onCancel}>
            <use xlinkHref={"sprite.svg#crossIcon"} />
          </svg>
        </div>
      </div>
      <div className={"modal_description"} style={{ marginBottom: "2rem" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>

      <div style={{ height: "72vh" }}>
        {!loading &&
        instanceProgress &&
        instanceProgress.data &&
        instanceProgress.data.Summary ? (
          <RealTimeTree data={instanceProgress.data.Summary} />
        ) : (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

const GamePlay = () => {
  const [startedAt, setStartedAt] = useState(Math.floor(Date.now() / 1000));
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [currentState, setCurrentState] = useState(
    PlayingStates.VotingInProgress
  );
  const [votesDetails, setVoteDetails] = useState([]);
  const [nextQuestionFetched, setNextQuestionFetched] = useState(false);
  const [adminState, setAdminState] = useState("MakeDecision");
  const [showVotes, setShowVotes] = useState(false);
  const [callNextQuestion, setCallNextQuestion] = useState(false);
  const [showDecisionTree, setShowDecisionTree] = useState(false);

  const { questionDetails } = useSelector((state) => state.getNextQuestion);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { answerDetails, loading } = useSelector((state) => state.postAnswer);

  useEffect(() => {
    const handleVotingDetails = (votesDetails) => {
      console.log("votesDetails", votesDetails);
      if (!votesDetails) return;

      if (votesDetails.decisionDisplayType === PlayingStates.VotingInProgress) {
        setCurrentState(PlayingStates.VotingInProgress);
        if (votesDetails.votes) {
          setVoteDetails(votesDetails.votes);
        }
        setNextQuestionFetched(false);
        setShowVotes(false);
      } else if (
        votesDetails.decisionDisplayType === PlayingStates.VotingCompleted
      ) {
        setCurrentState(PlayingStates.VotingCompleted);
        if (votesDetails.votes) {
          setVoteDetails(votesDetails.votes);
        }
        setNextQuestionFetched(false);
        setShowVotes(false);
      } else if (
        votesDetails.decisionDisplayType === PlayingStates.DecisionCompleted
      ) {
        setCurrentState(PlayingStates.DecisionCompleted);
        if (votesDetails.votes) {
          setVoteDetails(votesDetails.votes);
        }
        setNextQuestionFetched(false);
      }
    };

    signalRService.GetVotingDetails(handleVotingDetails);

    return () => {
      signalRService.GetVotingDetailsOff(handleVotingDetails);
    };
  }, []);

  useEffect(() => {
    const handleProceedToNextQuestion = (data) => {
      if (
        (data.ActionType === "NextQuestion" ||
          data.actionType === "NextQuestion") &&
        !nextQuestionFetched
      ) {
        setCallNextQuestion(true);
      } else if (
        data.ActionType === "IsCompleted" ||
        data.actionType === "IsCompleted"
      ) {
        navigate("/missioncompleted");
      } else {
        console.log("ProceedToNextQuestionListener ActionType", data);
      }
    };

    signalRService.ProceedToNextQuestionListener(handleProceedToNextQuestion);

    return () => {
      signalRService.ProceedToNextQuestionListenerOff(
        handleProceedToNextQuestion
      );
    };
  }, [nextQuestionFetched]);

  const answerSubmit = useCallback(() => {
    if (!selectedAnswer) {
      toast.error("Please select an answer");
      return;
    }

    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      sessionID: sessionData.SessionID,
      instanceID: sessionData.InstanceID,
      scenarioID: sessionData.ScenarioID,
      userID: credentials.data.userID,
      questionID: questionDetails?.data?.QuestionDetails?.QuestionID,
      questionNo: questionDetails?.data?.QuestionDetails?.QuestionNo.toString(),
      answerID: selectedAnswer?.AnswerID,
      score: selectedAnswer?.Score,
      startedAt: startedAt.toString(),
      finishedAt: Math.floor(Date.now() / 1000).toString(),
      duration: "",
      IsDeciderDecision: false,
      IsAdminDecision: true,
      isAnswerDeligated:
        questionDetails?.data?.QuestionDetails?.IsUserDecisionMaker,
      delegatedUserID: questionDetails?.data?.QuestionDetails
        ?.IsUserDecisionMaker
        ? credentials.data.userID
        : "",
      isOptimal: selectedAnswer?.IsOptimalAnswer,
      currentState: "InProgress",
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };

    dispatch(submitAnswerDetails(data));
  }, [credentials, questionDetails, selectedAnswer, startedAt, sessionDetails]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success && callNextQuestion) {
      setNextQuestionFetched(true);
      setSelectedAnswer(null);
      setAdminState("MakeDecision");
      setVoteDetails([]);
      setCurrentState(PlayingStates.VotingInProgress);
      setStartedAt(Math.floor(Date.now() / 1000));
      setCallNextQuestion(false);
    } else if (questionDetails.success === false) {
    }
  }, [questionDetails]);

  useEffect(() => {
    if (callNextQuestion) {
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        sessionID: sessionData.SessionID,
        scenarioID: sessionData.ScenarioID,
        currentQuestionID: questionDetails?.data?.QuestionDetails?.QuestionID,
        currentQuestionNo: questionDetails?.data?.QuestionDetails?.QuestionNo,
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

      console.log("get next question data", data);

      dispatch(getNextQuestionDetails(data));
    }
  }, [callNextQuestion, callNextQuestion]);

  const NextQuestionInvoke = useCallback(() => {
    if (!isJSONString(sessionDetails.data)) return;
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      InstanceID: sessionData.InstanceID,
      UserID: credentials.data.userID,
      ActionType: "NextQuestion",
      Message: "Success",
    };

    console.log(data);
    signalRService.ProceedToNextQuestionInvoke(data);
  }, [sessionDetails, credentials]);

  useEffect(() => {
    if (answerDetails === null || answerDetails === undefined) return;
    if (answerDetails.success && selectedAnswer) {
      if (
        answerDetails.data.IsPlayCompleted ||
        answerDetails.data.NextQuestionID === ""
      ) {
        if (!isJSONString(sessionDetails.data)) return;
        const sessionData = JSON.parse(sessionDetails.data);

        const data = {
          InstanceID: sessionData.InstanceID,
          UserID: credentials.data.userID,
          ActionType: "IsCompleted",
          Message: "Success",
        };

        console.log(data);
        dispatch(resetAnswerDetailsState());

        signalRService.ProceedToNextQuestionInvoke(data);
      } else {
        setAdminState("RevealDecision");
      }
    }
  }, [answerDetails]);

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
          <div>Cyber security game</div>
        </div>
        <div
          className={styles.header_middle}
          style={{ backgroundImage: 'url("/images/gameplay_header.png")' }}
        >
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
      <div
        className={styles.mainContent}
        style={{ backgroundImage: 'url("/images/user_background.png")' }}
      >
        <div className={styles.left}>
          <div>
            <svg className={styles.pause}>
              <use xlinkHref={"sprite.svg#pause"} />
            </svg>
          </div>
          <div>
            <svg
              className={styles.tree}
              onClick={() => {
                setShowDecisionTree(true);
              }}
            >
              <use xlinkHref={"sprite.svg#tree"} />
            </svg>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.questionContainer}>
            {questionDetails &&
              questionDetails.success &&
              questionDetails.data && (
                <Question
                  isAdmin={
                    credentials.data.role === "1" ||
                    credentials.data.role === "2"
                  }
                  IsDecisionMaker={
                    questionDetails.data.QuestionDetails.IsUserDecisionMaker
                  }
                  Duration={
                    Number(questionDetails.data.QuestionDetails.Duration) * 1000
                  }
                  QuestionNo={questionDetails.data.QuestionDetails.QuestionNo}
                  QuestionText={
                    questionDetails.data.QuestionDetails.QuestionText
                  }
                  Options={questionDetails.data.AnswerDetails}
                  QuestionIntroMediaURL={
                    questionDetails.data.QuestionDetails.QuestionIntroMediaURL
                  }
                  MediaType={questionDetails.data.QuestionDetails.MediaType}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                  onAnswerSubmit={answerSubmit}
                  CurrentState={currentState}
                  adminState={adminState}
                  onNextQuestion={NextQuestionInvoke}
                  Votes={votesDetails}
                  showVotes={showVotes}
                  setShowVotes={setShowVotes}
                />
              )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.notification}>
            <div>
              <svg onClick={() => {}}>
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

      {showDecisionTree && (
        <ModalContainer>
          <DecisionTree
            onCancel={() => {
              setShowDecisionTree(false);
              dispatch(resetInstanceProgressByIDState());
            }}
          />
        </ModalContainer>
      )}
    </motion.div>
  );
};

export default GamePlay;
