import React, { useEffect, useState } from "react";
import PageContainer from "../../../../../components/ui/pagecontainer";
import styles from "./masterlist.module.css";
import Button from "../../../../../components/common/button/index.jsx";
import Pagination from "../../../../../components/ui/pagination/index.jsx";
import Checkbox from "../../../../../components/ui/checkbox/index.jsx";
import ModalContainer from "../../../../../components/modal/index.jsx";
import Input from "../../../../../components/common/input/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { generateGUID, isJSONString } from "../../../../../utils/common.js";
import { formatDateString } from "../../../../../utils/helper.js";
import { useNavigate } from "react-router-dom";
import {
  getDesignationsbyPage,
  resetDesignationState
} from "../../../../../store/app/admin/masters/designations.js";
import {
  getOrganizationsbyPage,
  resetOrganizationState
} from "../../../../../store/app/admin/masters/organizations.js";

const MasterList = () => {

  const [activeTab, setActiveTab] = useState('Designations');
  const [showModal, setShowModal] = useState(null);

  const [pageCount, setPageCount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { credentials } = useSelector((state) => state.login);
  const { designationsByPage } = useSelector((state) => state.designations);
  const { organizationsByPage } = useSelector((state) => state.organizations);

  // useEffect(() => {
  //   if (credentials) {
  //     const data = {
  //       pageNumber: pageNumber,
  //       pageCount: pageCount,
  //       type: "",
  //       requester: {
  //         requestID: generateGUID(),
  //         requesterID: credentials.data.userID,
  //         requesterName: credentials.data.userName,
  //         requesterType: credentials.data.role,
  //       },
  //     };

  //     activeTab === 'Designations'? 
  //        dispatch(getDesignationsbyPage(data)) :
  //       dispatch(getOrganizationsbyPage(data));
  //   }
  // }, [designationsByPage, organizationsByPage]);

  // useEffect(() => {
  //   if (designationsByPage && isJSONString(designationsByPage?.data) && activeTab === 'Designations') {
  //     const newPageNumber = JSON.parse(designationsByPage?.data)?.CurrentPage;

  //     if (newPageNumber && typeof newPageNumber === "number") {
  //       setPageNumber(newPageNumber);
  //     }
  //   } else if (organizationsByPage && isJSONString(organizationsByPage?.data) && activeTab === 'Organizations') {
  //     const newPageNumber = JSON.parse(organizationsByPage?.data)?.CurrentPage;

  //     if (newPageNumber && typeof newPageNumber === "number") {
  //       setPageNumber(newPageNumber);
  //     }
  //   }

  // }, [designationsByPage, organizationsByPage]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
              <div className={styles.designationsTop}
                onClick={() => handleTabClick('Designations')}
              >
                <label
                  style={{
                    color: activeTab === 'Designations' ?
                      'var(--primary)' :
                      'var(--input_label)'
                  }}
                >
                  Designations
                </label>
              </div>
              <div
                className={styles.designationsBottom}
                style={{
                  backgroundColor: activeTab === 'Designations' ?
                    'var(--primary)' :
                    'var(--input_label)'
                }}
              ></div>
            </div>
            <div className={styles.organizationsContainer}
              onClick={() => handleTabClick('Organizations')}

            >
              <div className={styles.organizationsTop}>
                <label
                  style={{
                    color: activeTab === 'Organizations' ?
                      'var(--primary)' :
                      'var(--input_label)'
                  }}
                >
                  Organizations
                </label>
              </div>
              <div
                className={styles.organizationsBottom}
                style={{
                  backgroundColor: activeTab === 'Organizations' ?
                    'var(--primary)' :
                    'var(--input_label)'
                }}
              ></div>
            </div>
          </div>
          <div className={styles.mainTopRight}>
            <Button>Add New</Button>
          </div>
        </div>
        <div className={styles.mainBottomContainer}>
          {/* Master List Table:: start */}
          <div className={styles.mainTableContainer}>
            <table className={styles.table_content}>
              <thead>
                <tr>
                  <th></th>
                  <th>#</th>
                  <th>Designation</th>
                  <th>Description</th>
                  <th>Date Created</th>
                  <th>Scenario</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* {scenarioByPage &&
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
                  )} */}
              </tbody>
            </table>
            {/* {scenarioByPage && scenarioByPage.success && scenarioByPage.data && (
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
            )} */}
          </div>
          {/* Master List Table:: end */}
        </div>
      </div>

      {/* Modal Container :: start*/}

      {showModal && (
        <ModalContainer>
          <div className="modal_content">
            <div className="modal_header">
              <div>Add Group</div>
              <div>
                <svg
                  className="modal_crossIcon"
                  onClick={() => {
                    setShowModal(null);
                    // resetAddGroupData();
                  }}
                >
                  <use xlinkHref={"sprite.svg#crossIcon"} />
                </svg>
              </div>
            </div>
            <div className={styles.modalInputContainer}>
                <Input
                  type="text"
                  customStyle={{ marginTop: '1rem', }}
                  name={"designation"}
                  placeholder="Designation Name"
                />
                <Input
                  type="text"
                  customStyle={{ marginTop: '1rem', }}
                  name={"organization"}
                  placeholder="Organization Name"
                />
            </div>

            <div className="modal_buttonContainer">
              <Button
                buttonType={"cancel"}
                onClick={() => {
                  setShowModal(null);
                  // resetAddGroupData();
                }}
              >
                Cancel
              </Button>
              <Button
                customStyle={{
                  marginLeft: "1rem",
                }}
                // onClick={onAddGroup}
              >
                Add
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}

      {/* Modal Container :: end*/}
    </PageContainer>
  );
};

export default MasterList;
