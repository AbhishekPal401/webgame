import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./gameplay.module.css";
import { motion } from "framer-motion";
import CountDown from "../../../../components/ui/countdown";
import Question from "../../../../components/ui/gameplay/question";
import { useDispatch, useSelector } from "react-redux";
import { signalRService } from "../../../../services/signalR";
import { generateGUID, isJSONString } from "../../../../utils/common";
import { toast } from "react-toastify";
import { PlayingStates } from "../../../../constants/playingStates";
import DecisionLoader from "../../../../components/loader/decisionloader";
import {
  resetAnswerDetailsState,
  submitAnswerDetails,
} from "../../../../store/app/user/answers/postAnswer";
import {
  getNextQuestionDetails,
  resetNextQuestionDetailsState,
} from "../../../../store/app/user/questions/getNextQuestion";
import { resetSessionDetailsState } from "../../../../store/app/user/session/getSession";
import {
  getInstanceProgressyById,
  resetInstanceProgressByIDState,
} from "../../../../store/app/admin/gameinstances/getInstanceProgress";
import { useNavigate } from "react-router-dom";

import RealTimeTree from "../../../../components/trees/realtime";
import Loader from "../../../../components/loader";
import ModalContainer from "../../../../components/modal";
import { setActiveUsers } from "../../../../store/local/gameplay";
import TeamMembers from "../../../../components/teammembers";
import { TIMER_STATES } from "../../../../constants/timer";
import IntroMedia from "../../../../components/intromedia";
import { Tooltip } from "react-tooltip";
import Progress from "../../../../components/progress";
import { getCurrentTimeStamp } from "../../../../utils/helper";
import momentTimezone from "moment-timezone";
import DOMPurify from "dompurify";

