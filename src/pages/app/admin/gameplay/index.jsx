import React, { useCallback, useEffect, useState } from "react";
import styles from "./gameplay.module.css";
import { motion } from "framer-motion";
import CountDown from "../../../../components/ui/countdown";
import Question from "../../../../components/ui/gameplay/question";
import { useDispatch, useSelector } from "react-redux";
import { signalRService } from "../../../../services/signalR";
import { generateGUID, isJSONString } from "../../../../utils/common";
import { submitAnswerDetails } from "../../../../store/app/user/answers/postAnswer";
import { toast } from "react-toastify";
import { PlayingStates } from "../../../../constants/playingStates";
import { getNextQuestionDetails } from "../../../../store/app/user/questions/getNextQuestion";

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

  const { questionDetails } = useSelector((state) => state.getNextQuestion);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);

  const dispatch = useDispatch();

  const { answerDetails, loading } = useSelector((state) => state.postAnswer);

  console.log("questionDetails", questionDetails);
  console.log("answerDetails", answerDetails);

  const fetchNextQuestion = useCallback(() => {
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

    dispatch(getNextQuestionDetails(data));
  }, [sessionDetails, credentials, questionDetails]);

  useEffect(() => {
    setStartedAt(Math.floor(Date.now() / 1000));
  }, []);

  useEffect(() => {
    signalRService.GetVotingDetails((votesDetails) => {
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
    });

    signalRService.ProceedToNextQuestionListener((data) => {
      if (data.ActionType !== "" && !nextQuestionFetched) {
        fetchNextQuestion();
      } else {
        console.log(
          "ProceedToNextQuestionListener ActionType",
          data.ActionType
        );
      }
    });
  }, []);

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

    if (questionDetails.success) {
      setNextQuestionFetched(true);
      setSelectedAnswer(null);
      setAdminState("MakeDecision");
      setVoteDetails([]);
      setCurrentState(PlayingStates.VotingInProgress);
      setStartedAt(Math.floor(Date.now() / 1000));
    } else if (questionDetails.success === false) {
      // fetchNextQuestion();
    }
  }, [questionDetails]);

  useEffect(() => {
    if (answerDetails === null || answerDetails === undefined) return;
    if (answerDetails.success && selectedAnswer) {
      setAdminState("RevealDecision");
    }
  }, [answerDetails]);

  const NextQuestionInvoke = () => {
    if (!isJSONString(sessionDetails.data)) return;
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      InstanceID: sessionData.InstanceID,
      UserID: credentials.data.userID,
      ActionType: selectedAnswer?.AnswerID,
      Message: "Success",
    };

    signalRService.ProceedToNextQuestionInvoke(data);
  };

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
    </motion.div>
  );
};

export default GamePlay;
