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
import { extractDate, formatDateString } from "../../../../utils/helper.js";
import { useNavigate } from "react-router-dom";
import { dateFormats } from "../../../../constants/date.js";
import {
  deleteScenarioByID,
  resetDeleteScenarioState
} from "../../../../store/app/admin/scenario/deleteScenario.js";
import {
  clearGameInstanceByID,
  resetClearGameInstanceState
} from "../../../../store/app/admin/gameinstances/clearInstanceById.js";
import { toast } from "react-toastify";
import ModalContainer from "../../../../components/modal/index.jsx";

const Homepage = () => {
  const [pageCount, setPageCount] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showClearModal, setShowClearModal] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usersByPage, loading } = useSelector((state) => state.users);
  const { credentials } = useSelector((state) => state.login);

  const { sessionsHistoryByType } = useSelector(
    (state) => state.sessionHistory
  );
  const { scenarioByPage } = useSelector((state) => state.scenarios);
  const { deleteScenarioResponse } = useSelector((state) => state.deleteScenario);
  const { clearGameInstanceByIdResponse } = useSelector((state) => state.clearInstanceById);

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

  useEffect(() => {
    if (deleteScenarioResponse === null || deleteScenarioResponse === undefined) return;

    if (deleteScenarioResponse.success) {
      toast.success(deleteScenarioResponse.message);
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
      dispatch(resetDeleteScenarioState());
      setShowDeleteModal(null);
    } else if (!deleteScenarioResponse.success) {
      toast.error(deleteScenarioResponse.message);
    }
  }, [deleteScenarioResponse]);

  useEffect(() => {
    if (clearGameInstanceByIdResponse === null || clearGameInstanceByIdResponse === undefined) return;

    if (clearGameInstanceByIdResponse.success) {
      // toast.success(clearGameInstanceByIdResponse.message);
      toast.success("Successfully cleared.");
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
      dispatch(resetClearGameInstanceState());
      setShowClearModal(null);
    } else if (!clearGameInstanceByIdResponse.success) {
      toast.error(clearGameInstanceByIdResponse.message);
    }
  }, [clearGameInstanceByIdResponse]);

  const navigateTo = () => {
    navigate("/scenario/createscenarios");
  };

  const handleCheckboxChange = (scenarioID) => {
    const isSelected = selectedCheckboxes.includes(scenarioID);
    const updatedRows = isSelected
      ? selectedCheckboxes.filter((row) => row !== scenarioID)
      : [...selectedCheckboxes, scenarioID];

    setSelectedCheckboxes(updatedRows);
  };

  const onDeleteScenario = () => {
    const data = {
      scenarioID: showDeleteModal.ScenarioID,
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };

    dispatch(deleteScenarioByID(data));
  };

  const onClearInstance = () => {
    const data = {
      instanceID: showClearModal,
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };
    dispatch(clearGameInstanceByID(data));
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
                            <p>Scenario : {scenario.ScenarioName}</p>
                            <p>Status : {scenario.Status}</p>
                          </div>
                          <div className={styles.cardTopContainerRight}></div>
                        </div>
                        <div className={styles.cardBottomContainer}>
                          <div className={styles.cardBottomContainerLeft}>
                            <p>
                              Updated : {formatDateString(
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
                                } else if (
                                  scenario.Status === "Start" ||
                                  scenario.Status === "InProgress"
                                ) {
                                  navigate(`/game/${scenario.InstanceID}`);
                                }
                              }}
                            >
                              {scenario.Status === "Create"
                                ? "Start"
                                : scenario.Status === "Start" ||
                                  scenario.Status === "InProgress"
                                  ? "Join"
                                  : "Report"}
                            </Button>

                            {
                              (scenario.Status === "Start" ||
                                scenario.Status === "InProgress") &&
                              <Button
                                onClick={() => {
                                  setShowClearModal(scenario.InstanceID);
                                }}
                              >
                                Clear
                              </Button>
                            }

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
                    <th>Last Played</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioByPage &&
                    scenarioByPage.success &&
                    scenarioByPage.data &&
                    JSON.parse(scenarioByPage?.data)?.ScenarioDetails.map(
                      (scenario, index) => {
                        const isSelected = selectedCheckboxes.includes(scenario.ScenarioID);
                        return (
                          <tr key={index}>
                            <td>
                              <Checkbox
                                checked={isSelected}
                                onChange={() => handleCheckboxChange(scenario.ScenarioID)}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>
                              {scenario.ScenarioName}
                            </td>
                            <td
                              className={styles.scenarioDescription}
                              onClick={() => {
                                navigate(`/questions/${scenario.ScenarioID}`);
                              }}
                            >{scenario.Description}</td>
                            <td>{formatDateString(scenario.CreatedAt)}</td>
                            <td>{scenario.GamesPlayed}</td>
                            <td>
                              {
                                scenario.LastPlayed &&
                                formatDateString(scenario.LastPlayed) !== "Invalid Date" &&
                                formatDateString(scenario.LastPlayed)
                              }
                            </td>
                            {/* <td>{scenario.LastPlayed != null || scenario.LastPlayed != undefined ?
                              extractDate(scenario.LastPlayed) :
                              ""
                            }
                            </td> */}
                            <td>{scenario.Status}</td>
                            <td>
                              <div className={styles.actions}>
                                <div className={styles.circleSvg}
                                  onClick={() => {
                                    if (isSelected) {
                                      navigate(`/scenario/updatescenarios/${scenario.ScenarioID}`);
                                    }
                                  }}
                                >
                                  <svg
                                    height="14"
                                    width="14"
                                    style={{ opacity: isSelected ? "1" : "0.3" }}
                                  >
                                    <use xlinkHref="sprite.svg#edit_icon" />
                                  </svg>
                                </div>
                                <div
                                  className={styles.circleSvg}
                                  onClick={() => {
                                    if (isSelected) {
                                      setShowDeleteModal(scenario);
                                    }
                                  }}
                                >
                                  <svg
                                    height="14"
                                    width="14"
                                    style={{ opacity: isSelected ? "1" : "0.3" }}
                                  >
                                    <use xlinkHref="sprite.svg#delete_icon" />
                                  </svg>
                                </div>
                              </div>
                            </td>
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

      {/* Delete Scenario modal :: start */}
      {showDeleteModal && (
        <ModalContainer>
          <div className="modal_content">
            <div className="modal_header">
              <div>Delete Scenario</div>
              <div>
                <svg
                  className="modal_crossIcon"
                  onClick={() => {
                    setShowDeleteModal(null);
                  }}
                >
                  <use xlinkHref={"sprite.svg#crossIcon"} />
                </svg>
              </div>
            </div>
            <div className="modal_description">
              Are you sure you want to delete this scenario ?
            </div>

            <div className="modal_buttonContainer">
              <Button
                buttonType={"cancel"}
                onClick={() => {
                  setShowDeleteModal(null);
                }}
              >
                Cancel
              </Button>
              <Button
                customStyle={{
                  marginLeft: "1rem",
                }}
                onClick={onDeleteScenario}
              >
                Delete
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}
      {/* Delete Sceanrio modal :: end */}

      {/* Clear instance :: start */}
      {showClearModal && (
        <ModalContainer>
          <div className="modal_content">
            <div className="modal_header">
              <div>Clear Game Instance</div>
              <div>
                <svg
                  className="modal_crossIcon"
                  onClick={() => {
                    setShowClearModal(null);
                  }}
                >
                  <use xlinkHref={"sprite.svg#crossIcon"} />
                </svg>
              </div>
            </div>
            <div className="modal_description">
              Are you sure you want to clear this game instance ?
            </div>

            <div className="modal_buttonContainer">
              <Button
                buttonType={"cancel"}
                onClick={() => {
                  setShowClearModal(null);
                }}
              >
                Cancel
              </Button>
              <Button
                customStyle={{
                  marginLeft: "1rem",
                }}
                onClick={onClearInstance}
              >
                Clear
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}
      {/* Clear instance :: end */}

    </PageContainer>
  );
};

export default Homepage;
