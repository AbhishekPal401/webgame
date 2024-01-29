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


const GameInstances = () => {
    const [pageCount, setPageCount] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { credentials } = useSelector((state) => state.login);
    const { gameInstancesByPage } = useSelector((state) => state.gameInstances);

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
                        </div>
                        <div className={styles.mainTopContainerRight}>
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
                                                    <td>{index + 1}</td>
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
                                                                    height="14"
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
                                                                    if (isSelected && gameInstance.Status !== "Completed") {
                                                                        navigate(`/instances/updateinstances/${gameInstance.InstanceID}`);
                                                                    }
                                                                }}
                                                            >
                                                                <svg
                                                                    height="14"
                                                                    width="14"
                                                                    style={{
                                                                        opacity: (isSelected &&
                                                                            gameInstance.Status !== "Completed") ? "1" : "0.3"
                                                                    }}
                                                                >
                                                                    <use xlinkHref="sprite.svg#edit_icon" />
                                                                </svg>
                                                            </div>
                                                            <div className={styles.circleSvg}>
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
        </PageContainer>

    );
}

export default GameInstances;