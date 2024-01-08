import React, { useEffect, useState } from "react";
import PageContainer from "../../../../../components/ui/pagecontainer";
import styles from "./masterlist.module.css";
import Button from "../../../../../components/common/button/index.jsx";
import Pagination from "../../../../../components/ui/pagination/index.jsx";
import Checkbox from "../../../../../components/ui/checkbox/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { generateGUID, isJSONString } from "../../../../../utils/common.js";
import { formatDateString } from "../../../../../utils/helper.js";
import { useNavigate } from "react-router-dom";

const MasterList = () => {

  return (
    <PageContainer>
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label>Master List</label>
        </div>
        <div className={styles.right}>
          <img src="./images/scenario.png" />
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.mainTopContainer}>
          <div className={styles.mainTopLeft}>
            <div className={styles.designationsContainer}>
              <div className={styles.designationsTop}>
                <label>Designations</label>
              </div>
              <div className={styles.designationsBottom}>
                {/* Tab */}
              </div>
            </div>
            <div className={styles.organizationsContainer}>
              <div className={styles.organizationsTop}>
                <label>Organizations</label>
              </div>
              <div className={styles.organizationsBottom}>
                {/* Tab */}
              </div>
            </div>
          </div>
          <div className={styles.mainTopRight}>
            <Button>Add New</Button>
          </div>
        </div>
        <div className={styles.mainBottomContainer}>

        </div>
      </div>

      {/* Scenario Table:: start */}
      {/* <div className={styles.mainTableContainer}>
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
                      <td
                        className={styles.scenarioName}
                        onClick={() => {
                          navigate(`/scenario/updatescenarios/${scenario.ScenarioID}`); 
                        }}
                      >
                        {scenario.ScenarioName}
                      </td>
                      <td 
                        className={styles.scenarioDescription}
                        onClick={() => {
                          navigate(`/questions/${scenario.ScenarioID}`); 
                        }}  
                      >
                        {scenario.Description}
                      </td>
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
      </div> */}
      {/* Scenario Table:: end */}
    </PageContainer>
  );
};

export default MasterList;
