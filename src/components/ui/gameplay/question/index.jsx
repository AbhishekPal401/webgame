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
import Countdown from "react-countdown";

import VideoController from "../../../media/videocontroller";
import AudioController from "../../../media/audiocontroller";

import { PlayingStates } from "../../../../constants/playingStates";
import { TIMER_STATES } from "../../../../constants/timer";
import PDFPreview from "../../../preview/pdfpreview";
import { Tooltip } from "react-tooltip";
import { signalRService } from "../../../../services/signalR";
import { useSelector } from "react-redux";

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

const CountDown = memo(
  forwardRef(({ duration = 5000, onComplete = () => {}, QuestionNo }, ref) => {
    const countdownRef = useRef(null);

    // Expose start, stop, and pause functions to Question component
    useImperativeHandle(ref, () => ({
      start: () => countdownRef.current.start(),
      stop: () => countdownRef.current.stop(),
      pause: () => countdownRef.current.pause(),
    }));

    return (
      <Countdown
        ref={countdownRef}
        key={duration}
        date={Date.now() + duration}
        renderer={renderer}
        autoStart={false}
        onComplete={onComplete}
      />
    );
  })
);

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
}) => {
  const [mediaShownOnce, setMediaShownOnce] = useState(false);
  const [showMedia, setShowMedia] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  let CustomButtonRender = null;
  const countDownRef = useRef();

  const { credentials } = useSelector((state) => state.login);
  const { sessionDetails } = useSelector((state) => state.getSession);
  const { questionDetails } = useSelector((state) => state.getNextQuestion);

  let mediaTypeText = "";

  if (MediaType === "Video" && QuestionIntroMediaURL) {
    mediaTypeText = "Replay Video";
  } else if (MediaType === "Audio" && QuestionIntroMediaURL) {
    mediaTypeText = "Replay Audio";
  } else if (
    (MediaType === "pdf" || MediaType === "Pdf") &&
    QuestionIntroMediaURL
  ) {
    mediaTypeText = "Replay PDF";
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
          <div>Decision Made by {delegatedTo}</div>
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
    setShowSkip(false);
    if (MediaType && QuestionIntroMediaURL) {
      setMediaShownOnce(false);
      setShowMedia(true);
    }
  }, [QuestionText, QuestionNo, MediaType, QuestionIntroMediaURL]);

  useEffect(() => {
    let timeoutId;

    if (!mediaShownOnce && QuestionIntroMediaURL) {
      timeoutId = setTimeout(() => {
        countDownRef.current.stop();
      }, 10);
    } else {
      if (countDownRef.current) {
        if (countdown === TIMER_STATES.STOP) {
          timeoutId = setTimeout(() => {
            countDownRef.current.stop();
          }, 10);
        } else if (countdown === TIMER_STATES.START) {
          timeoutId = setTimeout(() => {
            countDownRef.current.start();
          }, 10);
        } else if (countdown === TIMER_STATES.PAUSE) {
          timeoutId = setTimeout(() => {
            countDownRef.current.pause();
          }, 10);
        }
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [countdown, countDownRef.current, mediaShownOnce]);

  useEffect(() => {
    const skipMedia = (data) => {
      console.log("data", data);
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
      QuestionID: questionDetails.data.CurrentQuestionNo.toString(),
      GlobalTimer: "",
      QuestionTimer: Date.now().toString(),
      ActionType: "QuestionMediaSkip",
    };

    signalRService.SkipMediaInvoke(data);
  }, [sessionDetails, credentials, questionDetails]);

  console.log("media", showMedia, MediaType, QuestionIntroMediaURL);

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
            <CountDown
              ref={countDownRef}
              duration={Duration}
              QuestionNo={QuestionNo}
              onComplete={
                isAdmin
                  ? onAdminDecisionCompleteDefault
                  : !IsDecisionMaker
                  ? onComplete
                  : CurrentState === PlayingStates.VotingInProgress ||
                    CurrentState === PlayingStates.UserVote
                  ? onComplete
                  : CurrentState === PlayingStates.VotingCompleted ||
                    CurrentState === PlayingStates.DecisionInProgress
                  ? onDecisionCompleteDefault
                  : () => {}
              }
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
                        (username) => {
                          const shortenedDesignation = username.substring(0, 3);
                          return (
                            <div
                              className={styles.userbadge}
                              data-tooltip-id="des-tooltip"
                              data-tooltip-content={username}
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
            ) : null}
          </div>
        </div>
      )}

      <Tooltip id="des-tooltip" />
    </div>
  );
};

export default Question;
