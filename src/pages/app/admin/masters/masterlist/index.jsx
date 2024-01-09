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
import ButtonLink from "../../../../../components/common/ButtonLink/index.jsx";
import {
  getMastersByType,
  resetMastersByTypeState
} from "../../../../../store/app/admin/masters/mastersByType.js";
import {
  getDesignationsbyPage,
  resetDesignationState
} from "../../../../../store/app/admin/masters/designations.js";
import {
  getOrganizationsbyPage,
  resetOrganizationState
} from "../../../../../store/app/admin/masters/organizations.js";

const MasterList = () => {

  const [addMasterData, setAddMasterData] = useState({
    designation: {
      value: "",
      error: "",
    },
    description: {
      value: "",
      error: "",
    },
    organization: {
      value: "",
      error: "",
    },
  });

  const [addDesignationData, setAddDesignationData] = useState({
    designation: {
      value: "",
      error: "",
    },
    description: {
      value: "",
      error: "",
    },
  });

  const [addOrganizationData, setAddOrganizationData] = useState({
    organization: {
      value: "",
      error: "",
    },
  });

  const [activeTab, setActiveTab] = useState('Designation');
  const [showModal, setShowModal] = useState(false);

  const [pageCount, setPageCount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mastersByType, loading: masterLoading } = useSelector(
    (state) => state.mastersByType
  );

  const { credentials } = useSelector((state) => state.login);
  const { designationsByPage } = useSelector((state) => state.designations);
  const { organizationsByPage } = useSelector((state) => state.organizations);

  const resetAddDesignationData = () => {
    setAddDesignationData({
      designation: {
        value: "",
        error: "",
      },
      description: {
        value: "",
        error: "",
      },
    })
  };

  const resetAddOrganizationData = () => {
    setAddOrganizationData({
      organization: {
        value: "",
        error: "",
      },
    })
  };

  // fetch the masters based on the activeTab 
  useEffect(() => {
    if (credentials) {
      const data = {
        masterType: (activeTab === 'Designation' ? 'Designation' : 'Organization'),
      };
      console.log("mastertype to dispatch : ", data);
      dispatch(getMastersByType(data));
    }
  }, [activeTab]);

  useEffect(() => {
    if (mastersByType && isJSONString(mastersByType?.data)) {
      console.log("JSON.parse(mastersByType.data) :", JSON.parse(mastersByType.data));
    }
  }, [mastersByType]);

  const onDesignationChange = (event) => {
    console.log("onDesignationChange name : " + event.target.name + ", value : " + event.target.value)
    setAddDesignationData({
      ...addDesignationData,
      [event.target.name]: {
        value: event.target.value,
        error: "",
      },
    });
  };

  const onOrganizationChange = (event) => {
    console.log("onOrganizationChange name : " + event.target.name + ", value : " + event.target.value)
    setAddOrganizationData({
      ...addOrganizationData,
      [event.target.name]: {
        value: event.target.value,
        error: "",
      },
    });
  };

  const handleTabClick = (tab) => {
    console.log("active tan :", tab);
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
                onClick={() => handleTabClick('Designation')}
              >
                <label
                  style={{
                    color: activeTab === 'Designation' ?
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
                  backgroundColor: activeTab === 'Designation' ?
                    'var(--primary)' :
                    'var(--input_label)'
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
                      'var(--input_label)'
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
                    'var(--input_label)'
                }}
              ></div>
            </div>
          </div>
          <div className={styles.mainTopRight}>
            <Button
              onClick={() => {
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
                    mastersByType &&
                    mastersByType.success &&
                    mastersByType.data &&
                    JSON.parse(mastersByType.data)?.map((master, index) => (
                      <tr key={index}>
                        <td>
                          <Checkbox />
                        </td>
                        <td>{index + 1}</td>
                        <td>{master.MasterDisplayName}</td>
                        <td>Description</td>
                        <td>1 Jan 2024</td>
                        <td>5</td>
                        <td>Active</td>
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.circleSvg}>
                              <svg>
                                <use xlinkHref="sprite.svg#edit_icon" />
                              </svg>
                            </div>
                            <div className={styles.circleSvg}>
                              <svg>
                                <use xlinkHref="sprite.svg#delete_icon" />
                              </svg>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    mastersByType &&
                    mastersByType.success &&
                    mastersByType.data &&
                    JSON.parse(mastersByType.data)?.map((master, index) => (
                      <tr key={index}>
                        <td>
                          <Checkbox />
                        </td>
                        <td>{index + 1}</td>
                        <td>{master.MasterDisplayName}</td>
                        <td>25</td>
                        <td>1 Jan 2024</td>
                        <td>5</td>
                        <td>Active</td>
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.circleSvg}>
                              <svg>
                                <use xlinkHref="sprite.svg#edit_icon" />
                              </svg>
                            </div>
                            <div className={styles.circleSvg}>
                              <svg>
                                <use xlinkHref="sprite.svg#delete_icon" />
                              </svg>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
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
                    // resetAddGroupData();
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
                      value={addDesignationData.designation.value}
                      name={"designation"}
                      placeholder="Designation Name"
                      onChange={onDesignationChange}
                    />
                    <Input
                      type="text"
                      customStyle={{ marginTop: '1rem', }}
                      value={addDesignationData.description.value}
                      name={"description"}
                      placeholder="Description"
                      textAreaStyleClass={styles.textAreaStyleClass}
                      onChange={onDesignationChange}
                      textArea
                    />
                  </div>
                ) : (
                  <div>
                    <Input
                      type="text"
                      customStyle={{ marginTop: '1rem', }}
                      value={addOrganizationData.organization.value}
                      name={"organization"}
                      placeholder="Organization Name"
                      onChange={onOrganizationChange}
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
