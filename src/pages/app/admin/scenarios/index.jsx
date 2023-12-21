import React, { useEffect, useState } from "react";
import PageContainer from "../../../../components/ui/pagecontainer/index.jsx";
import styles from "./scenarios.module.css";
import Button from "../../../../components/common/button/index.jsx";
import Pagination from "../../../../components/ui/pagination/index.jsx";
import Checkbox from "../../../../components/ui/checkbox/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { generateGUID, isJSONString } from "../../../../utils/common.js";
import { getScenarioByPage } from "../../../../store/app/admin/scenario/scenario.js";
import { formatDateString } from "../../../../utils/helper.js";
import { useNavigate } from "react-router-dom";

const Scenarios = () => {
  const [pageCount, setPageCount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { credentials } = useSelector((state) => state.login);
  const { scenarioByPage } = useSelector((state) => state.scenarios);

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
    navigate("/createscenarios");
  };

  return (
    <PageContainer>
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label>Scenario</label>
        </div>
        <div className={styles.right}>
          <img src="./images/scenario.png" />
          <div className={styles.buttonContainer}>
            <Button onClick={navigateTo}>Create New</Button>
          </div>
        </div>
      </div>

      {/* Scenario Table:: start */}
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
              JSON.parse(scenarioByPage.data)?.ScenarioDetails.map(
                (scenario, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <Checkbox />
                      </td>
                      <td>{index + 1}</td>
                      <td>{scenario.ScenarioName}</td>
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
        {scenarioByPage && scenarioByPage.success && scenarioByPage.data && (
          <div className={styles.paginationContainer}>
            <Pagination
              totalCount={JSON.parse(scenarioByPage.data)?.TotalCount}
              pageNumber={pageNumber}
              countPerPage={pageCount}
              onPageChange={(pageNumber) => {
                const data = {
                  pageNumber: pageNumber,
                  pageCount: pageCount,
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
      {/* Scenario Table:: end */}
    </PageContainer>
  );
};

export default Scenarios;
