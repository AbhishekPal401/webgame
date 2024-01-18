import React, { memo, useCallback, useEffect, useState } from "react";
import styles from "./question.module.css";
import SmallCountDown from "../smallcountdown";
import Button from "../../../common/button";
import Countdown from "react-countdown";

import VideoController from "../../../media/videocontroller";
import AudioController from "../../../media/audiocontroller";

import { PlayingStates } from "../../../../constants/playingStates";

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

const CountDown = memo(({ duration = 5000 }) => {
  return (
    <Countdown
      key={duration}
      date={Date.now() + duration}
      renderer={renderer}
      autoStart={true}
    />
  );
});

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
  onDecisionSubmit = () => {},
  adminState = "",
  Votes = [],
  decisionDetails = [],
  onNextQuestion = () => {},
  showVotes = false,
  showDecision = false,
  setShowDecision = () => {},
  setShowVotes = () => {},
}) => {
  const [showMedia, setShowMedia] = useState(true);
  const [duration, setDuration] = useState(Duration);

  let CustomButtonRender = null;

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
  } else if (CurrentState === PlayingStates.DecisionCompleted) {
    if (isAdmin) {
      if (showVotes) {
        CustomButtonRender = (
          <div className={styles.buttonContainer}>
            <div>Decision Made by CTO</div>
            <Button customClassName={styles.button} onClick={onNextQuestion}>
              Next Question
            </Button>
          </div>
        );
      } else {
        if (adminState === "MakeDecision") {
          CustomButtonRender = (
            <div className={styles.buttonContainer}>
              <div></div>
              <Button customClassName={styles.button} onClick={onAnswerSubmit}>
                Make a Decision
              </Button>
            </div>
          );
        } else if (adminState === "RevealDecision") {
          CustomButtonRender = (
            <div className={styles.buttonContainer}>
              <div>Decision Made by CTO</div>
              <Button
                customClassName={styles.button}
                onClick={() => {
                  setShowVotes(true);
                  setShowDecision(false);
                }}
              >
                Reveal Votes
              </Button>
            </div>
          );
        }
      }
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
    (answerId) => {
      return (
        decisionDetails.find((answer) => answer.answer === answerId) || null
      );
    },
    [decisionDetails]
  );

  useEffect(() => {
    if (Duration) {
      setDuration(Duration);
    }
  }, [Duration, QuestionText, QuestionNo]);

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
              duration={duration}
              loops={1}
              reverse={true}
              inverse={false}
            />
          </div>

          <div className={styles.timer}>
            Time Left to Vote <CountDown duration={duration} /> min
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
                    {showDecision &&
                      decisionDetails &&
                      Array.isArray(decisionDetails) &&
                      decisionDetails.length > 0 &&
                      getDecisionDetailsById(item?.AnswerID) &&
                      getDecisionDetailsById(item?.AnswerID).userName.map(
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
                  setShowMedia(false);
                }}
              />
            ) : (
              <AudioController
                audioUrl={QuestionIntroMediaURL}
                onCompleted={() => {
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
