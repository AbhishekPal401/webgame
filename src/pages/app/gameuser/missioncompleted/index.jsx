import React, { useEffect, useState } from "react";
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

const SelectTree = ({ clicked = 0, onSelect = () => { } }) => {
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
  const { instanceSummary } = useSelector((state) => state.instanceSummary);
  const { instanceProgress } = useSelector(
    (state) => state.getInstanceProgress
  );

  console.log("instanceSummary", instanceSummary);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      signalRService.MissionCompletedInvoke(sessionData.InstanceID);

      dispatch(getInstanceProgressyById(data));

      dispatch(getInstanceSummaryById(data));
    }
  }, []);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: 'url("/images/user_background.png")' }}
    >
      <div className={styles.missionContainer}>
        <div
          className={styles.header}
          style={{ backgroundImage: 'url("/images/particles2.png")' }}
        >
          <div>Mission Accomplished!</div>
          <div>
            Thank You For Taking Part In This Game, We Hope You Have Enjoyed It.
            Here's A Summary Of How You Did.
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
                <>
                  {currentTab === 0 ? (
                    <SelectedTree
                      data={instanceProgress.data.Summary}
                      userType="normal"
                    />
                  ) : (
                    <OptimalTree data={instanceSummary.data.Summary} />
                  )}
                </>
              )}
            <div className={styles.right}>
              <div>Time Spent</div>
              <div className={styles.circle}>
                {instanceSummary?.data?.TimeTaken
                  ? instanceSummary?.data?.TimeTaken
                  : ""}{" "}
                <span>min</span>
              </div>
              <div>Score</div>
              <div className={styles.circle}>
                {" "}
                {instanceSummary?.data?.IndividualScore
                  ? instanceSummary?.data?.IndividualScore
                  : ""}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {/* <Button customClassName={styles.export}>Export</Button> */}
          <Button
            customClassName={styles.end}
            onClick={() => {
              navigate("/");
            }}
          >
            End
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionCompleted;
