import React, { useCallback, useEffect, useState } from "react";
import PageContainer from "../../../../components/ui/pagecontainer/index.jsx";
import styles from "./scenarios.module.css";
import Button from "../../../../components/common/button/index.jsx";
import Pagination from "../../../../components/ui/pagination/index.jsx";
import Checkbox from "../../../../components/ui/checkbox/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { generateGUID, isJSONString } from "../../../../utils/common.js";
import { getScenarioByPage } from "../../../../store/app/admin/scenario/scenario.js";
import { debounce, extractDate, formatDateString } from "../../../../utils/helper.js";
import { useNavigate } from "react-router-dom";
import ModalContainer from "../../../../components/modal/index.jsx";
import {
  deleteScenarioByID,
  resetDeleteScenarioState
} from "../../../../store/app/admin/scenario/deleteScenario.js";
import {
  getScoreMastersByScenarioID,
  resetScoreMastersByScenarioIDState
} from "../../../../store/app/admin/questions/scoremaster/getScoreMasters.js";
import {
  updateScoreMaster,
  resetUpdateScoreMasterState
} from "../../../../store/app/admin/questions/scoremaster/updateScoreMasterByScenario.js";
import { toast } from "react-toastify";
import Input from "../../../../components/common/input/index.jsx";
import { resetScenarioStates } from "../../../../store/local/menu.js";
import CustomInput from "../../../../components/common/customInput/index.jsx";

