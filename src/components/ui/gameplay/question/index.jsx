import React, { useCallback, useEffect, useState } from "react";
import styles from "./question.module.css";
import SmallCountDown from "../smallcountdown";
import Button from "../../../common/button";
import { useSelector, useDispatch } from "react-redux";
import Countdown from "react-countdown";
import { submitAnswerDetails } from "../../../../store/app/user/answers/postAnswer";
import { getNextQuestionDetails } from "../../../../store/app/user/questions/getNextQuestion";
import { generateGUID } from "../../../../utils/common";
import { toast } from "react-toastify";

const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    return <span className={styles.countdown}>0 : 0</span>;
  } else {
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return (
      <span className={styles.countdown}>
        {paddedMinutes} : {paddedSeconds}
      </span>
    );
  }
};

const CountDown = ({ duration = 5000 }) => {
  return (
    <Countdown
      date={Date.now() + duration}
      renderer={renderer}
      autoStart={true}
      zeroPadDays={3}
    />
  );
};

const Question = () => {
  const [startedAt, setStartedAt] = useState(Math.floor(Date.now() / 1000));

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const dispatch = useDispatch();

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);

  const { questionDetails } = useSelector((state) => state.getNextQuestion);
  const { answerDetails, loading } = useSelector((state) => state.postAnswer);

  console.log("questionDetails", questionDetails);

  useEffect(() => {
    setStartedAt(Math.floor(Date.now() / 1000));
  }, []);

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
      answerID: selectedAnswer.AnswerID,
      score: selectedAnswer.Score,
      startedAt: startedAt.toString(),
      finishedAt: Math.floor(Date.now() / 1000).toString(),
      duration: "",
      isAnswerDeligated:
        questionDetails?.data?.QuestionDetails?.IsUserDecisionMaker,
      delegatedUserID: questionDetails?.data?.QuestionDetails
        ?.IsUserDecisionMaker
        ? credentials.data.userID
        : "",
      isOptimal: selectedAnswer.IsOptimalAnswer,
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

  // useEffect(() => {
  //   if (answerDetails === undefined || answerDetails === null) return;

  //   if (answerDetails.success) {
  //     fetchNextQuestion();
  //   } else if (answerDetails.success === false) {
  //     //retry after fail
  //     answerSubmit();
  //   }
  // }, [answerDetails]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      setSelectedAnswer(null);
      setStartedAt(Math.floor(Date.now() / 1000));
    } else if (questionDetails.success === false) {
      //retry after fail
      fetchNextQuestion();
    }
  }, [questionDetails]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>Make a decision</div>
        <div>
          {questionDetails &&
            questionDetails.data &&
            questionDetails.data.QuestionDetails &&
            questionDetails.data.QuestionDetails.Duration && (
              <div className={styles.smallCountContainer}>
                <div></div>
                <SmallCountDown
                  height={16}
                  width={16}
                  duration={
                    Number(questionDetails.data.QuestionDetails.Duration) * 1000
                  }
                  loops={1}
                  reverse={true}
                  inverse={false}
                />
              </div>
            )}
          {questionDetails &&
            questionDetails.data &&
            questionDetails.data.QuestionDetails &&
            questionDetails.data.QuestionDetails.Duration && (
              <div className={styles.timer}>
                Time Left to Vote{" "}
                <CountDown
                  duration={
                    Number(questionDetails.data.QuestionDetails.Duration) * 1000
                  }
                />
                min
              </div>
            )}
        </div>
      </div>
      {questionDetails?.data?.QuestionDetails?.QuestionNo}
      <div className={styles.questionContainer}>
        <div>
          {questionDetails?.data?.QuestionDetails?.QuestionNo
            ? questionDetails?.data?.QuestionDetails?.QuestionNo
            : 0}
          .
        </div>
        <div className={styles.question}>
          {questionDetails &&
            questionDetails.data &&
            questionDetails.data.QuestionDetails &&
            questionDetails.data.QuestionDetails.QuestionText && (
              <div>{questionDetails.data.QuestionDetails.QuestionText}</div>
            )}
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.answerContainer}>
          {questionDetails &&
            questionDetails.data &&
            questionDetails.data.AnswerDetails &&
            Array.isArray(questionDetails.data.AnswerDetails) &&
            questionDetails.data.AnswerDetails.map((item, index) => {
              return (
                <div
                  className={`${styles.answer} ${
                    selectedAnswer?.AnswerID === item?.AnswerID
                      ? styles.selected
                      : ""
                  }`}
                  key={index}
                  onClick={() => {
                    setSelectedAnswer(item);
                  }}
                >
                  {String.fromCharCode(64 + (index + 1))}. {item.AnswerID}
                </div>
              );
            })}
        </div>
        <div className={styles.buttonContainer}>
          <Button customClassName={styles.button} onClick={answerSubmit}>
            Vote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Question;