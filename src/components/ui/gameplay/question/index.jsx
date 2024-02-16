import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import styles from "./question.module.css";
import SmallCountDown from "../smallcountdown";
import Button from "../../../common/button";

import VideoController from "../../../media/videocontroller";
import AudioController from "../../../media/audiocontroller";

import { PlayingStates } from "../../../../constants/playingStates";
import { TIMER_STATES } from "../../../../constants/timer";
import PDFPreview from "../../../preview/pdfpreview";
import { Tooltip } from "react-tooltip";
import { signalRService } from "../../../../services/signalR";
import { useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";
import ImageController from "../../../media/imagecontroller";
import { getCurrentTimeStamp } from "../../../../utils/helper";

const Timer = ({ Duration, onExpire = () => {}, status = "start" }) => {
  const [expiryTimestamp, setExpiryTimestamp] = useState(new Date());
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: onExpire,
  });

  // console.log("status", status);
  // console.log("time ", minutes, seconds);

  useEffect(() => {
    const currentTimeInIndia = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    if (status === "pause") {
      pause();
    } else if (status === "start") {
      const time = new Date(currentTimeInIndia);
      time.setSeconds(time.getSeconds() + Duration);
      restart(time);
    }
    const time = new Date(currentTimeInIndia);
    time.setSeconds(time.getSeconds() + Duration);
    setExpiryTimestamp(time);
  }, [status, Duration]);

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return (
    <span className={styles.countdown}>
      {paddedMinutes} : {paddedSeconds}
    </span>
  );
};

