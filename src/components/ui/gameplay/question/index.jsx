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
  // const [duration, setDuration] = useState(Duration);

  let CustomButtonRender = null;
  const countDownRef = useRef();

  console.log("countdown", countdown);
  console.log("IsDecisionMaker", IsDecisionMaker);
  console.log("CurrentState", CurrentState);

  if (CurrentState === PlayingStates.VotingInProgress) {
    if (isAdmin) {
      CustomButtonRender = (
        <div className={styles.buttonContainer}>
          <div
            onClick={() => {
              if (MediaType) {
                setShowMedia(true);
              }
            }}
          >
            {MediaType === "Video"
              ? "Replay Video"
              : MediaType === "Audio"
              ? "Replay Audio"
              : ""}
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
                }
              }}
            >
              {MediaType === "Video"
                ? "Replay Video"
                : MediaType === "Audio"
                ? "Replay Audio"
                : ""}
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

      // if (showVotes) {
      //   CustomButtonRender = (
      //     <div className={styles.buttonContainer}>
      //       <div>Decision Made by {delegatedTo}</div>
      //       <Button customClassName={styles.button} onClick={onNextQuestion}>
      //         Next Question
      //       </Button>
      //     </div>
      //   );
      // } else {
      //   if (adminState === "MakeDecision") {
      //     CustomButtonRender = (
      //       <div className={styles.buttonContainer}>
      //         <div></div>
      //         <Button customClassName={styles.button} onClick={onAnswerSubmit}>
      //           Make a Decision
      //         </Button>
      //       </div>
      //     );
      //   } else if (adminState === "RevealDecision") {
      //     CustomButtonRender = (
      //       <div className={styles.buttonContainer}>
      //         <div>Decision Made by {delegatedTo}</div>
      //         <Button
      //           customClassName={styles.button}
      //           onClick={() => {
      //             setShowVotes(true);
      //             setShowDecision(false);
      //           }}
      //         >
      //           Approve
      //         </Button>
      //       </div>
      //     );
      //   }
      // }
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
            }
          }}
        >
          {MediaType === "Video"
            ? "Replay Video"
            : MediaType === "Audio"
            ? "Replay Audio"
            : ""}
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

  useEffect(() => {
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
          {QuestionText && <div>{QuestionText}</div>}
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
                      : getDecisionDetailsById(item?.AnswerID, delegatedTo)
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
                      getVotesDetailsById(item?.AnswerID).userName.map(
                        (username) => {
                          return (
                            <div className={styles.userbadge}>{username}</div>
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
            {MediaType === "Video" ? (
              <VideoController
                videoUrl={QuestionIntroMediaURL}
                onCompleted={() => {
                  if (!mediaShownOnce) {
                    setMediaShownOnce(true);
                  }
                  setShowMedia(false);
                }}
              />
            ) : (
              <AudioController
                audioUrl={QuestionIntroMediaURL}
                onCompleted={() => {
                  if (!mediaShownOnce) {
                    setMediaShownOnce(true);
                  }
                  setShowMedia(false);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