const DecisionTree = ({ onCancel = () => {} }) => {
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);
  const { instanceProgress, loading } = useSelector(
    (state) => state.getInstanceProgress
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isJSONString(sessionDetails.data)) {
      if (sessionDetails?.data) {
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
          <RealTimeTree
            data={instanceProgress.data.Summary}
            userType="normal"
          />
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
  const [currentState, setCurrentState] = useState(PlayingStates.UserVote);
  const [currentQuestionSubmitted, setCurrentQuestionSubmitted] =
    useState(false);
  const [currentDecisionSubmitted, setCurrentDecisionSubmitted] =
    useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDecision, setIsDecision] = useState(false);
  const [nextQuestionFetched, setNextQuestionFetched] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [callNextQuestion, setCallNextQuestion] = useState(false);
  const [showDecisionTree, setShowDecisionTree] = useState(false);
  const [position, setPosition] = useState(0);
  const [countdown, setCoundown] = useState(TIMER_STATES.STOP);
  const [duration, setDuration] = useState(0);
  const [initGlobaTimeOffset, setInitGlobaTimeOffset] = useState(null);
  const [MediaShown, setMediaShown] = useState(false);
  const [message, setMessage] = useState("");

  const [showIntroMedia, setShowIntroMedia] = useState(false);

  const { questionDetails, loading: questionLoading } = useSelector(
    (state) => state.getNextQuestion
  );
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);
  const { answerDetails, loading } = useSelector((state) => state.postAnswer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const alerRef = useRef();

  const handlePageUnload = () => {
    localStorage.setItem("refresh", true);
  };

  window.addEventListener("beforeunload", handlePageUnload);

  useEffect(() => {
    console.log("refresh", localStorage.getItem("refresh"));

    if (localStorage.getItem("refresh") === "true") {
      // Navigate to the specific page

      dispatch(resetNextQuestionDetailsState());
      dispatch(resetAnswerDetailsState());
      dispatch(resetSessionDetailsState());
      dispatch(resetInstanceProgressByIDState());
      navigate("/");
      localStorage.setItem("refresh", false);
    }
  }, [localStorage.getItem("refresh")]);

  useEffect(() => {
    if (alerRef.current) {
      const divRect = alerRef.current.getBoundingClientRect();
      const topPosition = divRect.bottom + window.scrollY - 40;
      setPosition(topPosition);
    }
  }, []);

  useEffect(() => {
    const handleVotingDetails = (votesDetails) => {
      console.log("votesDetails", votesDetails);

      if (!votesDetails) return;

      if (votesDetails.decisionDisplayType === PlayingStates.VotingInProgress) {
        let currentQuestionSubmitted = false;

        if (Array.isArray(votesDetails.votes)) {
          votesDetails.votes.forEach((answersubmitDetails) => {
            answersubmitDetails.votersInfo.forEach((userDetails) => {
              if (userDetails.userID === credentials.data.userID) {
                currentQuestionSubmitted = true;
              }
            });
          });
        }

        setCurrentQuestionSubmitted(currentQuestionSubmitted);

        setCurrentState(PlayingStates.VotingInProgress);
        setShowModal(false);
        setNextQuestionFetched(false);
        setCurrentDecisionSubmitted(false);
      } else if (
        votesDetails.decisionDisplayType === PlayingStates.VotingCompleted
      ) {
        setCurrentState(PlayingStates.VotingCompleted);
        setShowModal(true);
        setNextQuestionFetched(false);
        setCurrentDecisionSubmitted(false);
      } else if (
        votesDetails.decisionDisplayType === PlayingStates.DecisionInProgress
      ) {
        setCurrentState(PlayingStates.DecisionInProgress);
        setShowModal(false);
        setNextQuestionFetched(false);
        if (votesDetails.decisionVote) {
          let isSubmitted = false;

          votesDetails.decisionVote.forEach((voteDetails) => {
            voteDetails.votersInfo.forEach((voter) => {
              if (voter.userID === credentials.data.userID) {
                isSubmitted = true;
              }
            });
          });

          setCurrentDecisionSubmitted(isSubmitted);
        } else {
          setCurrentDecisionSubmitted(false);
        }
      } else if (
        votesDetails.decisionDisplayType === PlayingStates.DecisionCompleted
      ) {
        setCurrentState(PlayingStates.DecisionCompleted);
        setShowModal(false);
        setNextQuestionFetched(false);
      }
    };

    signalRService.GetVotingDetails(handleVotingDetails);

    signalRService.connectedUsers((users) => {
      console.log("ConnectedUsers", users);
      dispatch(setActiveUsers(users));
    });

    return () => {
      signalRService.GetVotingDetailsOff(handleVotingDetails);
    };
  }, []);

  useEffect(() => {
    if (message) {
      const htmlElement = <div dangerouslySetInnerHTML={{ __html: message }} />;
      toast.success(htmlElement, {
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
    }
    setMessage("");
  }, [message, position]);

  useEffect(() => {
    const showNotifications = (ActionType, Message) => {
      if (ActionType === "Nudges") {
        if (Message) {
          console.log("message", Message);
          setMessage(Message);
        }
      }
    };

    signalRService.NotificationListener(showNotifications);
    signalRService.NotificationListenerOff(showNotifications);

    return () => {
      signalRService.NotificationListenerOff(showNotifications);
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

  const answerSubmit = useCallback(
    (decider = false) => {
      if (!selectedAnswer) {
        toast.error("Please select an answer");
        return;
      }

      if (sessionDetails?.data) {
        const sessionData = JSON.parse(sessionDetails.data);

        const data = {
          sessionID: sessionData.SessionID,
          instanceID: sessionData.InstanceID,
          scenarioID: sessionData.ScenarioID,
          userID: credentials.data.userID,
          questionID: questionDetails?.data?.QuestionDetails?.QuestionID,
          questionNo:
            questionDetails?.data?.QuestionDetails?.QuestionNo.toString(),
          answerID: selectedAnswer?.AnswerID,
          score: selectedAnswer?.Score,
          startedAt: startedAt.toString(),
          finishedAt: Math.floor(Date.now() / 1000).toString(),
          duration: "",
          IsDeciderDecision: decider ? true : false,
          IsAdminDecision: false,
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
      }
    },
    [credentials, questionDetails, selectedAnswer, startedAt, sessionDetails]
  );

  const defaultAnswerSubmit = useCallback(
    (decider = false) => {
      if (!sessionDetails?.data) return;
      const sessionData = JSON.parse(sessionDetails.data);

      const data = {
        sessionID: sessionData.SessionID,
        instanceID: sessionData.InstanceID,
        scenarioID: sessionData.ScenarioID,
        userID: credentials.data.userID,
        questionID: questionDetails?.data?.QuestionDetails?.QuestionID,
        questionNo:
          questionDetails?.data?.QuestionDetails?.QuestionNo.toString(),
        answerID: "NA",
        score: "0",
        startedAt: startedAt.toString(),
        finishedAt: Math.floor(Date.now() / 1000).toString(),
        duration: "",
        IsDeciderDecision: decider ? true : false,
        IsAdminDecision: false,
        isAnswerDeligated:
          questionDetails?.data?.QuestionDetails?.IsUserDecisionMaker,
        delegatedUserID: questionDetails?.data?.QuestionDetails
          ?.IsUserDecisionMaker
          ? credentials.data.userID
          : "",
        isOptimal: false,
        currentState: "InProgress",
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(submitAnswerDetails(data));
    },
    [credentials, questionDetails, startedAt, sessionDetails]
  );

  const voteDefault = useCallback(() => {
    defaultAnswerSubmit(false);
  }, [defaultAnswerSubmit]);

  const onDecisionCompleteDefault = useCallback(() => {
    setIsDecision(true);
    defaultAnswerSubmit(true);
  }, [defaultAnswerSubmit]);

  const decisionSubmit = useCallback(() => {
    setIsDecision(true);
    answerSubmit(true);
  }, [answerSubmit]);

  const voteSubmit = useCallback(() => {
    answerSubmit(false);
  }, [answerSubmit]);

  useEffect(() => {
    if (questionDetails === null || questionDetails === undefined) return;

    if (questionDetails.success) {
      let duration = Number(questionDetails.data.QuestionDetails.Duration);

      if (callNextQuestion) {
        setNextQuestionFetched(true);
        setSelectedAnswer(null);
        setStartedAt(Math.floor(Date.now() / 1000));
        setCurrentQuestionSubmitted(false);
        setCallNextQuestion(false);
        setCurrentState(PlayingStates.UserVote);
        setShowModal(false);
        setIsDecision(false);
      } else {
        if (questionDetails?.data?.HubLiveData) {
          let hublivedata = questionDetails?.data?.HubLiveData;

          if (isJSONString(questionDetails?.data?.HubLiveData)) {
            hublivedata = JSON.parse(questionDetails?.data?.HubLiveData);
          }

          let currentState = PlayingStates.UserVote;
          let currentQuestionSubmitted = false;
          let currentDecisionSubmitted = false;

          if (
            questionDetails?.data?.QuestionDetails?.QuestionID ===
            hublivedata.questionID
          ) {
            setNextQuestionFetched(true);
            setSelectedAnswer(null);
            setStartedAt(Math.floor(Date.now() / 1000));
            setCallNextQuestion(false);

            currentState = hublivedata?.decisionDisplayType;

            if (Array.isArray(hublivedata.votes)) {
              hublivedata.votes.forEach((answersubmitDetails) => {
                answersubmitDetails.votersInfo.forEach((userDetails) => {
                  if (userDetails.userID === credentials.data.userID) {
                    // currentState = PlayingStates.VotingCompleted;
                    currentQuestionSubmitted = true;
                  }
                });
              });
            }

            //checking if user made decision
            if (Array.isArray(hublivedata.decisionVote)) {
              hublivedata.decisionVote.forEach((answersubmitDetails) => {
                answersubmitDetails.votersInfo.forEach((userDetails) => {
                  if (userDetails.userID === credentials.data.userID) {
                    currentState = PlayingStates.DecisionCompleted;
                    currentDecisionSubmitted = true;
                  }
                });
              });
            }

            if (currentState === PlayingStates.VotingCompleted) {
              setShowModal(true);
            } else {
              setShowModal(false);
            }

            setCurrentState(currentState);
            setCurrentQuestionSubmitted(currentQuestionSubmitted);

            setIsDecision(false);
          } else {
            setNextQuestionFetched(true);
            setSelectedAnswer(null);
            setStartedAt(Math.floor(Date.now() / 1000));
            setCurrentState(PlayingStates.UserVote);
            setCurrentQuestionSubmitted(false);
            setShowModal(false);
            setIsDecision(false);
            setCallNextQuestion(false);
          }
        } else {
          setNextQuestionFetched(true);
          setSelectedAnswer(null);
          setStartedAt(Math.floor(Date.now() / 1000));
          setCurrentQuestionSubmitted(false);
          setCallNextQuestion(false);
          setCurrentState(PlayingStates.UserVote);
          setShowModal(false);
          setIsDecision(false);
        }

        //for global timer
        if (questionDetails?.data?.HubTimerData) {
          let HubTimerData = questionDetails?.data?.HubTimerData;
          if (isJSONString(questionDetails?.data?.HubTimerData)) {
            HubTimerData = JSON.parse(questionDetails?.data?.HubTimerData);
          }

          if (HubTimerData?.GlobalTimer) {
            var timestampForTimezone = momentTimezone
              .tz(HubTimerData.TimeZone)
              .valueOf();

            console.log(" current time", timestampForTimezone);
            console.log(" prev time", HubTimerData?.GlobalTimer);

            let offset =
              Number(timestampForTimezone) - Number(HubTimerData?.GlobalTimer);

            offset = offset / 1000;

            console.log("offset for global timer", offset);

            setInitGlobaTimeOffset(offset);
          }
        }
        //for question timer

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

            console.log("offset for question timer", offset);

            if (prev) {
              console.log("duration for question before", duration);

              duration = Math.max(0, duration - offset);

              console.log("duration for question after", duration);

              setMediaShown(true);
            }
          }
        }
      }

      setDuration(duration);
    }
  }, [questionDetails, callNextQuestion]);

  useEffect(() => {
    if (answerDetails === null || answerDetails === undefined) return;
    if (answerDetails.success && selectedAnswer) {
      if (sessionDetails?.data) {
        const sessionData = JSON.parse(sessionDetails.data);

        const data = {
          InstanceID: sessionData.InstanceID,
          SessionID: sessionData.SessionID,
          UserID: credentials.data.userID,
          UserName: credentials.data.userName,
          UserRole: credentials.data.role,
          ActionType: isDecision
            ? "DeciderDecision"
            : questionDetails?.data?.QuestionDetails?.IsUserDecisionMaker
            ? "DeciderVote"
            : "UserVote",
          Message: "Voting",

          QuestionID: questionDetails?.data?.QuestionDetails?.QuestionID,
          AnswerID: selectedAnswer.AnswerID,
        };

        console.log("send vote data", data);

        signalRService.SendVotes(data);

        console.log("answer data state reset");

        setCurrentQuestionSubmitted(true);
        setSelectedAnswer(null);
        setIsDecision(false);
        dispatch(resetAnswerDetailsState());
      }
    } else if (answerDetails.success && selectedAnswer === null) {
      if (sessionDetails?.data) {
        const sessionData = JSON.parse(sessionDetails.data);

        const data = {
          InstanceID: sessionData.InstanceID,
          SessionID: sessionData.SessionID,
          UserID: credentials.data.userID,
          UserName: credentials.data.userName,
          UserRole: credentials.data.role,
          ActionType: isDecision
            ? "DeciderDecision"
            : questionDetails?.data?.QuestionDetails?.IsUserDecisionMaker
            ? "DeciderVote"
            : "UserVote",
          Message: "Voting",

          QuestionID: questionDetails?.data?.QuestionDetails?.QuestionID,
          AnswerID: "NA",
        };

        console.log("send vote data", data);

        signalRService.SendVotes(data);

        console.log("answer data state reset");

        setCurrentQuestionSubmitted(true);
        setSelectedAnswer(null);
        setIsDecision(false);
        dispatch(resetAnswerDetailsState());
      }
    }
  }, [answerDetails, isDecision]);

  useEffect(() => {
    if (currentState === PlayingStates.UserVote) {
      setCoundown(TIMER_STATES.START);
      setStartedAt(Math.floor(Date.now() / 1000));
    } else if (currentState === PlayingStates.VotingInProgress) {
      if (currentQuestionSubmitted) {
        setCoundown(TIMER_STATES.PAUSE);
      } else {
        setCoundown(TIMER_STATES.START);
        setStartedAt(Math.floor(Date.now() / 1000));
      }
    } else if (currentState === PlayingStates.VotingCompleted) {
      if (questionDetails?.data?.QuestionDetails?.IsUserDecisionMaker) {
        setDuration(30); // 30 seconds
        setCoundown(TIMER_STATES.START);
        setStartedAt(Math.floor(Date.now() / 1000));
      } else {
        setCoundown(TIMER_STATES.PAUSE);
      }
    } else if (currentState === PlayingStates.DecisionInProgress) {
      if (currentDecisionSubmitted) {
        setCoundown(TIMER_STATES.PAUSE);
      }
    } else if (currentState === PlayingStates.DecisionCompleted) {
      setCoundown(TIMER_STATES.PAUSE);
    } else {
      setCoundown(TIMER_STATES.PAUSE);
    }
  }, [
    currentState,
    currentQuestionSubmitted,
    questionDetails,
    currentDecisionSubmitted,
  ]);

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
              ></p>
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
            {/* <div>MIN</div> */}
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
                  onAnswerSubmit={voteSubmit}
                  onDecisionSubmit={decisionSubmit}
                  CurrentState={currentState}
                  isCurrentQuestionVotted={currentQuestionSubmitted}
                  isCurrentDecisionVotted={currentDecisionSubmitted}
                  onComplete={voteDefault}
                  onDecisionCompleteDefault={onDecisionCompleteDefault}
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
            <TeamMembers />
          </div>
        </div>
      </div>

      {showModal &&
        !questionDetails?.data?.QuestionDetails?.IsUserDecisionMaker && (
          <DecisionLoader
            HeaderText={` Waiting for ${questionDetails?.data?.QuestionDetails?.DelegatedTo}'s Final Decision... `}
          />
        )}

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
