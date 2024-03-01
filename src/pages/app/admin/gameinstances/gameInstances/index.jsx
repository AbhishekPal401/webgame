import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "../../../../../components/ui/pagecontainer";
import styles from "./gameinstances.module.css";
import Button from "../../../../../components/common/button";
import Checkbox from "../../../../../components/ui/checkbox";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getGameInstancesByPage } from "../../../../../store/app/admin/gameinstances/gameInstances";
import { generateGUID, isJSONString } from "../../../../../utils/common";
import { formatDateString } from "../../../../../utils/helper";
import Pagination from "../../../../../components/ui/pagination/index.jsx";
import ModalContainer from "../../../../../components/modal/index.jsx";
import {
    deleteGameInstanceByID,
    resetDeleteGameInstanceState
} from "../../../../../store/app/admin/gameinstances/deleteGameInstance.js";
import {
    clearAllGameInstances,
    resetClearAllGameInstancesState
} from "../../../../../store/app/admin/gameinstances/clearAllInstances.js";
import { toast } from "react-toastify";


const GameInstances = () => {
    const [pageCount, setPageCount] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [showClearAllModal, setClearAllModal] = useState(null);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { credentials } = useSelector((state) => state.login);
    const { gameInstancesByPage } = useSelector((state) => state.gameInstances);
    const { deleteGameInstanceResponse } = useSelector((state) => state.deleteGameInstance);
    const { clearAllGameInstancesResponse } = useSelector((state) => state.clearAllInstances);

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

            dispatch(getGameInstancesByPage(data));
        }

    }, []);

    useEffect(() => {
        if (gameInstancesByPage && isJSONString(gameInstancesByPage?.data)) {
            const newPageNumber = JSON.parse(gameInstancesByPage?.data)?.CurrentPage;

            if (newPageNumber && typeof newPageNumber === "number") {
                setPageNumber(newPageNumber);
            }
        }
    }, [gameInstancesByPage]);

    useEffect(() => {
        if (deleteGameInstanceResponse === null || deleteGameInstanceResponse === undefined) return;

        if (deleteGameInstanceResponse.success) {
            toast.success(deleteGameInstanceResponse.message);
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

            dispatch(getGameInstancesByPage(data));
            dispatch(resetDeleteGameInstanceState());
            setShowDeleteModal(null);
            setSelectedCheckboxes([]);
        } else if (!deleteGameInstanceResponse.success) {
            toast.error(deleteGameInstanceResponse.message);
        }
    }, [deleteGameInstanceResponse]);

    useEffect(() => {
        if (clearAllGameInstancesResponse === null || clearAllGameInstancesResponse === undefined) return;

        if (clearAllGameInstancesResponse.success) {
            toast.success(clearAllGameInstancesResponse.message);
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

            dispatch(getGameInstancesByPage(data));
            dispatch(resetClearAllGameInstancesState());
            setClearAllModal(null);
            setSelectedCheckboxes([]);
        } else if (!clearAllGameInstancesResponse.success) {
            toast.error(clearAllGameInstancesResponse.message);
        }
    }, [clearAllGameInstancesResponse]);

    // DEBUG :: Start
    // useEffect(() => {
    //     gameInstancesByPage &&
    //         gameInstancesByPage.success &&
    //         gameInstancesByPage.data

    //     // console.log("gameInstancesByPage : ", gameInstancesByPage);
    //     // console.log("gameInstancesByPage.data : ", gameInstancesByPage.data);
    //     console.log("JSON.parse(gameInstancesByPage.data) : ", JSON.parse(gameInstancesByPage.data));
    // }, [gameInstancesByPage]);

    // DEBUG :: End


    const handleCheckboxChange = (insatanceId) => {
        const isSelected = selectedCheckboxes.includes(insatanceId);
        const updatedRows = isSelected
            ? selectedCheckboxes.filter((row) => row !== insatanceId)
            : [...selectedCheckboxes, insatanceId];

        setSelectedCheckboxes(updatedRows);
    };

    const onDeleteInsatnce = () => {
        const data = {
            instanceID: showDeleteModal.InstanceID,
            requester: {
                requestID: generateGUID(),
                requesterID: credentials.data.userID,
                requesterName: credentials.data.userName,
                requesterType: credentials.data.role,
            },
        };

        dispatch(deleteGameInstanceByID(data));
    };

    const onClearAllInsatnces = () => {
        if (showClearAllModal === "Clear") {
            const data = {
                requestID: generateGUID(),
                requesterID: credentials.data.userID,
                requesterName: credentials.data.userName,
                requesterType: credentials.data.role,
            };
            dispatch(clearAllGameInstances(data));
        }
    };

    const navigateTo = () => {
        navigate(`/instances/createinstances`);
    };

    return (
        <PageContainer>
            <div className={styles.conatiner}>
                <div className={styles.topContainer}>
                    <div className={styles.left}>
                        <label>Game Instances</label>
                    </div>
                    <div className={styles.right}>
                    </div>
                </div>
                {/* Game Istances Table Container:: start */}
                <div className={styles.mainContainer}>
                    <div className={styles.mainTopContainer}>
                        <div className={styles.mainTopContainerLeft}>
                            <div>
                                <label>Users</label>
                            </div>
                            <div>
                                <Link to="">See All</Link>
                            </div>
                        </div>
                        <div className={styles.mainTopContainerRight}>
                            <Button
                                onClick={() => {
                                    setClearAllModal("Clear");
                                }}
                            >
                                Clear All
                            </Button>
                            <Button onClick={navigateTo} >Create New Instance</Button>
                        </div>
                    </div>
                    {/* Tabel :: start */}
                    <div className={styles.mainTableContainer}>
                        <table className={styles.table_content}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>#</th>
                                    <th>Instance Name</th>
                                    {/* <th>Version</th> */}
                                    <th>Scenario Name</th>
                                    <th>Date Created</th>
                                    <th>Date Played</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {gameInstancesByPage &&
                                    gameInstancesByPage.success &&
                                    gameInstancesByPage.data &&
                                    JSON.parse(gameInstancesByPage.data).InstanceDetails.map(
                                        (gameInstance, index) => {
                                            const isSelected = selectedCheckboxes.includes(gameInstance.InstanceID);
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onChange={() => handleCheckboxChange(gameInstance.InstanceID)}
                                                        />
                                                    </td>
                                                    {/* <td>{index + 1}</td> */}
                                                    <td>{index + pageCount * (pageNumber - 1) + 1}</td>
                                                    <td>
                                                        {gameInstance.InstanceName}
                                                    </td>
                                                    {/* <td
                                                        className={styles.scenarioDescription}

                                                    >
                                                        Version
                                                    </td> */}
                                                    <td>{gameInstance.ScenarioName}</td>
                                                    <td>
                                                        {
                                                            formatDateString(gameInstance.CreatedAt) !== "Invalid Date" &&
                                                            formatDateString(gameInstance.CreatedAt)
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            gameInstance.Status === "Completed" &&
                                                            formatDateString(gameInstance.DatePlayed) !== "Invalid Date" &&
                                                            formatDateString(gameInstance.DatePlayed)
                                                        }
                                                    </td>
                                                    <td>{gameInstance.Status}</td>
                                                    <td >
                                                        <div className={styles.actions}>
                                                            <div
                                                                className={styles.circleSvg}
                                                                onClick={() => {
                                                                    if (isSelected && gameInstance.Status === "Completed") {
                                                                        navigate(`/instances/viewinstances/${gameInstance.InstanceID}`);
                                                                    }
                                                                }}
                                                            >
                                                                <svg
                                                                    height="10"
                                                                    width="14"
                                                                    style={{
                                                                        opacity: (isSelected &&
                                                                            gameInstance.Status === "Completed") ? "1" : "0.3"
                                                                    }}
                                                                >
                                                                    <use xlinkHref="sprite.svg#view_icon" />
                                                                </svg>
                                                            </div>
                                                            <div className={styles.circleSvg}
                                                                onClick={() => {
                                                                    if (isSelected && gameInstance.Status === "Create") {
                                                                        navigate(`/instances/updateinstances/${gameInstance.InstanceID}`);
                                                                    }
                                                                }}
                                                            >
                                                                <svg
                                                                    height="12"
                                                                    width="12"
                                                                    style={{
                                                                        opacity: (isSelected &&
                                                                            gameInstance.Status === "Create") ? "1" : "0.3"
                                                                    }}
                                                                >
                                                                    <use xlinkHref="sprite.svg#edit_icon" />
                                                                </svg>
                                                            </div>
                                                            <div
                                                                className={styles.circleSvg}
                                                                onClick={() => {
                                                                    if (isSelected &&
                                                                        (gameInstance.Status === "Create" ||
                                                                            gameInstance.Status === "Completed")) {
                                                                        setShowDeleteModal(gameInstance);
                                                                    }
                                                                }}
                                                            >
                                                                <svg
                                                                    height="14"
                                                                    width="12"
                                                                    style={{
                                                                        opacity: (isSelected &&
                                                                            (gameInstance.Status === "Create" ||
                                                                                gameInstance.Status === "Completed")) ? "1" : "0.3"
                                                                    }}
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
                        {gameInstancesByPage &&
                            gameInstancesByPage.success &&
                            gameInstancesByPage.data && (
                                <div className={styles.paginationContainer}>
                                    <Pagination
                                        totalCount={JSON.parse(gameInstancesByPage.data)?.TotalCount}
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

                                            dispatch(getGameInstancesByPage(data));
                                        }}
                                    />
                                </div>
                            )}
                    </div>
                    {/* Table :: end */}
                </div>

                {/* Game Istances Table Container:: end */}
            </div>
            {showDeleteModal && (
                <ModalContainer>
                    <div className="modal_content">
                        <div className="modal_header">
                            <div>Delete Game Instance</div>
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
                            Are you sure you want to delete this instance ?
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
                                onClick={onDeleteInsatnce}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {showClearAllModal && (
                <ModalContainer>
                    <div className="modal_content">
                        <div className="modal_header">
                            <div>Clear All Game Instances</div>
                            <div>
                                <svg
                                    className="modal_crossIcon"
                                    onClick={() => {
                                        setClearAllModal(null);
                                    }}
                                >
                                    <use xlinkHref={"sprite.svg#crossIcon"} />
                                </svg>
                            </div>
                        </div>
                        <div className="modal_description">
                            Are you sure you want to clear all the game sessions?
                        </div>

                        <div className="modal_buttonContainer">
                            <Button
                                buttonType={"cancel"}
                                onClick={() => {
                                    setClearAllModal(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                customStyle={{
                                    marginLeft: "1rem",
                                }}
                                onClick={onClearAllInsatnces}
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </PageContainer>

    );
}

export default GameInstances;