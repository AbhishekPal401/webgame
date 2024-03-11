import React, { useCallback, useEffect, useState } from "react";
import styles from "./missioncompleted.module.css";
import Button from "../../../../components/common/button";
import OptimalTree from "../../../../components/trees/mission";
import SelectedTree from "../../../../components/trees/selectedTree";
import { getInstanceSummaryById } from "../../../../store/app/admin/gameinstances/instanceSummary";
import { getInstanceProgressyById } from "../../../../store/app/admin/gameinstances/getInstanceProgress";
import { useDispatch, useSelector } from "react-redux";
import { generateGUID } from "../../../../utils/common";
import { signalRService } from "../../../../services/signalR";
import { useNavigate } from "react-router-dom";
import { resetNextQuestionDetailsState } from "../../../../store/app/user/questions/getNextQuestion";
import { resetAnswerDetailsState } from "../../../../store/app/user/answers/postAnswer";
import { resetSessionDetailsState } from "../../../../store/app/user/session/getSession";
import { convertSecondsToHMS, formatTime } from "../../../../utils/helper";
import Progress from "../../../../components/progress";
import QuestionLoader from "../../../../components/loader/questionLoader";
import { resetFileStreamState } from "../../../../store/app/admin/fileStream/getFileStream";

const SelectTree = ({ clicked = 0, onSelect = () => {} }) => {
  return (
    <div className={styles.selectTree}>
      <div className={styles.selectButtonContainer}>
        <div
          className={clicked === 0 ? styles.selected : ""}
          onClick={() => {
            onSelect(0);
          }}
        >
          Selected
        </div>
        {/* <div
          className={clicked === 1 ? styles.selected : ""}
          onClick={() => {
            onSelect(1);
          }}
        >
          Optimal
        </div> */}
      </div>
      <div className={styles.line}></div>
    </div>
  );
};

const MissionCompleted = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);
  const { instanceSummary, loading: instanceinstanceSummary } = useSelector(
    (state) => state.instanceSummary
  );
  const { instanceProgress, loading: instanceProgressLoading } = useSelector(
    (state) => state.getInstanceProgress
  );

  // console.log("instanceSummary", instanceSummary);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetNextQuestionDetailsState());
    dispatch(resetFileStreamState());
  }, []);

  useEffect(() => {
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

      dispatch(getInstanceSummaryById(data));
    }
  }, []);

  const resetAll = useCallback(() => {
    dispatch(resetNextQuestionDetailsState());
    dispatch(resetAnswerDetailsState());
    dispatch(resetSessionDetailsState());
    navigate("/");
  }, []);

  useEffect(() => {
    const homescreen = () => {
      resetAll();
    };

    signalRService.HomeScreenListener(homescreen);

    return () => {
      signalRService.HomeScreenListenerOff(homescreen);
    };
  }, [resetAll]);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: 'url("/images/user_background.png")' }}
    >
      <div className={styles.missionContainer}>
        {instanceinstanceSummary || instanceProgressLoading ? (
          <QuestionLoader size={160} />
        ) : (
          <div className={styles.innerCotainer}>
            <div
              className={styles.header}
              style={{ backgroundImage: 'url("/images/particles2.png")' }}
            >
              <div>Mission Accomplished!</div>
              <div>
                Thank You For Taking Part In This Game, We Hope You Have Enjoyed
                It. Here's A Summary Of How You Did.
              </div>
              <div className={styles.details_row}>
                <div>
                  {instanceSummary?.data?.GameInstance
                    ? instanceSummary?.data?.GameInstance
                    : ""}
                </div>
                <div>
                  {instanceSummary?.data?.OrganizationName
                    ? instanceSummary?.data?.OrganizationName
                    : ""}
                </div>
                <div>
                  {instanceSummary?.data?.GameScenario
                    ? instanceSummary?.data?.GameScenario
                    : ""}
                </div>
              </div>
            </div>
            <div className={styles.treeContainer}>
              <SelectTree
                clicked={currentTab}
                onSelect={(value) => {
                  setCurrentTab(value);
                }}
              />
              <div className={styles.tree}>
                {instanceSummary &&
                  instanceSummary.data &&
                  instanceSummary.data.Summary &&
                  instanceProgress &&
                  instanceProgress.data &&
                  instanceProgress.data.Summary && (
                    <SelectedTree
                      data={instanceProgress.data.Summary}
                      userType="admin"
                    />
                  )}
                <div className={styles.right}>
                  <div>Time Spent</div>
                  <div className={styles.circle}>
                    {instanceSummary?.data?.TimeTaken
                      ? convertSecondsToHMS(instanceSummary?.data?.TimeTaken)
                      : ""}{" "}
                  </div>
                  <Progress
                    progress={
                      instanceSummary?.data?.ScorePercentage
                        ? Number(instanceSummary?.data?.ScorePercentage)
                        : 0
                    }
                    scoreMaster={
                      instanceSummary?.data?.ScoreMaster
                        ? instanceSummary?.data?.ScoreMaster
                        : []
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button
                customClassName={styles.end}
                onClick={() => {
                  resetAll();
                }}
              >
                End
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionCompleted;