const Scenarios = () => {
  const [pageCount, setPageCount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showEditScoreMasterModal, setShowEditScoreMasterModal] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [updateScoreMasterData, setUpdateScoreMasterData] = useState({
    orderOne: {
      value: '',
      error: ''
    },
    orderTwo: {
      value: '',
      error: ''
    },
    orderThree: {
      value: '',
      error: ''
    },
    orderFour: {
      value: '',
      error: ''
    },
    orderFive: {
      value: '',
      error: ''
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { credentials } = useSelector((state) => state.login);
  const { scenarioByPage } = useSelector((state) => state.scenarios);
  const { deleteScenarioResponse } = useSelector((state) => state.deleteScenario);
  const { scoreMastersByScenarioIdDetails } = useSelector((state) => state.getScoreMasters);
  const { updateScoreMasterResponse } = useSelector((state) => state.updateScoreMasterByScenario);
  const { isScenarioReset } = useSelector((state) => state.menu);

  const resetUpdateScoreMasterData = useCallback(() => {
    setUpdateScoreMasterData({
      orderOne: {
        value: '',
        error: ''
      },
      orderTwo: {
        value: '',
        error: ''
      },
      orderThree: {
        value: '',
        error: ''
      },
      orderFour: {
        value: '',
        error: ''
      },
      orderFive: {
        value: '',
        error: ''
      },
    });
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
    if (isScenarioReset) {
      const data = {
        pageNumber: 1,
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
      dispatch(resetScenarioStates());
    }
  }, [isScenarioReset]);

  useEffect(() => {
    if (scenarioByPage && isJSONString(scenarioByPage?.data)) {
      const newPageNumber = JSON.parse(scenarioByPage?.data)?.CurrentPage;

      if (newPageNumber && typeof newPageNumber === "number") {
        setPageNumber(newPageNumber);
      }
    }
  }, [scenarioByPage]);

  useEffect(() => {
    if (updateScoreMasterResponse === null || updateScoreMasterResponse === undefined)
      return;

    if (updateScoreMasterResponse?.success) {
      // toast.success(updateScoreMasterResponse.message);
      toast.success("Score master updated successfully.");

      setShowEditScoreMasterModal(null);
      setSelectedCheckboxes([]);
      resetUpdateScoreMasterData();
      dispatch(resetUpdateScoreMasterState());
      dispatch(resetScoreMastersByScenarioIDState());
    } else if (!updateScoreMasterResponse?.success) {

      toast.error(
        (updateScoreMasterResponse?.message) ?
          updateScoreMasterResponse?.message : "An error occured while saving score master"
      );
      dispatch(resetUpdateScoreMasterState());
    } else {
      dispatch(resetUpdateScoreMasterState());
    }
  }, [updateScoreMasterResponse]);


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
      setSelectedCheckboxes([]);
      // } else if (!deleteScenarioResponse.success) {
    } else {

      toast.error(deleteScenarioResponse.message);
      dispatch(resetDeleteScenarioState());

    }
  }, [deleteScenarioResponse]);

  const setScoreMasterDetailState = useCallback(() => {
    if (isJSONString(scoreMastersByScenarioIdDetails?.data)) {
      const data = JSON.parse(scoreMastersByScenarioIdDetails?.data);
      console.log("scoreMastersByScenarioIdDetails data:", data);

      const newData = {
        orderOne: {
          value: data[0]?.ScoreDisplay || '',
          error: ''
        },
        orderTwo: {
          value: data[1]?.ScoreDisplay || '',
          error: ''
        },
        orderThree: {
          value: data[2]?.ScoreDisplay || '',
          error: ''
        },
        orderFour: {
          value: data[3]?.ScoreDisplay || '',
          error: ''
        },
        orderFive: {
          value: data[4]?.ScoreDisplay || '',
          error: ''
        },
      };

      setUpdateScoreMasterData((prevData) => ({
        ...prevData,
        ...newData,
      }));
    }
  }, [scoreMastersByScenarioIdDetails]);

  // update the update organization Data state with new data and render it
  useEffect(() => {
    if (scoreMastersByScenarioIdDetails === null || scoreMastersByScenarioIdDetails === undefined)
      return;

    setScoreMasterDetailState();
  }, [scoreMastersByScenarioIdDetails]);


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

  const handleScoreMasterClick = (scenario) => {
    const data = {
      scenarioID: scenario.ScenarioID,
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };

    dispatch(getScoreMastersByScenarioID(data))
    setShowEditScoreMasterModal(scenario);
  };

  const onUpdateScoreMasterDataChange = useCallback(
    (v, event) => {
      const { name, value } = event.target;
      setUpdateScoreMasterData((prevData) => ({
        ...prevData,
        [name]: { value, error: '' },
      }));
    },
    [setUpdateScoreMasterData]
  );

  // on add master details
  const onUpdateScoreMasterData = () => {
    console.log("onUpdateScoreMasterData")

    let valid = true;
    let data = { ...updateScoreMasterData };

    if (updateScoreMasterData?.orderOne?.value?.trim() === "") {
      console.log("orderOne:", data.orderOne);
      data = {
        ...data,
        orderOne: {
          ...data.orderOne,
          error: "Please enter 0% display text",
        },
      };

      valid = false;
    }

    if (updateScoreMasterData?.orderTwo?.value?.trim() === "") {
      console.log("orderTwo:", data.orderTwo);
      data = {
        ...data,
        orderTwo: {
          ...data.orderTwo,
          error: "Please enter 25% display text",
        },
      };

      valid = false;
    }

    if (updateScoreMasterData?.orderThree?.value?.trim() === "") {
      console.log("orderThree:", data.orderThree);
      data = {
        ...data,
        orderThree: {
          ...data.orderThree,
          error: "Please enter 50% display text",
        },
      };

      valid = false;
    }

    if (updateScoreMasterData?.orderFour?.value?.trim() === "") {
      console.log("orderFour:", data.orderFour);
      data = {
        ...data,
        orderFour: {
          ...data.orderFour,
          error: "Please enter 75% display text",
        },
      };

      valid = false;
    }

    if (updateScoreMasterData?.orderFive?.value?.trim() === "") {
      console.log("orderFive:", data.orderFive);
      data = {
        ...data,
        orderFive: {
          ...data.orderFive,
          error: "Please enter 100% display text",
        },
      };

      valid = false;
    }

    setUpdateScoreMasterData(data);
    // If all validations pass
    try {
      if (valid) {

        const data = {
          scenarioID: showEditScoreMasterModal.ScenarioID,
          l1Display: updateScoreMasterData?.orderOne?.value,
          l2Display: updateScoreMasterData?.orderTwo?.value,
          l3Display: updateScoreMasterData?.orderThree?.value,
          l4Display: updateScoreMasterData?.orderFour?.value,
          l5Display: updateScoreMasterData?.orderFive?.value,
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
        };

        console.log("data to edit in scre master : ", data);

        dispatch(updateScoreMaster(data));




      } else {
        // toast.error("Please fill all the details.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the score master data.");
      console.error("Saving score master data error:", error);
    }
  }

  const debouncedUpdateScoreMaster = debounce(onUpdateScoreMasterData, 1000);


  return (
    <PageContainer>
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label>Scenarios</label>
        </div>
        <div
          className={styles.right}
          style={{ backgroundImage: 'url("/images/binary.png")' }}
        >
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
              {/* <th></th> */}
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
              JSON.parse(scenarioByPage.data)?.ScenarioDetails.map(
                (scenario, index) => {
                  // const isSelected = selectedCheckboxes.includes(scenario.ScenarioID);
                  const isSelected = true;

                  return (
                    <tr key={index}>
                      {/* <td>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(scenario.ScenarioID)}
                        />
                      </td> */}
                      {/* <td>{index + 1}</td> */}
                      <td>{index + pageCount * (pageNumber - 1) + 1}</td>
                      <td>
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
                                handleScoreMasterClick(scenario);
                              }
                            }}
                          >
                            <svg
                              height="14"
                              width="14"
                              style={{ opacity: isSelected ? "1" : "0.3" }}
                            >
                              <use xlinkHref="sprite.svg#ratings_icon" />
                            </svg>
                          </div>
                          <div className={styles.circleSvg}
                            onClick={() => {
                              if (isSelected) {
                                navigate(`/scenario/updatescenarios/${scenario.ScenarioID}`);
                              }
                            }}
                          >
                            <svg
                              height="11"
                              width="11"
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
                              width="12"
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

      </div>
      {/* Scenario Table:: end */}

      {/* Edit Score Master Modal :: start*/}
      {showEditScoreMasterModal && (
        <ModalContainer>
          <div className="modal_content">
            <div className="modal_header">
              <div>
                Edit Score Master
              </div>
              <div>
                <svg
                  className="modal_crossIcon"
                  onClick={() => {
                    setShowEditScoreMasterModal(null);
                    resetUpdateScoreMasterData();
                  }}
                >
                  <use xlinkHref={"sprite.svg#crossIcon"} />
                </svg>
              </div>
            </div>
            <div className={styles.modalInputContainer}>
              <div>
                {/* <Input
                  type="text"
                  labelStyle={styles.inputLabel}
                  label="0% Display Text"
                  customStyle={{ marginTop: '1rem', }}
                  value={updateScoreMasterData?.orderOne?.value}
                  name={"orderOne"}
                  placeholder="0% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                /> */}
                <CustomInput
                  type="text"
                  value={updateScoreMasterData?.orderOne?.value}
                  // customStyle={{ margin: '0' }}
                  // customInputStyles={{ height: "auto" }}
                  // inputStyleClass={styles.customInputStylesClass}
                  customLabelStyle={{ display: "none" }}
                  customStyle={{ marginTop: '1rem', }}
                  name={"orderOne"}
                  title="0% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                  required
                  error={updateScoreMasterData?.orderOne?.error}
                  errorNode={(
                    <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                      {updateScoreMasterData?.orderOne?.error}
                    </div>
                  )}
                  maxLength={50}

                />

                {/* <Input
                  type="text"
                  labelStyle={styles.inputLabel}
                  label="25% Display Text"
                  customStyle={{ marginTop: '1rem', }}
                  value={updateScoreMasterData?.orderTwo?.value}
                  name={"orderTwo"}
                  placeholder="25% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                /> */}
                <CustomInput
                  type="text"
                  value={updateScoreMasterData?.orderTwo?.value}
                  // customStyle={{ margin: '0' }}
                  // customInputStyles={{ height: "auto" }}
                  // inputStyleClass={styles.customInputStylesClass}
                  customLabelStyle={{ display: "none" }}
                  customStyle={{ marginTop: '1rem', }}
                  name={"orderTwo"}
                  title="25% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                  required
                  error={updateScoreMasterData?.orderTwo?.error}
                  errorNode={(
                    <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                      {updateScoreMasterData?.orderTwo?.error}
                    </div>
                  )}
                  maxLength={50}

                />

                {/* <Input
                  type="text"
                  labelStyle={styles.inputLabel}
                  label="50% Display Text"
                  customStyle={{ marginTop: '1rem', }}
                  value={updateScoreMasterData?.orderThree?.value}
                  name={"orderThree"}
                  placeholder="50% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                /> */}

                <CustomInput
                  type="text"
                  value={updateScoreMasterData?.orderThree?.value}
                  // customStyle={{ margin: '0' }}
                  // customInputStyles={{ height: "auto" }}
                  // inputStyleClass={styles.customInputStylesClass}
                  customLabelStyle={{ display: "none" }}
                  customStyle={{ marginTop: '1rem', }}
                  name={"orderThree"}
                  title="50% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                  required
                  error={updateScoreMasterData?.orderThree?.error}
                  errorNode={(
                    <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                      {updateScoreMasterData?.orderThree?.error}
                    </div>
                  )}
                  maxLength={50}

                />

                {/* <Input
                  type="text"
                  labelStyle={styles.inputLabel}
                  label="75% Display Text"
                  customStyle={{ marginTop: '1rem', }}
                  value={updateScoreMasterData?.orderFour?.value}
                  name={"orderFour"}
                  placeholder="75% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                /> */}

                <CustomInput
                  type="text"
                  value={updateScoreMasterData?.orderFour?.value}
                  // customStyle={{ margin: '0' }}
                  // customInputStyles={{ height: "auto" }}
                  // inputStyleClass={styles.customInputStylesClass}
                  customLabelStyle={{ display: "none" }}
                  customStyle={{ marginTop: '1rem', }}
                  name={"orderFour"}
                  title="75% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                  required
                  error={updateScoreMasterData?.orderFour?.error}
                  errorNode={(
                    <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                      {updateScoreMasterData?.orderFour?.error}
                    </div>
                  )}
                  maxLength={50}

                />

                {/* <Input
                  type="text"
                  labelStyle={styles.inputLabel}
                  label="100% Display Text"
                  customStyle={{ marginTop: '1rem', }}
                  value={updateScoreMasterData?.orderFive?.value}
                  name={"orderFive"}
                  placeholder="100% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                /> */}

                <CustomInput
                  type="text"
                  value={updateScoreMasterData?.orderFive?.value}
                  // customStyle={{ margin: '0' }}
                  // customInputStyles={{ height: "auto" }}
                  // inputStyleClass={styles.customInputStylesClass}
                  customLabelStyle={{ display: "none" }}
                  customStyle={{ marginTop: '1rem', }}
                  name={"orderFive"}
                  title="100% Display Text"
                  onChange={onUpdateScoreMasterDataChange}
                  required
                  error={updateScoreMasterData?.orderFive?.error}
                  errorNode={(
                    <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                      {updateScoreMasterData?.orderFive?.error}
                    </div>
                  )}
                  maxLength={50}

                />

              </div>


            </div>

            <div className="modal_buttonContainer">
              <Button
                buttonType={"cancel"}
                onClick={() => {
                  setShowEditScoreMasterModal(null);
                  resetUpdateScoreMasterData();
                }}
              >
                Cancel
              </Button>
              <Button
                customStyle={{
                  marginLeft: "1rem",
                }}
                // onClick={onUpdateScoreMasterData}
                onClick={debouncedUpdateScoreMaster}
              >
                Add
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}
      {/* Edit Score Master Modal :: end*/}


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
    </PageContainer>
  );
};

export default Scenarios;
