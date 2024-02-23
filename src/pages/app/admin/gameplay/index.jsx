import React, { useCallback, useEffect, useRef, useState } from "react";
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
import TeamMembers from "../../../../components/teammembers/index.jsx";
import Nudges from "../../../../components/nudges/index.jsx";
import { TIMER_STATES } from "../../../../constants/timer.js";
import IntroMedia from "../../../../components/intromedia/index.jsx";
import { Tooltip } from "react-tooltip";
import { resetSessionDetailsState } from "../../../../store/app/user/session/getSession.js";
import Progress from "../../../../components/progress";
import { getCurrentTimeStamp } from "../../../../utils/helper.js";
import momentTimezone from "moment-timezone";
import DOMPurify from "dompurify";
import { setProgressImageData } from "../../../../store/local/gameplay.js";
import { toPng, toSvg } from "html-to-image";

const DecisionTree = ({ onCancel = () => {} }) => {
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);
  const { instanceProgress, loading } = useSelector(
    (state) => state.getInstanceProgress
  );

  const dispatch = useDispatch();

  console.log("instanceProgress", instanceProgress);

  useEffect(() => {
    if (sessionDetails?.data) {
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
    }
  }, []);

  return (
    <div className={"modal_content"} style={{ width: "80vw", height: "85vh" }}>
      <div className={"modal_header"}>
        <div>Decision Tree</div>
        <div>
          <svg className="modal_crossIcon" onClick={onCancel}>
            <use xlinkHref={"sprite.svg#crossIcon"} />
          </svg>
        </div>
      </div>
      <div className={"modal_description"} style={{ marginBottom: "2rem" }}>
        {!loading &&
        instanceProgress &&
        instanceProgress.data &&
        instanceProgress.data.GameIntro ? (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(instanceProgress.data.GameIntro),
            }}
          ></div>
        ) : (
          ""
        )}
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
  const [decisionDetails, setDecisionDetails] = useState([]);
  const [showDecision, setShowDecision] = useState(false);
  const [nextQuestionFetched, setNextQuestionFetched] = useState(false);
  const [showVotes, setShowVotes] = useState(false);
  const [callNextQuestion, setCallNextQuestion] = useState(false);
  const [position, setPosition] = useState(0);
  const [countdown, setcoundown] = useState(TIMER_STATES.STOP);
  const [duration, setDuration] = useState(0);
  const [initGlobaTimeOffset, setInitGlobaTimeOffset] = useState(null);
  const [MediaShown, setMediaShown] = useState(false);

  const [showDecisionTree, setShowDecisionTree] = useState(false);
  const [showIntroMedia, setShowIntroMedia] = useState(false);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alerRef = useRef();

  const { answerDetails, loading } = useSelector((state) => state.postAnswer);

  const handlePageUnload = () => {
    localStorage.setItem("refresh", true);
  };

  window.addEventListener("beforeunload", handlePageUnload);

  useEffect(() => {
    console.log("refresh", localStorage.getItem("refresh"));

    if (localStorage.getItem("refresh") === "true") {
      dispatch(resetNextQuestionDetailsState());
      dispatch(resetAnswerDetailsState());
      dispatch(resetInstanceProgressByIDState());
      console.log("refresh called");
      navigate(`/game/${JSON.parse(sessionDetails.data).InstanceID}`);
      dispatch(resetSessionDetailsState());
      localStorage.setItem("refresh", false);
    }
  }, [localStorage.getItem("refresh")]);

  useEffect(() => {
    const handleVotingDetails = (votesDetails) => {
      console.log("votesDetails", votesDetails);
      if (!votesDetails) return;

      if (votesDetails.decisionDisplayType === PlayingStates.VotingInProgress) {
        setCurrentState(PlayingStates.VotingInProgress);
        if (votesDetails.votes) {
          setVoteDetails(votesDetails.votes);
        }
        if (votesDetails.decisionVote) {
          setDecisionDetails(votesDetails.decisionVote);
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
        if (votesDetails.decisionVote) {
          setDecisionDetails(votesDetails.decisionVote);
        }
        setNextQuestionFetched(false);
        setShowVotes(false);
      } else if (
        votesDetails.decisionDisplayType === PlayingStates.DecisionInProgress
      ) {
        setCurrentState(PlayingStates.DecisionInProgress);
        if (votesDetails.votes) {
          setVoteDetails(votesDetails.votes);
        }
        if (votesDetails.decisionVote) {
          setDecisionDetails(votesDetails.decisionVote);
        }
        setShowVotes(false);
        setNextQuestionFetched(false);
      } else if (
        votesDetails.decisionDisplayType === PlayingStates.DecisionCompleted
      ) {
        setCurrentState(PlayingStates.DecisionCompleted);
        if (votesDetails.votes) {
          setVoteDetails(votesDetails.votes);
        }
        if (votesDetails.decisionVote) {
          setDecisionDetails(votesDetails.decisionVote);
        }
        setShowVotes(true);
        setNextQuestionFetched(false);
      }
    };

    signalRService.GetVotingDetails(handleVotingDetails);

    return () => {
      signalRService.GetVotingDetailsOff(handleVotingDetails);
    };
  }, []);

  useEffect(() => {
    if (alerRef.current) {
      const divRect = alerRef.current.getBoundingClientRect();
      const topPosition = divRect.bottom + window.scrollY - 40;
      setPosition(topPosition);
    }
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
        var node = document.getElementById("progressmeter");
        if (node) {
          toPng(node, {
            filter: (node) => {
              return node.tagName !== "i";
            },
          })
            .then(function (dataUrl) {
              dispatch(setProgressImageData(dataUrl));
            })
            .catch(function (error) {
              console.error("cannot set setProgressImageData!", error);
            });
        }

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

    if (!sessionDetails?.data) return;

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

  const onQuestionSkip = useCallback(() => {
    if (sessionDetails?.data) {
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        InstanceID: sessionData.InstanceID,
        UserID: credentials.data.userID,
        UserRole: credentials.data.role,
        QuestionID: questionDetails.data.QuestionDetails.QuestionID,
        GlobalTimer: "",
        QuestionTimer: getCurrentTimeStamp(),
        TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ActionType: "QuestionMediaSkip",
      };

      console.log("SkipMediaInvoke", data);

      signalRService.SkipMediaInvoke(data);
    }
  }, [sessionDetails, credentials, questionDetails]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      let duration = Number(questionDetails.data.QuestionDetails.Duration);
      setDuration(duration);

      if (callNextQuestion) {
        setNextQuestionFetched(true);
        setSelectedAnswer(null);
        // setAdminState("MakeDecision");
        setShowDecision(false);
        setVoteDetails([]);
        setCurrentState(PlayingStates.VotingInProgress);
        setStartedAt(Math.floor(Date.now() / 1000));
        setCallNextQuestion(false);
        setDecisionDetails([]);
      } else {
        if (questionDetails?.data?.HubLiveData) {
          let hublivedata = questionDetails?.data?.HubLiveData;

          if (isJSONString(questionDetails?.data?.HubLiveData)) {
            hublivedata = JSON.parse(questionDetails?.data?.HubLiveData);
          }

          let currentState = PlayingStates.VotingInProgress;
          let currentQuestionSubmitted = false;

          if (
            questionDetails?.data?.QuestionDetails?.QuestionID ===
            hublivedata.questionID
          ) {
            setNextQuestionFetched(true);
            setSelectedAnswer(null);
            setStartedAt(Math.floor(Date.now() / 1000));
            setCallNextQuestion(false);
            setShowDecision(false);

            currentState = hublivedata?.decisionDisplayType;

            //checking if admin made decision
            if (Array.isArray(hublivedata.decisionVote)) {
              hublivedata.decisionVote.forEach((answersubmitDetails) => {
                answersubmitDetails.votersInfo.forEach((userDetails) => {
                  if (userDetails.userID === credentials.data.userID) {
                    currentQuestionSubmitted = true;
                  }
                });
              });
            }

            if (currentState === PlayingStates.DecisionCompleted) {
              setShowVotes(true);
              setcoundown(TIMER_STATES.START);
            } else {
              setcoundown(TIMER_STATES.STOP);
              setShowVotes(false);
            }

            if (hublivedata.votes) {
              setVoteDetails(hublivedata.votes);
            }

            if (hublivedata.decisionVote) {
              setDecisionDetails(hublivedata.decisionVote);
            }

            setCurrentState(currentState);
          } else {
            setNextQuestionFetched(true);
            setSelectedAnswer(null);
            // setAdminState("MakeDecision");
            setShowDecision(false);
            setVoteDetails([]);
            setCurrentState(PlayingStates.VotingInProgress);
            setStartedAt(Math.floor(Date.now() / 1000));
            setCallNextQuestion(false);
            setDecisionDetails([]);
          }
        } else {
          setNextQuestionFetched(true);
          setSelectedAnswer(null);
          // setAdminState("MakeDecision");
          setShowDecision(false);
          setVoteDetails([]);
          setCurrentState(PlayingStates.VotingInProgress);
          setStartedAt(Math.floor(Date.now() / 1000));
          setCallNextQuestion(false);
          setDecisionDetails([]);
        }

        if (questionDetails?.data?.HubTimerData) {
          let HubTimerData = questionDetails?.data?.HubTimerData;
          if (isJSONString(questionDetails?.data?.HubTimerData)) {
            HubTimerData = JSON.parse(questionDetails?.data?.HubTimerData);
          }

          if (HubTimerData?.GlobalTimer) {
            var timestampForTimezone = momentTimezone
              .tz(HubTimerData.TimeZone)
              .valueOf();

            let offset =
              Number(timestampForTimezone) - Number(HubTimerData?.GlobalTimer);

            offset = offset / 1000;

            setInitGlobaTimeOffset(offset);
          }

          if (questionDetails?.data?.HubTimerData) {
            let HubTimerData = questionDetails?.data?.HubTimerData;
            if (isJSONString(questionDetails?.data?.HubTimerData)) {
              HubTimerData = JSON.parse(questionDetails?.data?.HubTimerData);
            }

            if (
              HubTimerData.QuestionID ===
              questionDetails?.data?.QuestionDetails?.QuestionID
            ) {
              const prev = Number(HubTimerData.QuestionTimer);

              var timestampForTimezone = momentTimezone
                .tz(HubTimerData.TimeZone)
                .valueOf();

              let offset = Number(timestampForTimezone) - prev;

              offset = offset / 1000; //seconds

              console.log("offset", offset);

              if (prev) {
                console.log("duration for question before", duration);

                duration = Math.max(0, duration - offset);

                console.log("duration for question after", duration);

                setMediaShown(true);
              }
            }
          }
        }
      }

      if (!questionDetails?.data?.QuestionDetails?.QuestionIntroMediaURL) {
        onQuestionSkip();
      }
    } else if (questionDetails.success === false) {
    }
  }, [questionDetails]);

  useEffect(() => {
    if (callNextQuestion) {
      if (sessionDetails?.data) {
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
    }
  }, [callNextQuestion]);

  const getOptionByAnswerId = (answerid) => {
    if (
      questionDetails &&
      questionDetails.data &&
      questionDetails.data.AnswerDetails &&
      Array.isArray(questionDetails.data.AnswerDetails)
    ) {
      const obj = questionDetails.data.AnswerDetails.find((option) => {
        return option.AnswerID === answerid;
      });

      return obj;
    } else {
      return null;
    }
  };

  const NextQuestionInvoke = useCallback(() => {
    if (selectedAnswer) {
      if (!sessionDetails.data) return;
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        sessionID: sessionData.SessionID,
        instanceID: sessionData.InstanceID,
        scenarioID: sessionData.ScenarioID,
        userID: credentials.data.userID,
        questionID: questionDetails?.data?.QuestionDetails?.QuestionID,
        questionNo:
          questionDetails?.data?.QuestionDetails?.QuestionNo.toString(),
        answerID: selectedAnswer.AnswerID,
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

      console.log("selectedAnswer", data);

      dispatch(submitAnswerDetails(data));
    } else {
      console.log("decisionDetails", decisionDetails);
      console.log("questionDetails", questionDetails);

      //new validation to do

      let decisionCount = 0;

      decisionDetails.forEach((answerDetails) => {
        if (
          answerDetails.votersInfo &&
          Array.isArray(answerDetails.votersInfo)
        ) {
          let isDeciderDecsionAnswer = false;
          if (answerDetails.answer === "NA" || answerDetails.answer === "na")
            return;
          answerDetails.votersInfo.forEach((userDetails) => {
            if (userDetails.userID) {
              isDeciderDecsionAnswer = true;
            }
          });
          if (isDeciderDecsionAnswer) {
            decisionCount++;
          }
        }
      });

      console.log("decisionCount", decisionCount);

      if (decisionCount === 0) {
        toast.success("Please select an option");
      } else if (decisionCount === 1) {
        const sessionData = JSON.parse(sessionDetails.data);

        const option = getOptionByAnswerId(decisionDetails[0].answer);

        if (option) {
          const data = {
            sessionID: sessionData.SessionID,
            instanceID: sessionData.InstanceID,
            scenarioID: sessionData.ScenarioID,
            userID: credentials.data.userID,
            questionID: questionDetails?.data?.QuestionDetails?.QuestionID,
            questionNo:
              questionDetails?.data?.QuestionDetails?.QuestionNo.toString(),
            answerID: option.AnswerID,
            score: option?.Score,
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
            isOptimal: option?.IsOptimalAnswer,
            currentState: "InProgress",
            requester: {
              requestID: generateGUID(),
              requesterID: credentials.data.userID,
              requesterName: credentials.data.userName,
              requesterType: credentials.data.role,
            },
          };

          console.log("notselectedAnswer", data);

          dispatch(submitAnswerDetails(data));
        }
      } else if (decisionCount > 1) {
        toast.success("Please select an option");
      }
    }
  }, [sessionDetails, credentials, decisionDetails, selectedAnswer]);

  useEffect(() => {
    if (answerDetails === null || answerDetails === undefined) return;
    if (answerDetails.success) {
      if (!isJSONString(sessionDetails.data)) return;
      if (!sessionDetails?.data) return;
      const sessionData = JSON.parse(sessionDetails.data);

      if (answerDetails?.data?.NextQuestionID) {
        const data = {
          InstanceID: sessionData.InstanceID,
          UserID: credentials.data.userID,
          UserRole: credentials.data.role,
          ActionType: "NextQuestion",
          Message: "Success",
        };

        signalRService.ProceedToNextQuestionInvoke(data);
      } else if (
        answerDetails.data.IsPlayCompleted ||
        answerDetails.data.NextQuestionID === ""
      ) {
        const data = {
          InstanceID: sessionData.InstanceID,
          UserID: credentials.data.userID,
          ActionType: "IsCompleted",
          Message: "Success",
        };

        signalRService.ProceedToNextQuestionInvoke(data);
      }

      dispatch(resetAnswerDetailsState());
      setSelectedAnswer(null);

      // const data = {
      //   InstanceID: sessionData.InstanceID,
      //   SessionID: sessionData.SessionID,
      //   UserID: credentials.data.userID,
      //   UserName: credentials.data.userName,
      //   ActionType: "AdminDeciderDecision",

      //   Message: "Admin decision",

      //   QuestionID: questionDetails?.data?.QuestionDetails?.QuestionID,
      //   AnswerID: selectedAnswer.AnswerID,
      // };

      // console.log("send vote data", data);

      // signalRService.SendVotes(data);

      // if (
      //   answerDetails.data.IsPlayCompleted ||
      //   answerDetails.data.NextQuestionID === ""
      // ) {
      //   const data = {
      //     InstanceID: sessionData.InstanceID,
      //     UserID: credentials.data.userID,
      //     ActionType: "IsCompleted",
      //     Message: "Success",
      //   };

      //   dispatch(resetAnswerDetailsState());
      //   setSelectedAnswer({});

      //   signalRService.ProceedToNextQuestionInvoke(data);
      // } else {
      //   setAdminState("RevealDecision");
      //   setShowDecision(true);
      //   setSelectedAnswer({});
      // }
    }
  }, [answerDetails]);

  useEffect(() => {
    if (currentState === PlayingStates.VotingInProgress) {
      setcoundown(TIMER_STATES.STOP);
    } else if (currentState === PlayingStates.VotingCompleted) {
      setcoundown(TIMER_STATES.STOP);
    } else if (currentState === PlayingStates.DecisionCompleted) {
      setDuration(30); //30 seconds
      setcoundown(TIMER_STATES.START);
      setStartedAt(Math.floor(Date.now() / 1000));
    } else {
      setcoundown(TIMER_STATES.STOP);
    }
  }, [currentState]);

  const showAlertMessage = useCallback(() => {
    toast.success("Time is up, Please make a decision", {
      containerId: "alert_messages",
      className: "notification",
      position: "top-right",
      style: {
        top: `${position}px`,
        borderRight: "0.4rem solid #ffb600",
      },
      closeButton: false,
      autoClose: 3000,
      icon: false,
    });
  }, [position]);

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
          <div>Introduction</div>
          <div>
            {questionDetails?.data?.GameIntro ? (
              <p
                className={
                  questionDetails?.data?.GameIntro.length <= 260
                    ? styles.displayInline
                    : ""
                }
                // data-tooltip-id="objective-tooltip"
                // data-tooltip-content={questionDetails?.data?.GameIntro}
                dangerouslySetInnerHTML={{
                  __html: questionDetails?.data?.GameIntro,
                }}
              >
                {/* {questionDetails?.data?.GameIntro} */}
              </p>
            ) : (
              ""
            )}
          </div>
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
            <CountDown initialTimestamp={initGlobaTimeOffset} />
          </div>
          <div className={styles.vertical_line}></div>
          <div className={styles.score}>
            <Progress
              progress={
                questionDetails?.data?.ScorePercentage
                  ? Number(questionDetails?.data?.ScorePercentage)
                  : 0
              }
              scoreMaster={
                questionDetails?.data?.ScoreMaster
                  ? questionDetails?.data?.ScoreMaster
                  : []
              }
            />
          </div>
        </div>
      </div>
      <div
        className={styles.mainContent}
        style={{ backgroundImage: 'url("/images/user_background.png")' }}
      >
        <div className={styles.left}>
          <div>
            <svg
              className={styles.pause}
              onClick={() => {
                setShowIntroMedia(true);
              }}
            >
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
                  Duration={duration}
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
                  onNextQuestion={NextQuestionInvoke}
                  Votes={votesDetails}
                  decisionDetails={decisionDetails}
                  showVotes={showVotes}
                  setShowVotes={setShowVotes}
                  setShowDecision={setShowDecision}
                  showDecision={showDecision}
                  delegatedTo={
                    questionDetails?.data?.QuestionDetails?.DelegatedTo
                  }
                  onAdminDecisionCompleteDefault={showAlertMessage}
                  countdown={countdown}
                  MediaShown={MediaShown}
                />
              )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.notification}>
            <div ref={alerRef}>
              <svg id="alert_messages">
                <use xlinkHref={"sprite.svg#notifcation"} />
              </svg>
            </div>

            <div></div>
          </div>
          <div className={styles.accordian}>
            <Nudges />
            <TeamMembers />
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

      {showIntroMedia && questionDetails?.data?.IntroMediaURL && (
        <ModalContainer>
          <IntroMedia
            onCancel={() => {
              setShowIntroMedia(false);
            }}
            mediaURL={questionDetails?.data?.IntroMediaURL}
            description={questionDetails?.data?.GameIntro}
            mediaType={questionDetails?.data?.IntroFileType}
          />
        </ModalContainer>
      )}

      <Tooltip
        id="objective-tooltip"
        place="top-start"
        style={{ backgroundColor: "rgb(0, 0, 0)", color: "#fff" }}
      />
    </motion.div>
  );
};

export default GamePlay;
