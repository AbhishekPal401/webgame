import React, { useEffect, useState } from "react";
import styles from "./homepage.module.css";
import Button from "../../../../components/common/button";
import PageContainer from "../../../../components/ui/pagecontainer";
import Pagination from "../../../../components/ui/pagination";
import Checkbox from "../../../../components/ui/checkbox/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { getScenarioByPage } from "../../../../store/app/admin/scenario/scenario.js";
import { getSessionHistoryByType } from "../../../../store/app/admin/session/session.js";
import { generateGUID, isJSONString } from "../../../../utils/common.js";
import { Link } from "react-router-dom";
import { formatDateString } from "../../../../utils/helper.js";
import { useNavigate } from "react-router-dom";
import { dateFormats } from "../../../../constants/date.js";

const Homepage = () => {
  const [pageCount, setPageCount] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usersByPage, loading } = useSelector((state) => state.users);
  const { credentials } = useSelector((state) => state.login);

  const { sessionsHistoryByType } = useSelector(
    (state) => state.sessionHistory
  );
  const { scenarioByPage } = useSelector((state) => state.scenarios);

  useEffect(() => {
    if (credentials) {
      const data = {
        pageNumber: pageNumber,
        pageCount: pageCount,
        type: "recent",
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getSessionHistoryByType(data));
    }
  }, []);

  useEffect(() => {
    if (credentials) {
      const data = {
        pageNumber: pageNumber,
        pageCount: pageCount,
        type: "",
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getScenarioByPage(data));
    }
  }, []);

  useEffect(() => {
    if (scenarioByPage && isJSONString(scenarioByPage?.data)) {
      const newPageNumber = JSON.parse(scenarioByPage?.data)?.CurrentPage;

      if (newPageNumber && typeof newPageNumber === "number") {
        setPageNumber(newPageNumber);
      }
    }
  }, [scenarioByPage]);

  const navigateTo = () => {
    navigate("/scenario/createscenarios");
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.left}>
            <label>Welcome Admin</label>
          </div>
          <div
            className={styles.right}
            style={{ backgroundImage: 'url("./images/binary.png")' }}
          >
            <img src="./images/home.png" alt="Home page background png" />
          </div>
        </div>
        <div className={styles.mainContainer}>
          {/* Session History:: start */}
          <div
            className={styles.sessionHistoryContainer}
            style={{ backgroundImage: 'url("/images/home1.png")' }}
          >
            <h3>Session History</h3>
            <div className={styles.sessionHistoryCardContainer}>
              {sessionsHistoryByType &&
                sessionsHistoryByType.success &&
                sessionsHistoryByType.data &&
                JSON.parse(sessionsHistoryByType.data)?.InstanceDetails.map(
                  (scenario, index) => {
                    return (
                      <div key={index} className={styles.sessionHistoryCard}>
                        <div className={styles.cardTopContainer}>
                          <div className={styles.cardTopContainerLeft}>
                            <h4>{scenario.InstanceName}</h4>
                            <p>Scenario:{scenario.ScenarioName}</p>
                            <p>Status: {scenario.Status}</p>
                          </div>
                          <div className={styles.cardTopContainerRight}></div>
                        </div>
                        <div className={styles.cardBottomContainer}>
                          <div className={styles.cardBottomContainerLeft}>
                            <p>
                              Updated :
                              {formatDateString(
                                scenario.UpdatedAt,
                                dateFormats.DATE_FORMAT_8
                              )}
                            </p>
                          </div>
                          <div className={styles.cardBottomContainerRight}>
                            <Button
                              onClick={() => {
                                if (scenario.Status === "Create") {
                                  navigate(`/game/${scenario.InstanceID}`);
                                }
                              }}
                            >
                              {scenario.Status === "Create"
                                ? "Start"
                                : "Report"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
          {/* Session History:: end */}

          {/* Scenario Table:: start */}
          <div className={styles.scenarioTopContainer}>
            <div className={styles.scenarioContainer}>
              <div className={styles.scenarioContainerLeft}>
                <div>
                  <h3>Scenarios</h3>
                </div>
                <div>
                  <Link to="/scenario">See All</Link>
                </div>
              </div>
              <div className={styles.scenarioContainerRight}>
                <Button onClick={navigateTo}>Create New</Button>
              </div>
            </div>
            <div className={styles.mainTableContainer}>
              <table className={styles.table_content}>
                <thead>
                  <tr>
                    <th></th>
                    <th>#</th>
                    <th>Scenario Name</th>
                    <th>Description</th>
                    <th>Date Created</th>
                    <th>Games Played</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioByPage &&
                    scenarioByPage.success &&
                    scenarioByPage.data &&
                    JSON.parse(scenarioByPage?.data)?.ScenarioDetails.map(
                      (scenario, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <Checkbox />
                            </td>
                            <td>{index + 1}</td>
                            <td
                              className={styles.scenarioName}
                              onClick={() => {
                                navigate(
                                  `/scenario/updatescenarios/${scenario.ScenarioID}`
                                );
                              }}
                            >
                              {scenario.ScenarioName}
                            </td>
                            <td>{scenario.Description}</td>
                            <td>{formatDateString(scenario.CreatedAt)}</td>
                            <td>{scenario.GamesPlayed}</td>
                            <td>{scenario.Status}</td>
                          </tr>
                        );
                      }
                    )}
                </tbody>
              </table>
              {scenarioByPage &&
                scenarioByPage.success &&
                scenarioByPage.data && (
                  <div className={styles.paginationContainer}>
                    <Pagination
                      totalCount={JSON.parse(scenarioByPage?.data)?.TotalCount}
                      pageNumber={pageNumber}
                      countPerPage={pageCount}
                      onPageChange={(pageNumber) => {
                        const data = {
                          pageNumber: pageNumber,
                          pageCount: pageCount,
                          type: "",
                          requester: {
                            requestID: generateGUID(),
                            requesterID: credentials.data.userID,
                            requesterName: credentials.data.userName,
                            requesterType: credentials.data.role,
                          },
                        };

                        dispatch(getScenarioByPage(data));
                      }}
                    />
                  </div>
                )}
            </div>
          </div>

          {/* Scenario Table:: end */}
        </div>
      </div>
    </PageContainer>
  );
};

export default Homepage;