const Question = ({
  Duration = 10,
  QuestionNo = 0,
  QuestionText = "",
  Options = [],
  selectedAnswer = null,
  setSelectedAnswer = () => {},
  QuestionIntroMediaURL = "",
  MediaType = "Video",
  CurrentState = PlayingStates.VotingInProgress,
  onAnswerSubmit = () => {},
  isAdmin = false,
  IsDecisionMaker = false,
  isCurrentQuestionVotted = false,
  isCurrentDecisionVotted = false,

  onDecisionSubmit = () => {},
  Votes = [],
  decisionDetails = [],
  onNextQuestion = () => {},
  showVotes = false,
  delegatedTo = "",
  onComplete = () => {},
  onDecisionCompleteDefault = () => {},
  onAdminDecisionCompleteDefault = () => {},
  countdown = TIMER_STATES.STOP,
  MediaShown = false,
}) => {
  const [mediaShownOnce, setMediaShownOnce] = useState(false);
  const [showMedia, setShowMedia] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [timerStatus, setTimerStatus] = useState("start");

  let CustomButtonRender = null;
  const countDownRef = useRef();

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);

  const getDecisionCount = useCallback(() => {
    let decisionCount = 0;

    decisionDetails.forEach((answerDetails) => {
      if (answerDetails.votersInfo && Array.isArray(answerDetails.votersInfo)) {
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

    return decisionCount;
  }, [decisionDetails]);

  let mediaTypeText = "";

  if (MediaType === "Video" && QuestionIntroMediaURL) {
    mediaTypeText = "Replay Video";
  } else if (MediaType === "Audio" && QuestionIntroMediaURL) {
    mediaTypeText = "Replay Audio";
  } else if (
    (MediaType === "pdf" || MediaType === "Pdf") &&
    QuestionIntroMediaURL
  ) {
    mediaTypeText = "show PDF";
  } else if (
    MediaType === "Image" ||
    MediaType === "image" ||
    MediaType === "png" ||
    MediaType === "jpg" ||
    MediaType === "jpeg"
  ) {
    mediaTypeText = "show Image";
  }

  if (CurrentState === PlayingStates.VotingInProgress) {
    if (isAdmin) {
      CustomButtonRender = (
        <div className={styles.buttonContainer}>
          <div
            onClick={() => {
              if (MediaType) {
                setShowMedia(true);
                setShowSkip(false);
              }
            }}
          >
            {MediaType && QuestionIntroMediaURL ? (
              <svg className={styles.repeatIcon}>
                <use xlinkHref={"sprite.svg#repeat"} />
              </svg>
            ) : null}
            {mediaTypeText}
          </div>
          <div className={styles.label}>Voting in Progress ...</div>
        </div>
      );
    } else {
      if (isCurrentQuestionVotted) {
        CustomButtonRender = (
          <div className={styles.buttonContainer}>
            <div></div>
            <Button customClassName={styles.buttonDisabled}>
              Waiting for Votes
            </Button>
          </div>
        );
      } else {
        CustomButtonRender = (
          <div className={styles.buttonContainer}>
            <div
              onClick={() => {
                if (MediaType) {
                  setShowMedia(true);
                  setShowSkip(false);
                }
              }}
            >
              {MediaType && QuestionIntroMediaURL ? (
                <svg className={styles.repeatIcon}>
                  <use xlinkHref={"sprite.svg#repeat"} />
                </svg>
              ) : null}
              {mediaTypeText}
            </div>
            <Button customClassName={styles.button} onClick={onAnswerSubmit}>
              Vote
            </Button>
          </div>
        );
      }
    }
  } else if (CurrentState === PlayingStates.VotingCompleted) {
    if (isAdmin) {
      CustomButtonRender = (
        <div className={styles.buttonContainer}>
          <div></div>
          <div className={styles.makeDecision}>
            <div className={styles.label}>
              Voting Complete - Waiting for Descision
            </div>
            <Button
              customStyle={{ marginLeft: "4rem" }}
              customClassName={styles.buttonDisabled}
            >
              Make Decision
            </Button>
          </div>
        </div>
      );
    } else {
      if (IsDecisionMaker) {
        CustomButtonRender = (
          <div className={styles.buttonContainer}>
            <div></div>
            <Button customClassName={styles.button} onClick={onDecisionSubmit}>
              Select Decision
            </Button>
          </div>
        );
      } else {
        CustomButtonRender = (
          <div className={styles.buttonContainer}>
            <div></div>
            <Button customClassName={styles.buttonDisabled}>
              Waiting for Votes
            </Button>
          </div>
        );
      }
    }
  } else if (CurrentState === PlayingStates.DecisionInProgress) {
    if (isAdmin) {
      CustomButtonRender = (
        <div className={styles.buttonContainer}>
          <div></div>
          <div className={styles.makeDecision}>
            <div className={styles.label}>
              Voting Completed - Waiting for Descision
            </div>
            <Button
              customStyle={{ marginLeft: "4rem" }}
              customClassName={styles.buttonDisabled}
            >
              Make Decision
            </Button>
          </div>
        </div>
      );
    } else {
      if (IsDecisionMaker) {
        if (isCurrentDecisionVotted) {
          CustomButtonRender = (
            <div className={styles.buttonContainer}>
              <div></div>
              <Button customClassName={styles.buttonDisabled}>
                Waiting for Next Question
              </Button>
            </div>
          );
        } else {
          CustomButtonRender = (
            <div className={styles.buttonContainer}>
              <div></div>
              <Button
                customClassName={styles.button}
                onClick={onDecisionSubmit}
              >
                Select Decision
              </Button>
            </div>
          );
        }
      } else {
        CustomButtonRender = (
          <div className={styles.buttonContainer}>
            <div></div>
            <Button customClassName={styles.buttonDisabled}>
              Waiting for Votes
            </Button>
          </div>
        );
      }
    }
  } else if (CurrentState === PlayingStates.DecisionCompleted) {
    if (isAdmin) {
      CustomButtonRender = (
        <div className={styles.buttonContainer}>
          {getDecisionCount() === 0 ? (
            <div>Decision is not Made </div>
          ) : getDecisionCount() === 1 ? (
            <div>Decision Made by {delegatedTo} </div>
          ) : (
            <div>Decision Made by {delegatedTo}s </div>
          )}
          <Button customClassName={styles.button} onClick={onNextQuestion}>
            Approve & Next Question
          </Button>
        </div>
      );
    } else {
      CustomButtonRender = (
        <div className={styles.buttonContainer}>
          <div></div>
          <Button customClassName={styles.buttonDisabled}>
            Wait for Next Question
          </Button>
        </div>
      );
    }
  } else {
    CustomButtonRender = (
      <div className={styles.buttonContainer}>
        <div
          onClick={() => {
            if (MediaType) {
              setShowMedia(true);
              setShowSkip(false);
            }
          }}
        >
          {MediaType && QuestionIntroMediaURL ? (
            <svg className={styles.repeatIcon}>
              <use xlinkHref={"sprite.svg#repeat"} />
            </svg>
          ) : null}
          {mediaTypeText}
        </div>
        <Button customClassName={styles.button} onClick={onAnswerSubmit}>
          Vote
        </Button>
      </div>
    );
  }

  const getVotesDetailsById = useCallback(
    (answerId) => {
      return Votes.find((answer) => answer.answer === answerId) || null;
    },
    [Votes]
  );

  const getDecisionDetailsById = useCallback(
    (answerId, delegatedTo) => {
      const answerObject =
        decisionDetails.find((answer) => answer.answer === answerId) || null;

      if (
        answerObject &&
        answerObject.votersInfo &&
        Array.isArray(answerObject.votersInfo)
      ) {
        let isDelegated = false;

        answerObject.votersInfo.forEach((votesDetails) => {
          if (votesDetails.designation === delegatedTo) {
            isDelegated = true;
          }
        });

        return isDelegated;
      } else {
        return false;
      }
    },
    [decisionDetails, delegatedTo]
  );

  const getDeciderDecisionById = useCallback(
    (answerId) => {
      return (
        decisionDetails.find((answer) => answer.answer === answerId) || null
      );
    },
    [decisionDetails]
  );

  useEffect(() => {
    if (MediaShown) {
      setMediaShownOnce(true);
      setShowMedia(false);
    }
  }, [MediaShown]);

  useEffect(() => {
    setShowSkip(false);
    if (MediaType && QuestionIntroMediaURL) {
      setMediaShownOnce(false);
      setShowMedia(true);
    }
  }, [QuestionText, QuestionNo, MediaType, QuestionIntroMediaURL]);

  useEffect(() => {
    console.log("countdown", countdown);
    if (!mediaShownOnce && QuestionIntroMediaURL) {
      setTimerStatus("pause");
    } else {
      if (countdown === TIMER_STATES.STOP) {
        setTimerStatus("pause");
      } else if (countdown === TIMER_STATES.START) {
        setTimerStatus("start");
      } else if (countdown === TIMER_STATES.PAUSE) {
        setTimerStatus("pause");
      }
    }
  }, [countdown, mediaShownOnce, QuestionIntroMediaURL]);

  useEffect(() => {
    const skipMedia = (data) => {
      if (data.actionType && data.actionType === "QuestionMediaSkip") {
        if (!mediaShownOnce) {
          setMediaShownOnce(true);
        }
        setShowMedia(false);
      }
    };
    signalRService.SkipMediaListener(skipMedia);

    return () => {
      signalRService.SkipMediaOff(skipMedia);
    };
  }, []);

  const skipInvoke = useCallback(() => {
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      InstanceID: sessionData.InstanceID,
      UserID: credentials.data.userID,
      UserRole: credentials.data.role,
      QuestionID: questionDetails.data.QuestionDetails.QuestionID,
      GlobalTimer: "",
      QuestionTimer: getCurrentTimeStamp(),
      ActionType: "QuestionMediaSkip",
    };

    signalRService.SkipMediaInvoke(data);
  }, [sessionDetails, credentials, questionDetails]);

  const completeInvoke = useCallback(() => {
    console.log("completeInvoke called ");
    if (isAdmin) {
      onAdminDecisionCompleteDefault();
    } else {
      if (!IsDecisionMaker) {
        onComplete();
      } else {
        if (
          CurrentState === PlayingStates.VotingInProgress ||
          CurrentState === PlayingStates.UserVote
        ) {
          onComplete();
        } else {
          if (
            CurrentState === PlayingStates.VotingCompleted ||
            CurrentState === PlayingStates.DecisionInProgress
          ) {
            onDecisionCompleteDefault();
          }
        }
      }
    }
  }, [
    isAdmin,
    IsDecisionMaker,
    CurrentState,
    onAdminDecisionCompleteDefault,
    onComplete,
    onDecisionCompleteDefault,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>Make a decision</div>
        <div>
          <div className={styles.smallCountContainer}>
            <div></div>
            <SmallCountDown
              height={16}
              width={16}
              duration={Duration}
              loops={1}
              reverse={true}
              inverse={false}
              isPaused={
                QuestionIntroMediaURL && !mediaShownOnce
                  ? true
                  : countdown === TIMER_STATES.START
                  ? false
                  : true
              }
              QuestionNo={QuestionNo}
            />
          </div>

          <div className={styles.timer}>
            Time Left to Vote{" "}
            <Timer
              Duration={Duration / 1000 <= 0.5 ? 0.5 : Duration / 1000}
              onExpire={() => {
                completeInvoke();
              }}
              status={timerStatus}
            />
            min
          </div>
        </div>
      </div>
      <div className={styles.questionContainer}>
        <div>{QuestionNo}.</div>
        <div className={styles.question}>
          {QuestionText && (
            <div dangerouslySetInnerHTML={{ __html: QuestionText }}></div>
          )}
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.answerContainer}>
          {Options &&
            Array.isArray(Options) &&
            Options.map((item, index) => {
              return (
                <div
                  className={`${styles.answer} ${
                    selectedAnswer?.AnswerID === item?.AnswerID
                      ? styles.selected
                      : selectedAnswer
                      ? ""
                      : getDecisionDetailsById(item?.AnswerID, delegatedTo) &&
                        CurrentState === PlayingStates.DecisionCompleted
                      ? styles.selected
                      : ""
                  }`}
                  key={index}
                  onClick={() => {
                    setSelectedAnswer(item);
                  }}
                >
                  <div>
                    {String.fromCharCode(64 + (index + 1))}. {item.AnswerText}
                  </div>
                  <div className={styles.vote}>
                    {showVotes &&
                      Votes &&
                      Array.isArray(Votes) &&
                      Votes.length > 0 &&
                      getVotesDetailsById(item?.AnswerID) &&
                      getVotesDetailsById(item?.AnswerID).voteCount > 0 && (
                        <div className={styles.voteCount}>
                          {`${
                            getVotesDetailsById(item?.AnswerID).voteCount === 1
                              ? "1 Vote"
                              : `${
                                  getVotesDetailsById(item?.AnswerID).voteCount
                                } Votes`
                          } `}
                        </div>
                      )}
                    {showVotes &&
                      decisionDetails &&
                      Array.isArray(decisionDetails) &&
                      decisionDetails.length > 0 &&
                      getDeciderDecisionById(item?.AnswerID) &&
                      getDeciderDecisionById(item?.AnswerID).userName.map(
                        (username, index) => {
                          const shortenedDesignation = username.substring(0, 3);
                          return (
                            <div
                              className={styles.userbadge}
                              data-tooltip-id="des-tooltip"
                              data-tooltip-content={username}
                              key={index}
                            >
                              {shortenedDesignation}
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              );
            })}
        </div>
        {CustomButtonRender}
      </div>
      {showMedia && QuestionIntroMediaURL && (
        <div className={styles.mediaContainer}>
          <div>Incoming Media</div>
          <div>
            {MediaType === "Video" && QuestionIntroMediaURL ? (
              <VideoController
                videoUrl={QuestionIntroMediaURL}
                showButton={isAdmin ? true : mediaShownOnce ? true : false}
                onButtonClick={() => {
                  if (isAdmin) {
                    if (mediaShownOnce) {
                      setShowMedia(false);
                    } else {
                      skipInvoke();
                    }
                  } else {
                    if (mediaShownOnce) {
                      setShowMedia(false);
                    }
                  }
                }}
              />
            ) : (MediaType === "pdf" || MediaType === "Pdf") &&
              QuestionIntroMediaURL ? (
              <div>
                <PDFPreview
                  pdfUrl={QuestionIntroMediaURL}
                  customStyles={styles.canvas}
                  scale={0.5}
                  onLoad={() => {
                    setShowSkip(true);
                  }}
                />
                {showSkip ? (
                  isAdmin ? (
                    <div
                      className={styles.skipContainer}
                      style={{
                        backgroundImage: 'url("./images/grey_strip.png")',
                      }}
                    >
                      <Button
                        onClick={() => {
                          if (mediaShownOnce) {
                            setShowMedia(false);
                          } else {
                            skipInvoke();
                          }
                        }}
                      >
                        Skip
                      </Button>
                    </div>
                  ) : mediaShownOnce ? (
                    <div
                      className={styles.skipContainer}
                      style={{
                        backgroundImage: 'url("./images/grey_strip.png")',
                      }}
                    >
                      <Button
                        onClick={() => {
                          setShowMedia(false);
                        }}
                      >
                        Skip
                      </Button>
                    </div>
                  ) : null
                ) : null}
              </div>
            ) : MediaType === "Audio" && QuestionIntroMediaURL ? (
              <AudioController
                audioUrl={QuestionIntroMediaURL}
                showButton={isAdmin ? true : mediaShownOnce ? true : false}
                onButtonClick={() => {
                  if (isAdmin) {
                    if (mediaShownOnce) {
                      setShowMedia(false);
                    } else {
                      skipInvoke();
                    }
                  } else {
                    if (mediaShownOnce) {
                      setShowMedia(false);
                    }
                  }
                }}
              />
            ) : (MediaType === "Image" ||
                MediaType === "image" ||
                MediaType === "png" ||
                MediaType === "jpg" ||
                MediaType === "jpeg") &&
              QuestionIntroMediaURL ? (
              <ImageController
                imageUrl={QuestionIntroMediaURL}
                showButton={isAdmin ? true : mediaShownOnce ? true : false}
                onButtonClick={() => {
                  if (isAdmin) {
                    if (mediaShownOnce) {
                      setShowMedia(false);
                    } else {
                      skipInvoke();
                    }
                  } else {
                    if (mediaShownOnce) {
                      setShowMedia(false);
                    }
                  }
                }}
              />
            ) : null}
          </div>
        </div>
      )}

      <Tooltip id="des-tooltip" />
    </div>
  );
};

export default Question;
