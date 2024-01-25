import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./viewinstances.module.css";
import PageContainer from "../../../../../components/ui/pagecontainer";
import InputDataContainer from "../../../../../components/ui/inputdatacontainer";
import Button from "../../../../../components/common/button";
import SelectedTree from "../../../../../components/trees/selectedTree";
import OptimalTree from "../../../../../components/trees/mission";
import { generateGUID } from "../../../../../utils/common";
import { getInstanceSummaryById, resetInstanceSummaryByIDState } from "../../../../../store/app/admin/gameinstances/instanceSummary";
import { getInstanceProgressyById, resetInstanceProgressByIDState } from "../../../../../store/app/admin/gameinstances/getInstanceProgress";
import {
    getOverviewGameDetailsById,
    resetOverviewGameDetailState
} from "../../../../../store/app/admin/gameinstances/getOverviewGameDetails";
import { formatDateString, formatTime } from "../../../../../utils/helper";
import { toast } from "react-toastify";

const Tabs = ({
    activeTab,
    onTabClick
}) => {
    return (
        <div className={styles.tabs}>
            <div
                className={styles.selectedContainer}
                onClick={() => onTabClick("Selected")}
            >
                <div>
                    <label
                        style={{
                            color: activeTab === 'Selected' ?
                                'var(--primary)' :
                                'var(--input_label)'
                        }}
                    >Selected</label>
                </div>
                <div
                    style={{
                        backgroundColor: activeTab === 'Selected' ?
                            'var(--primary)' :
                            'var(--input_label)'
                    }}
                ></div>
            </div>
            <div
                className={styles.optimalContainer}
                onClick={() => onTabClick("Optimal")}
            >
                <div>
                    <label
                        style={{
                            color: activeTab === 'Optimal' ?
                                'var(--primary)' :
                                'var(--input_label)'
                        }}
                    >Optimal</label>
                </div>
                <div
                    style={{
                        backgroundColor: activeTab === 'Optimal' ?
                            'var(--primary)' :
                            'var(--input_label)'
                    }}
                ></div>
            </div>
        </div>
    );
}

