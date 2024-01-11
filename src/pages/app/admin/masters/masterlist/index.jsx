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
import ButtonLink from "../../../../../components/common/ButtonLink/index.jsx";
import {
  getMastersByType,
  resetMastersByTypeState
} from "../../../../../store/app/admin/masters/mastersByType.js";
import {
  createMaster,
  resetCreateMasterState
} from "../../../../../store/app/admin/masters/createMaster.js";


const MasterList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addMasterData, setAddMasterData] = useState({
    designation: { value: '', error: '' },
    description: { value: '', error: '' },
    organization: { value: '', error: '' },
  });

  const [activeTab, setActiveTab] = useState('Designation');
  const [showModal, setShowModal] = useState(false);

  const { mastersByType, loading: masterLoading } = useSelector((state) => state.mastersByType);

  const { createMasterResponse, loading: createMasterResponseLoading } =
    useSelector((state) => state.createMaster);

  const { credentials } = useSelector((state) => state.login);

  const resetAddMasterData = useCallback(() => {
    setAddMasterData({
      designation: { value: '', error: '' },
      description: { value: '', error: '' },
      organization: { value: '', error: '' },
    });
  }, []);

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
    },
    [setActiveTab]
  );

  // on add Group details
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
          masterID: "", //TODO:: not implemented at backend
          masterName: (activeTab === 'Designation' ?
            addMasterData?.designation?.value :
            addMasterData?.organization?.value),
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

  useEffect(() => {
    if (credentials) {
      const data = {
        masterType: activeTab === 'Designation' ? 'Designation' : 'Organization',
      };
      dispatch(getMastersByType(data));
    }
  }, [activeTab, dispatch, credentials]);

  useEffect(() => {
    if (createMasterResponse === null || createMasterResponse === undefined) return;

    if (createMasterResponse?.success) {
      console.log("Master created")
      toast.success("Add master data successfull");

      const fetchMasterData = {
        masterType: activeTab === 'Designation' ? 'Designation' : 'Organization',
      };
      dispatch(getMastersByType(fetchMasterData));

      resetAddMasterData();
      setShowModal(false);
      dispatch(resetCreateMasterState());

    } else if (!createMasterResponse.success) {
      console.log(" error : ", createMasterResponse?.message)
      // toast.error(createMasterResponse?.message);
      toast.error("An error occured while saving the master data.");
      dispatch(resetCreateMasterState());
    } else {
      dispatch(resetCreateMasterState());
    }
  }, [createMasterResponse]);

  return (
    <PageContainer>
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label>Master List</label>
        </div>
        <div 
          style={{ backgroundImage: `url("./images/binary.png") `}}
          className={styles.right}
        >
          <img src="./images/scenario.png" />
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div
          style={{  backgroundImage: `url("./images/particles.png")` }} 
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
                    mastersByType &&
                    mastersByType?.success &&
                    mastersByType?.data &&
                    JSON.parse(mastersByType?.data)?.map((master, index) => (
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
                          {/* <div className={styles.actions}>
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
                          </div> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    mastersByType &&
                    mastersByType?.success &&
                    mastersByType?.data &&
                    JSON.parse(mastersByType?.data)?.map((master, index) => (
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
                          {/* <div className={styles.actions}>
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
                          </div> */}
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

      {/* Modal Container :: end*/}
    </PageContainer>
  );
};

export default MasterList;
