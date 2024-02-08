import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { toast } from "react-toastify";
import {
  createMaster,
  resetCreateMasterState
} from "../../../../../store/app/admin/masters/createMaster.js";
import {
  getAllDesignations,
  resetDesignationsState
} from "../../../../../store/app/admin/masters/getDesignations.js";
import {
  getAllOrganizations,
  resetOrganizationsState
} from "../../../../../store/app/admin/masters/getOrganizations.js";
import {
  updateDesignation,
  resetUpdateDesignationState
} from "../../../../../store/app/admin/masters/updateDesignation.js";
import {
  updateOrganization,
  resetUpdateOrganizationState
} from "../../../../../store/app/admin/masters/updateOrganization.js";
import {
  deleteMasterByTypeAndId,
  resetDeleteMasterByTypeAndIdState
} from "../../../../../store/app/admin/masters/deleteMasterByTypeAndId.js";
import { getDesignationDetailsByID } from "../../../../../store/app/admin/masters/getDesignationById.js";
import { getOrganizationDetailsByID } from "../../../../../store/app/admin/masters/getOrganizationById.js";

const MasterList = () => {

  const [addMasterData, setAddMasterData] = useState({
    designation: {
      value: '',
      error: ''
    },
    description: {
      value: '',
      error: ''
    },
    organization: {
      value: '',
      error: ''
    },
  });
  const [updateMasterData, setUpdateMasterData] = useState({
    designation: {
      value: '',
      error: ''
    },
    description: {
      value: '',
      error: ''
    },
    designationStatus: {
      value: '',
      error: ''
    },
    organization: {
      value: '',
      error: ''
    },
    organizationStatus: {
      value: '',
      error: ''
    },
  });
  const [activeTab, setActiveTab] = useState('Designation');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { credentials } = useSelector((state) => state.login);
  const { designations, loading: designationsLoading } = useSelector((state) => state.getDesignations);
  const { organizations, loading: organizationsLoading } = useSelector((state) => state.getOrganizations);
  const { createMasterResponse, loading: createMasterResponseLoading } =
    useSelector((state) => state.createMaster);
  const { updateDesignationResponse } = useSelector((state) => state.updateDesignation);
  const { updateOrganizationResponse } = useSelector((state) => state.updateOrganization);
  const { designationByIdDetails } = useSelector((state) => state.getDesignationById);
  const { organizationByIdDetails } = useSelector((state) => state.getOrganizationById);
  const { deleteMasterByTypeAndIdResponse } = useSelector((state) => state.deleteMasterByTypeAndId);

  const resetAddMasterData = useCallback(() => {
    setAddMasterData({
      designation: {
        value: '',
        error: ''
      },
      description: {
        value: '',
        error: ''
      },
      organization: {
        value: '',
        error: ''
      },
    });
  }, []);

  const resetUpdateMasterData = useCallback(() => {
    setUpdateMasterData({
      designation: {
        value: '',
        error: ''
      },
      description: {
        value: '',
        error: ''
      },
      designationStatus: {
        value: '',
        error: ''
      },
      organization: {
        value: '',
        error: ''
      },
      organizationStatus: {
        value: '',
        error: ''
      },
    });
  }, []);

  useEffect(() => {
    if (credentials) {
      activeTab === 'Designation' ? dispatch(getAllDesignations()) : dispatch(getAllOrganizations());
    }
  }, [activeTab, dispatch, credentials]);

  //DEBUG :: start

  useEffect(() => {
    if (designations === null ||
      designations === undefined ||
      organizations === null ||
      organizations === undefined) return;

    console.log(" designation :", JSON.parse(designations?.data))
    console.log(" organizations :", JSON.parse(organizations?.data))

  }, [designations, organizations]);

  useEffect(() => {
    console.log(" updateMasterData :", updateMasterData)


  }, [updateMasterData]);

  //DEBUG :: end

  useEffect(() => {
    if (createMasterResponse === null || createMasterResponse === undefined) return;

    if (createMasterResponse?.success) {
      console.log("Master created")
      toast.success((activeTab === 'Designation') ? 
        "Designation created successfully" : "Organization created successfully");

      activeTab === 'Designation' ? dispatch(getAllDesignations()) : dispatch(getAllOrganizations());

      resetAddMasterData();
      setShowModal(false);
      dispatch(resetCreateMasterState());

    } else if (!createMasterResponse.success) {
      console.log(" error : ", createMasterResponse?.message)
      // toast.error(createMasterResponse?.message);
      toast.error(createMasterResponse?.message);
      dispatch(resetCreateMasterState());
    } else {
      dispatch(resetCreateMasterState());
    }
  }, [createMasterResponse]);

  useEffect(() => {
    if (updateDesignationResponse === null || updateDesignationResponse === undefined)
      return;

    if (updateDesignationResponse?.success) {
      toast.success(updateDesignationResponse.message);
      activeTab === 'Designation' ? dispatch(getAllDesignations()) : dispatch(getAllOrganizations());

      setShowEditModal(null);
      setSelectedCheckboxes([]);
      resetUpdateMasterData();
      dispatch(resetUpdateDesignationState());
      // dispatch(resetDesignationsState()); TODO
    } else if (!updateDesignationResponse?.success) {

      activeTab === 'Designation' ? dispatch(getAllDesignations()) : dispatch(getAllOrganizations());

      toast.error(updateDesignationResponse?.message);
      dispatch(resetUpdateDesignationState());
    } else {
      dispatch(resetUpdateDesignationState());
    }
  }, [updateDesignationResponse]);

  useEffect(() => {
    if (updateOrganizationResponse === null || updateOrganizationResponse === undefined)
      return;

    if (updateOrganizationResponse?.success) {
      toast.success(updateOrganizationResponse.message);
      activeTab === 'Designation' ? dispatch(getAllDesignations()) : dispatch(getAllOrganizations());

      setShowEditModal(null);
      setSelectedCheckboxes([]);
      resetUpdateMasterData();
      dispatch(resetUpdateOrganizationState());
      // dispatch(resetDesignationsState()); TODO
    } else if (!updateOrganizationResponse?.success) {

      activeTab === 'Designation' ? dispatch(getAllDesignations()) : dispatch(getAllOrganizations());

      toast.error(updateOrganizationResponse?.message);
      dispatch(resetUpdateOrganizationState());
    } else {
      dispatch(resetUpdateOrganizationState());
    }
  }, [updateOrganizationResponse]);


  useEffect(() => {
    if (deleteMasterByTypeAndIdResponse === null || deleteMasterByTypeAndIdResponse === undefined) return;

    if (deleteMasterByTypeAndIdResponse.success) {
      toast.success(deleteMasterByTypeAndIdResponse.message);
      activeTab === 'Designation' ? dispatch(getAllDesignations()) : dispatch(getAllOrganizations());

      dispatch(resetDeleteMasterByTypeAndIdState());
      setShowDeleteModal(null);
      setSelectedCheckboxes([]);
    } else if (!deleteMasterByTypeAndIdResponse.success) {
      toast.error(deleteMasterByTypeAndIdResponse.message);
    }
  }, [deleteMasterByTypeAndIdResponse]);

  const setDesignationDetailState = useCallback(() => {
    if (isJSONString(designationByIdDetails?.data)) {
      const data = JSON.parse(designationByIdDetails?.data);
      console.log("designationByIdDetails data:", data);

      const newData = {
        designation: {
          value: data.DesignationName,
          error: ''
        },
        description: {
          value: data.Description,
          error: ''
        },
        designationStatus: {
          value: data.IsActive,
          error: ''
        },
      };

      setUpdateMasterData((prevData) => ({
        ...prevData,
        ...newData,
      }));
    }
  }, [designationByIdDetails]);

  // update the update Designation  Data state with new data and render it
  useEffect(() => {
    if (designationByIdDetails === null || designationByIdDetails === undefined)
      return;

    setDesignationDetailState();
  }, [designationByIdDetails]);


  const setOrganizationDetailState = useCallback(() => {
    if (isJSONString(organizationByIdDetails?.data)) {
      const data = JSON.parse(organizationByIdDetails?.data);
      console.log("organizationByIdDetails data:", data);

      const newData = {
        organization: {
          value: data.OrganizationName,
          error: ''
        },
        organizationStatus: {
          value: data.IsActive,
          error: ''
        },
      };

      setUpdateMasterData((prevData) => ({
        ...prevData,
        ...newData,
      }));
    }
  }, [organizationByIdDetails]);

  // update the update organization Data state with new data and render it
  useEffect(() => {
    if (organizationByIdDetails === null || organizationByIdDetails === undefined)
      return;

    setOrganizationDetailState();
  }, [organizationByIdDetails]);


  const onMasterDataChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setAddMasterData((prevData) => ({
        ...prevData,
        [name]: { value, error: '' },
      }));
    },
    [setAddMasterData]
  );

  const handleTabClick = useCallback(
    (tab) => {
      setActiveTab(tab);
      setSelectedCheckboxes([]);
    },
    [setActiveTab]
  );

  // on add master details
  const onAddMasterData = () => {
    console.log("onAddMasterData")

    let valid = true;
    let data = { ...addMasterData };

    if (activeTab === 'Designation') {

      // validate the designation fields
      if (addMasterData?.designation?.value?.trim() === "") {
        console.log("designation:", data.designation);
        data = {
          ...data,
          designation: {
            ...data.designation,
            error: "Please enter designation name",
          },
        };

        valid = false;
      }

      if (addMasterData?.description?.value?.trim() === "") {
        console.log("description:", data.description);
        data = {
          ...data,
          description: {
            ...data.description,
            error: "Please enter description ",
          },
        };

        valid = false;
      }

    } else if (activeTab === 'Organization') {
      if (addMasterData?.organization?.value?.trim() === "") {
        console.log("organization:", data.organization);
        data = {
          ...data,
          organization: {
            ...data.organization,
            error: "Please enter organization ",
          },
        };

        valid = false;
      }
    }

    // If all validations pass
    try {
      if (valid) {
        const data = {
          masterID: "",
          masterName: (activeTab === 'Designation' ?
            addMasterData?.designation?.value :
            addMasterData?.organization?.value),
          description: (activeTab === 'Designation' ? addMasterData?.description?.value : ""),
          masterType: (activeTab === 'Designation' ? 'Designation' : 'Organization'),
          isActive: "true",
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
        };

        console.log("data to update : ", data);

        dispatch(createMaster(data));

      } else {
        toast.error("Please fill all the details.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the master data.");
      console.error("Saving master data error:", error);
    }
  }

  const handleCheckboxChange = (index) => {
    const isSelected = selectedCheckboxes.includes(index);
    const updatedRows = isSelected
      ? selectedCheckboxes.filter((row) => row !== index)
      : [...selectedCheckboxes, index];

    setSelectedCheckboxes(updatedRows);
  };

  const handleOnEditClick = (masterId) => {
    console.log("master id to edit  :", masterId)
    const data = {
      id: masterId,
    }
    activeTab === 'Designation' ?
      dispatch(getDesignationDetailsByID(data)) : dispatch(getOrganizationDetailsByID(data));

    // console.log("show edit modal")
    setShowEditModal(masterId);

  };

  const onUpdateMasterDataChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setUpdateMasterData((prevData) => ({
        ...prevData,
        [name]: { value, error: '' },
      }));
    },
    [setUpdateMasterData]
  );

  // on add master details
  const onEditMasterData = () => {
    console.log("onEditMasterData")

    let valid = true;
    let data = { ...updateMasterData };

    if (activeTab === 'Designation') {

      // validate the designation fields
      if (updateMasterData?.designation?.value?.trim() === "") {
        console.log("designation:", data.designation);
        data = {
          ...data,
          designation: {
            ...data.designation,
            error: "Please enter designation name",
          },
        };

        valid = false;
      }

      if (updateMasterData?.description?.value?.trim() === "") {
        console.log("description:", data.description);
        data = {
          ...data,
          description: {
            ...data.description,
            error: "Please enter description ",
          },
        };

        valid = false;
      }

    } else if (activeTab === 'Organization') {
      if (updateMasterData?.organization?.value?.trim() === "") {
        console.log("organization:", data.organization);
        data = {
          ...data,
          organization: {
            ...data.organization,
            error: "Please enter organization ",
          },
        };

        valid = false;
      }
    }

    // If all validations pass
    try {
      if (valid) {

        if (activeTab === 'Designation') {
          const data = {
            id: showEditModal,
            designationName: updateMasterData?.designation?.value,
            description: updateMasterData?.description?.value,
            // isActive: updateMasterData?.designationStatus?.value?.toString(),
            isActive: updateMasterData?.designationStatus?.value,
            requester: {
              requestID: generateGUID(),
              requesterID: credentials.data.userID,
              requesterName: credentials.data.userName,
              requesterType: credentials.data.role,
            },
          };

          console.log("data to edit in designation : ", data);

          dispatch(updateDesignation(data));

        } else {

          const data = {
            id: showEditModal,
            organizationName: updateMasterData?.organization?.value,
            // isActive: updateMasterData?.organizationStatus?.value?.toString(),
            isActive: updateMasterData?.organizationStatus?.value,
            requester: {
              requestID: generateGUID(),
              requesterID: credentials.data.userID,
              requesterName: credentials.data.userName,
              requesterType: credentials.data.role,
            },
          };

          console.log("data to edit in organization : ", data);

          dispatch(updateOrganization(data));
        }


      } else {
        toast.error("Please fill all the details.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the master data.");
      console.error("Saving master data error:", error);
    }
  }

  const onDeleteMaster = () => {
    const data = {
      masterType: (activeTab === 'Designation' ? 'Designation' : 'Organization'),
      id: showDeleteModal.ID,
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };

    dispatch(deleteMasterByTypeAndId(data));
  };

  return (
    <PageContainer>
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label>Master List</label>
        </div>
        <div
          style={{ backgroundImage: `url("./images/binary.png") ` }}
          className={styles.right}
        >
          <img src="./images/scenario.png" />
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div
          style={{ backgroundImage: `url("./images/particles.png")` }}
          className={styles.mainTopContainer}>
          <div className={styles.mainTopLeft}>
            <div className={styles.designationsContainer}>
              <div className={styles.designationsTop}
                onClick={() => handleTabClick('Designation')}
              >
                <label
                  style={{
                    color: activeTab === 'Designation' ?
                      'var(--primary)' :
                      'var(--disabled_label)'
                  }}
                >
                  Designations
                </label>
              </div>
              <div
                className={styles.designationsBottom}
                style={{
                  backgroundColor: activeTab === 'Designation' ?
                    'var(--primary)' :
                    'var(--disabled_label)'
                }}
              ></div>
            </div>
            <div className={styles.organizationsContainer}
              onClick={() => handleTabClick('Organization')}

            >
              <div className={styles.organizationsTop}>
                <label
                  style={{
                    color: activeTab === 'Organization' ?
                      'var(--primary)' :
                      'var(--disabled_label)'
                  }}
                >
                  Organizations
                </label>
              </div>
              <div
                className={styles.organizationsBottom}
                style={{
                  backgroundColor: activeTab === 'Organization' ?
                    'var(--primary)' :
                    'var(--disabled_label)'
                }}
              ></div>
            </div>
          </div>
          <div className={styles.mainTopRight}>
            <Button
              onClick={() => {
                console.log("show modal")
                setShowModal(true);
              }}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className={styles.mainBottomContainer}>
          {/* Master List Table:: start */}
          <div className={styles.mainTableContainer}>
            <table className={styles.table_content}>
              <thead>
                {activeTab === 'Designation' ?
                  (
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
                  ) : (
                    <tr>
                      <th></th>
                      <th>#</th>
                      <th>Organization</th>
                      <th>Member Users</th>
                      <th>Date Created</th>
                      <th>Games Played</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  )}

              </thead>
              <tbody>
                {activeTab === 'Designation' ?
                  (
                    designations &&
                    designations?.success &&
                    designations?.data &&
                    JSON.parse(designations?.data)?.map((designation, index) => {
                      const isSelected = selectedCheckboxes.includes(index);

                      return (
                        <tr key={index}>
                          <td>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{designation.Designation}</td>
                          <td
                            className={styles.designationDescription}
                          >{designation.Description}</td>
                          <td>{formatDateString(designation.DateCreated)}</td>
                          <td>{designation.Scenarios}</td>
                          <td>{(designation.Status) ? 'Active' : 'Inactive'}</td>
                          <td>
                            <div className={styles.actions}>
                              <div
                                className={styles.circleSvg}
                                // onClick={() => {
                                //   console.log("show edit modal")
                                //   setShowEditModal(true);
                                // }}
                                onClick={() => {
                                  if (isSelected && designation.Status) {
                                    handleOnEditClick(designation.ID)
                                  }
                                }}
                              >
                                <svg
                                  height="14"
                                  width="14"
                                  style={{
                                    opacity: (isSelected && designation.Status) ? "1" : "0.3"
                                  }}
                                >
                                  <use xlinkHref="sprite.svg#edit_icon" />
                                </svg>
                              </div>
                              <div
                                className={styles.circleSvg}
                                onClick={() => {
                                  if (isSelected && designation.Status) {
                                    setShowDeleteModal(designation);
                                  }
                                }}
                              >
                                <svg
                                  height="14"
                                  width="14"
                                  style={{
                                    opacity: (isSelected && designation.Status) ? "1" : "0.3"
                                  }}
                                >
                                  <use xlinkHref="sprite.svg#delete_icon" />
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    organizations &&
                    organizations?.success &&
                    organizations?.data &&
                    JSON.parse(organizations?.data)?.map((organization, index) => {
                      const isSelected = selectedCheckboxes.includes(index);

                      return (
                        <tr key={index}>
                          <td>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{organization.Organization}</td>
                          <td>{organization.MemberUsers}</td>
                          <td>{formatDateString(organization.DateCreated)}</td>
                          <td>{organization.GamesPlayed}</td>
                          <td>{(organization.Status) ? 'Active' : 'Inactive'}</td>
                          <td>
                            <div className={styles.actions}>
                              <div
                                className={styles.circleSvg}
                                onClick={() => {
                                  if (isSelected && organization.Status) {
                                    handleOnEditClick(organization.ID);
                                  }
                                }}
                              >
                                <svg
                                  height="14"
                                  width="14"
                                  style={{
                                    opacity: (isSelected && organization.Status) ? "1" : "0.3"
                                  }}
                                >
                                  <use xlinkHref="sprite.svg#edit_icon" />
                                </svg>
                              </div>
                              <div
                                className={styles.circleSvg}
                                onClick={() => {
                                  if (isSelected && organization.Status) {
                                    setShowDeleteModal(organization);
                                  }
                                }}
                              >
                                <svg
                                  height="14"
                                  width="14"
                                  style={{
                                    opacity: (isSelected && organization.Status) ? "1" : "0.3"
                                  }}
                                >
                                  <use xlinkHref="sprite.svg#delete_icon" />
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )
                }
              </tbody>
            </table>
          </div>
          {/* Master List Table:: end */}
        </div>
      </div>

      {/* Modal Container :: start*/}

      {showModal && (
        <ModalContainer>
          <div className="modal_content">
            <div className="modal_header">
              <div>
                {activeTab === 'Designation' ? 'Add Designation' : 'Add Organization'}
              </div>
              <div>
                <svg
                  className="modal_crossIcon"
                  onClick={() => {
                    setShowModal(false);
                    resetAddMasterData();
                  }}
                >
                  <use xlinkHref={"sprite.svg#crossIcon"} />
                </svg>
              </div>
            </div>
            <div className={styles.modalInputContainer}>
              {activeTab === 'Designation' ?
                (
                  <div>
                    <Input
                      type="text"
                      customStyle={{ marginTop: '1rem', }}
                      value={addMasterData?.designation?.value}
                      name={"designation"}
                      placeholder="Designation Name"
                      onChange={onMasterDataChange}
                    />
                    <Input
                      type="text"
                      customStyle={{ marginTop: '1rem', }}
                      value={addMasterData?.description?.value}
                      name={"description"}
                      placeholder="Description"
                      textAreaStyleClass={styles.textAreaStyleClass}
                      onChange={onMasterDataChange}
                      textArea
                    />
                  </div>
                ) : (
                  <div>
                    <Input
                      type="text"
                      customStyle={{ marginTop: '1rem', }}
                      value={addMasterData?.organization?.value}
                      name={"organization"}
                      placeholder="Organization Name"
                      onChange={onMasterDataChange}
                    />
                  </div>
                )
              }

            </div>

            <div className="modal_buttonContainer">
              <Button
                buttonType={"cancel"}
                onClick={() => {
                  setShowModal(false);
                  resetAddMasterData();
                }}
              >
                Cancel
              </Button>
              <Button
                customStyle={{
                  marginLeft: "1rem",
                }}
                onClick={onAddMasterData}
              >
                Add
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}


      {/* Edit modal :: start */}
      {showEditModal && (
        <ModalContainer>
          <div className="modal_content">
            <div className="modal_header">
              <div>
                {activeTab === 'Designation' ? 'Edit Designation' : 'Edit Organization'}
              </div>
              <div>
                <svg
                  className="modal_crossIcon"
                  onClick={() => {
                    setShowEditModal(null);
                    resetUpdateMasterData(); // TODO:: cleanup dispatches or designationa and organization
                  }}
                >
                  <use xlinkHref={"sprite.svg#crossIcon"} />
                </svg>
              </div>
            </div>
            <div className={styles.modalInputContainer}>
              {activeTab === 'Designation' ?
                (
                  <div>
                    <Input
                      type="text"
                      customStyle={{ marginTop: '1rem', }}
                      value={updateMasterData?.designation?.value}
                      name={"designation"}
                      placeholder="Designation Name"
                      onChange={onUpdateMasterDataChange}
                    />
                    <Input
                      type="text"
                      customStyle={{ marginTop: '1rem', }}
                      value={updateMasterData?.description?.value}
                      name={"description"}
                      placeholder="Description"
                      textAreaStyleClass={styles.textAreaStyleClass}
                      onChange={onUpdateMasterDataChange}
                      textArea
                    />
                  </div>
                ) : (
                  <div>
                    <Input
                      type="text"
                      customStyle={{ marginTop: '1rem', }}
                      value={updateMasterData?.organization?.value}
                      name={"organization"}
                      placeholder="Organization Name"
                      onChange={onUpdateMasterDataChange}
                    />
                  </div>
                )
              }

            </div>

            <div className="modal_buttonContainer">
              <Button
                buttonType={"cancel"}
                onClick={() => {
                  setShowEditModal(null);
                  resetUpdateMasterData();
                }}
              >
                Cancel
              </Button>
              <Button
                customStyle={{
                  marginLeft: "1rem",
                }}
                onClick={onEditMasterData}
              >
                Save
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}

      {/* Edit modal :: end */}

      {/* Delete modal :: start */}
      {showDeleteModal && (
        <ModalContainer>
          <div className="modal_content">
            <div className="modal_header">
              <div>
                {activeTab === 'Designation' ? 'Delete Designation' : 'Delete Organization'}
              </div>
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
              Are you sure you want to delete this {activeTab === 'Designation' ? 
                'designation' : 'organization'}
              ?
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
                onClick={onDeleteMaster}
              >
                Delete
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}
      {/* Delete modal :: end */}

      {/* Modal Container :: end*/}
    </PageContainer>
  );
};

export default MasterList;