const ViewInstances = () => {

    const [activeTab, setActiveTab] = useState('Selected');

    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const { instanceID } = useParams();

    const { credentials } = useSelector((state) => state.login);
    const { instanceSummary } = useSelector((state) => state.instanceSummary);
    const { getOverviewGameByIdDetails } = useSelector((state) => state.getOverviewGameDetails);
    const { instanceProgress } = useSelector(
        (state) => state.getInstanceProgress
    );

    // console.log("instanceSummary :", instanceSummary);
    // console.log("instanceProgress :", instanceProgress);

    // console.log("getOverviewGameByIdDetails :", getOverviewGameByIdDetails);

    useEffect(() => {
        if (instanceID && credentials) {
            const data = {
                instanceID: instanceID,
                userID: credentials.data.userID,
                isAdmin: true,
                requester: {
                    requestID: generateGUID(),
                    requesterID: credentials.data.userID,
                    requesterName: credentials.data.userName,
                    requesterType: credentials.data.role,
                },
            };

            dispatch(getInstanceSummaryById(data));
            dispatch(getInstanceProgressyById(data));
            dispatch(getOverviewGameDetailsById(data));
        }
        return () => {
            dispatch(resetInstanceSummaryByIDState());
            dispatch(resetInstanceProgressByIDState());
            dispatch(resetOverviewGameDetailState());
        }
    }, []);


    // useEffect(() => {
    //     if (getOverviewGameByIdDetails === undefined || getOverviewGameByIdDetails === null)
    //         return;

    //     if (getOverviewGameByIdDetails.success === false) {
    //         toast.error(getOverviewGameByIdDetails.message)
    //     }

    // }, [getOverviewGameByIdDetails]);

    const handleTabClick = useCallback(
        (tab) => {
            setActiveTab(tab);
        },
        [setActiveTab]
    );


    return (
        <PageContainer>
            <div
                style={{
                    background: 'url("./images/particles-yellow.png") top right no-repeat',
                    backgroundSize: '80%',
                }}>

                {/* Top container:: start */}
                <div className={styles.topContainer}>
                    <div className={styles.left}>
                        <label>View Instances</label>
                    </div>
                    <div className={styles.right}>
                    </div>
                </div>
                {/* Top container:: end */}

                {/*View instances main container:: start */}
                <div className={styles.mainContainer}>

                    {/* Instance details:: start */}
                    <InputDataContainer
                        customRightContainerStyles={{
                            transform: "scaleY(-1)",
                            backgroundPosition: 'bottom right',
                            padding: ' 4rem 1.5rem'
                        }}
                    >
                        <div className={styles.dataContainer}>
                            <div className={styles.tabsContainer}>
                                <Tabs
                                    activeTab={activeTab}
                                    onTabClick={handleTabClick}
                                />
                                <div>
                                    {/* <hr /> */}
                                </div>
                                <div className={styles.emptyContainer}></div>
                            </div>
                            <div className={styles.treeDataContainer}>
                                <div className={styles.treeLeft}>
                                    {instanceSummary &&
                                        instanceSummary.data &&
                                        instanceSummary.data.Summary &&
                                        instanceProgress &&
                                        instanceProgress.data &&
                                        instanceProgress.data.Summary && (
                                            <>
                                                {activeTab === 'Selected' ? (
                                                    <SelectedTree
                                                        data={instanceProgress.data.Summary}
                                                        userType="admin"
                                                    />
                                                ) : (
                                                    <OptimalTree data={instanceSummary.data.Summary} />
                                                )}
                                            </>
                                        )}
                                </div>
                                <div className={styles.verticalLine}>
                                </div>
                                <div className={styles.treeRight}>
                                    {/* {getOverviewGameByIdDetails &&
                                        getOverviewGameByIdDetails.success &&
                                        getOverviewGameByIdDetails.data &&
                                        getOverviewGameByIdDetails.data.map(
                                            (data, index) => (
                                                <div key={index} className={styles.treeRightContainer}>
                                                    <div className={styles.treeRightTop}>
                                                        <div>
                                                            <div>
                                                                Game Played On
                                                            </div>
                                                            <div>
                                                                - {data.GamePlayedOn && formatDateString(data.GamePlayedOn)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                Time Spend
                                                            </div>
                                                            <div>- {data.TimeSpend && formatTime(data.TimeSpend)}</div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                Score
                                                            </div>
                                                            <div>- {data.Score}</div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                Game Scenario
                                                            </div>
                                                            <div>- {data.GameScenario}</div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                Game Instance
                                                            </div>
                                                            <div>- {data.GameInstance}</div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                Organization Name
                                                            </div>
                                                            <div>- {data.OrganizationName}</div>
                                                        </div>
                                                    </div>
                                                    <div className={styles.treeRightBottom}>
                                                        <div>
                                                            Players Details
                                                        </div>
                                                        <div className={styles.playerDetails}>
                                                            <div className={styles.head}>
                                                                <div>Players Name</div>
                                                                <div>Role Played</div>
                                                            </div>
                                                            <div className={styles.body}>
                                                                {data &&
                                                                    data.Players &&
                                                                    data.Players.map(
                                                                        (player, playerIndex) => (
                                                                            <div key={playerIndex} className={styles.row}>
                                                                                <div>{player.PlayersName}</div>
                                                                                <div>{player.RolePlayed}</div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )} */}

                                    {getOverviewGameByIdDetails &&
                                        (getOverviewGameByIdDetails.success) ? (
                                        getOverviewGameByIdDetails.data &&
                                        getOverviewGameByIdDetails.data.map((data, index) => (
                                            <div key={index} className={styles.treeRightContainer}>
                                                <div className={styles.treeRightTop}>
                                                    <div>
                                                        <div>Game Played On</div>
                                                        <div>- {data.GamePlayedOn && formatDateString(data.GamePlayedOn)}</div>
                                                    </div>
                                                    <div>
                                                        <div>Time Spend</div>
                                                        <div>- {data.TimeSpend && formatTime(data.TimeSpend)}</div>
                                                    </div>
                                                    <div>
                                                        <div>Score</div>
                                                        <div>- {data.Score}</div>
                                                    </div>
                                                    <div>
                                                        <div>Game Scenario</div>
                                                        <div>- {data.GameScenario}</div>
                                                    </div>
                                                    <div>
                                                        <div>Game Instance</div>
                                                        <div>- {data.GameInstance}</div>
                                                    </div>
                                                    <div>
                                                        <div>Organization Name</div>
                                                        <div>- {data.OrganizationName}</div>
                                                    </div>
                                                </div>
                                                <div className={styles.treeRightBottom}>
                                                    <div>Players Details</div>
                                                    <div className={styles.playerDetails}>
                                                        <div className={styles.head}>
                                                            <div>Players Name</div>
                                                            <div>Role Played</div>
                                                        </div>
                                                        <div className={styles.body}>
                                                            {data &&
                                                                data.Players &&
                                                                data.Players.map((player, playerIndex) => (
                                                                    <div key={playerIndex} className={styles.row}>
                                                                        <div>{player.PlayersName}</div>
                                                                        <div>{player.RolePlayed}</div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        (getOverviewGameByIdDetails &&
                                            getOverviewGameByIdDetails.message &&
                                            <div className={styles.progressMessage}>
                                                {getOverviewGameByIdDetails.message}
                                            </div>
                                        )

                                    )}

                                </div>
                            </div>
                        </div>
                    </InputDataContainer>
                </div>
                {/*View instances main container:: end */}

                {/* Button container:: start */}
                <div className={styles.buttonContainer}>
                    <Button buttonType="cancel"
                        onClick={() => {
                            navigateTo(`/instances`);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                    // onClick={onSubmit}
                    >
                        Export
                    </Button>
                </div>
                {/* Button container:: end */}
            </div>
        </PageContainer>

    );
};

export default ViewInstances;