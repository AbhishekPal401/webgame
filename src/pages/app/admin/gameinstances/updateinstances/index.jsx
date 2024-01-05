import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./updateinstances.module.css";
import InputDataContainer from "../../../../../components/ui/inputdatacontainer";
import PageContainer from "../../../../../components/ui/pagecontainer";
import Input from "../../../../../components/common/input";
import Button from "../../../../../components/common/button";
import { generateGUID, isJSONString } from "../../../../../utils/common";
import { getAllMasters } from "../../../../../store/app/admin/users/masters";
import {
    getScenarioNameAndIdDetails,
    resetScenarioNameAndIdDetailsState
} from "../../../../../store/app/admin/scenario/getScenarioNameAndId";
import {
    updateGameInstance,
    resetUpdateGameInstanceState
} from "../../../../../store/app/admin/gameinstances/updateGameInstance";
import {
    getGroupDetailsByOrgID,
    resetGroupDetailsByOrgIDState
} from "../../../../../store/app/admin/gameinstances/getGroupDetailsByOrgId";
import {
    getGamePlayerDetailsByGroupID,
    resetGamePlayerDetailsByGroupIDState
} from "../../../../../store/app/admin/gameinstances/getGamePlayersByGrpId";
import {
    getGameInstanceDetailsByID,
    resetGameInstanceDetailState
} from "../../../../../store/app/admin/gameinstances/getGameInstanceById";


const UpdateInstances = () => {
    const [gameInstanceData, setGameInstanceData] = useState({
        instanceName: {
            value: "",
            error: "",
        },
        instanceId: {
            value: "",
            error: "",
        },
        organization: {
            value: "",
            error: "",
        },
        groupName: {
            value: "",
            error: "",
        },
        groupId: {
            value: "",
            error: "",
        },
        groupSize: {
            value: "",
            error: "",
        },
        scenarioName: {
            value: "",
            error: "",
        },
        level: {
            value: "",
            error: "",
        },
        userId: {
            value: "",
            error: "",
        },
        instancePlayers: [],
    });

    // game levels
    const levels = ['Easy', 'Medium', 'Hard'];

    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const { instanceID } = useParams();


    const { masters, loading: masterLoading } = useSelector(
        (state) => state.masters
    );

    const { credentials } = useSelector((state) => state.login);

    const { updateGameInstanceResponse, loading: updateGameInstanceResponseLoading } =
        useSelector((state) => state.updateGameInstance);

    const { gameInstanceByIdDetails, loading: gameInstanceByIdDetailsLoading } =
        useSelector((state) => state.getGameInstanceById);

    const { groupByOrgIdDetails, loading: groupByOrgIdDetailsLoading } =
        useSelector((state) => state.getGroupDetailsByOrgId);

    const { scenarioNameAndIdDetails, loading: scenarioNameAndIdDetailsLoading } =
        useSelector((state) => state.getScenarioNameAndId);

    const { gamePlayersByGroupIdDetails, loading: gamePlayersByGroupIdDetailsLoading } =
        useSelector((state) => state.getGamePlayersByGrpId);

    const resetGameInstanceData = () => {
        setGameInstanceData({
            instanceName: {
                value: "",
                error: "",
            },
            instanceId: {
                value: "",
                error: "",
            },
            organization: {
                value: "",
                error: "",
            },
            groupName: {
                value: "",
                error: "",
            },
            groupId: {
                value: "",
                error: "",
            },
            groupSize: {
                value: "",
                error: "",
            },
            scenarioName: {
                value: "",
                error: "",
            },
            level: {
                value: "",
                error: "",
            },
            userId: {
                value: "",
                error: "",
            },
            instancePlayers: [],
        });
    };

    // DEBUG :: start
    useEffect(() => {
        if (gameInstanceByIdDetails === null ||
            gameInstanceByIdDetails === undefined ||
            groupByOrgIdDetails === null ||
            groupByOrgIdDetails === undefined) return;

        if (isJSONString(gameInstanceByIdDetails.data)) {
            console.log("gameInstanceByIdDetails :", JSON.parse(gameInstanceByIdDetails.data));

        }
        if (isJSONString(groupByOrgIdDetails.data)) {
            console.log("groupByOrgIdDetails :", JSON.parse(groupByOrgIdDetails.data));
        }
    }, []);

    useEffect(() => {
        console.log("game instance state :", gameInstanceData)

    }, [gameInstanceData]);

    //DEBUG :: end

    //dispatch request to get the the masters and getScenarioNameAndIdDetails
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getAllMasters());
            await dispatch(getScenarioNameAndIdDetails());

            // await dispatch(resetGroupDetailsByOrgIDState());
            // await dispatch(resetGamePlayerDetailsByGroupIDState());
            // resetGameInstanceData();
        };
        fetchData();
    }, []);


    // update game instances details
    useEffect(() => {
        if (updateGameInstanceResponse === null || updateGameInstanceResponse === undefined) return;

        if (updateGameInstanceResponse?.success) {
            toast.success(updateGameInstanceResponse?.message);
            if (instanceID) {

                const data = {
                    instanceID: instanceID,
                };
                dispatch(
                    getGameInstanceDetailsByID(data)
                );
                navigateTo(`/instances`);
            } else {
                resetGameInstanceData();
            }

            dispatch(resetUpdateGameInstanceState());
            dispatch(resetGameInstanceDetailState()); // look after
            dispatch(resetGroupDetailsByOrgIDState());
            dispatch(resetScenarioNameAndIdDetailsState());
            dispatch(resetGamePlayerDetailsByGroupIDState());

        } else if (!updateGameInstanceResponse.success) {
            if (instanceID) {

                const data = {
                    instanceID: instanceID,
                };
                dispatch(
                    getGameInstanceDetailsByID(data)
                );
            }
            toast.error(updateGameInstanceResponse?.message);
            dispatch(resetUpdateGameInstanceState());
        } else {
            dispatch(resetUpdateGameInstanceState());
        }
    }, [updateGameInstanceResponse]);


    // check if we have instanceID and dispatch a request to get game instace details by ID
    useEffect(() => {
        const fetchData = async () => {
            if (instanceID === null || instanceID === undefined) {
                resetGameInstanceData();
            } else {
                const data = {
                    instanceID: instanceID,
                };
                await dispatch(
                    getGameInstanceDetailsByID(data)
                );
            }
        }

        fetchData();
    }, [instanceID]);


    // set the updated data into Game Instance state
    const setGameInstanceDetailState = useCallback(() => {

        if (gameInstanceByIdDetails === null ||
            gameInstanceByIdDetails === undefined) return;

        if (isJSONString(gameInstanceByIdDetails.data)) {
            const data = JSON.parse(gameInstanceByIdDetails.data);
            console.log("data gameInstanceByIdDetails:", data);
            // map answers from questionByIdDetails
            const players = data?.InstanceUsers?.map((player) => {
                return {
                    playerId: {
                        value: player.UserID,
                        error: "",
                    },
                    playerName: {
                        value: player.UserName,
                        error: "",
                    },
                    playerRole: {
                        value: player.Role,
                        error: "",
                    },
                    playerGroupName: {
                        value: player.AssignGroup != null ? player.AssignGroup : "N/A",
                        error: "",
                    },
                };
            });

            const newData = {
                instanceName: {
                    value: data.InstanceDetailsByID.InstanceName,
                    error: "",
                },
                instanceId: {
                    value: data.InstanceDetailsByID.InstanceID,
                    error: "",
                },
                organization: {
                    value: data.InstanceDetailsByID.OrganizationID,
                    error: "",
                },
                groupName: {
                    value: data.InstanceDetailsByID.GroupID,
                    error: "",
                },
                groupId: {
                    value: data.InstanceDetailsByID.GroupID,
                    error: "",
                },
                groupSize: {
                    value: data.InstanceDetailsByID.SingleOrMultiplayer,
                    error: "",
                },
                scenarioName: {
                    value: data.InstanceDetailsByID.ScenarioID,
                    error: "",
                },
                level: {
                    value: data.InstanceDetailsByID.Level != null ? data.InstanceDetailsByID.Level : "N/A",
                    error: "",
                },
                userId: {
                    value: data.InstanceDetailsByID.UserID,
                    error: "",
                },
                instancePlayers: players,
            }

            console.log("setGameInstanceDetailState new data :", newData);
            setGameInstanceData(newData);
        }
    }, [gameInstanceByIdDetails]);

    useEffect(() => {
        if (gameInstanceByIdDetails === null ||
            gameInstanceByIdDetails === undefined
        ) return;

        setGameInstanceDetailState();
    }, [gameInstanceByIdDetails]);

    //  check if we have instanceID and dispatch a request to get groups by org id
    useEffect(() => {
        if (instanceID === null || instanceID === undefined) {
            resetGameInstanceData();
        } else if (
            gameInstanceByIdDetails === null ||
            gameInstanceByIdDetails === undefined) {
            return;
        }
        else if (gameInstanceData.organization.value === undefined ||
            gameInstanceData.organization.value === null) {

            console.log("organizationID is not present")
        }
        else {
            const data = {
                organizationID: gameInstanceData.organization.value,
            }
            console.log("organizationID data :", data);

            dispatch(getGroupDetailsByOrgID(data));

        }
    }, [gameInstanceByIdDetails]);

    //  check if we have instanceID and dispatch a request to get players by groups id
    useEffect(() => {
        if (instanceID === null || instanceID === undefined) {
            resetGameInstanceData();
        } else if (
            gameInstanceByIdDetails === null ||
            gameInstanceByIdDetails === undefined) {
            return;
        }
        else if (gameInstanceData.groupName.value === undefined ||
            gameInstanceData.groupName.value === null) {

            console.log("groupID is not present")
        }
        else {
            const data = {
                groupID: gameInstanceData.groupName.value,
            }
            console.log("groupID", data);

            dispatch(getGamePlayerDetailsByGroupID(data));
        }
    }, [gameInstanceByIdDetails]);

    // set the updated player data into Game Instance state
    const setGameInstanceDetailStateOnGroupChange = useCallback(() => {

        if (gamePlayersByGroupIdDetails === null ||
            gamePlayersByGroupIdDetails === undefined) return;

        if (isJSONString(gamePlayersByGroupIdDetails.data)) {
            const data = JSON.parse(gamePlayersByGroupIdDetails.data);
            console.log("gamePlayersByGroupIdDetails data :", data);
            // map answers from questionByIdDetails
            const players = data?.map((player) => {
                return {
                    playerId: {
                        value: player.UserID,
                        error: "",
                    },
                    playerName: {
                        value: player.UserName,
                        error: "",
                    },
                    playerRole: {
                        value: player.Role,
                        error: "",
                    },
                    playerGroupName: {
                        value: player.GroupName,
                        error: "",
                    },
                    playerDesignation: {
                        value: player.Designation,
                        error: "",
                    },
                    playerDesignationName: {
                        value: player.DesignationName,
                        error: "",
                    },
                };
            });

            const newData = (prevData) => ({
                ...prevData,
                instancePlayers: players,
            })

            setGameInstanceData(newData);
        }
    }, [gamePlayersByGroupIdDetails]);

    useEffect(() => {
        if (gamePlayersByGroupIdDetails === null ||
            gamePlayersByGroupIdDetails === undefined) return;

        setGameInstanceDetailStateOnGroupChange();
    }, [gamePlayersByGroupIdDetails]);

    const onChange = (event) => {
        console.log("onChange name : " + event.target.name + ", value : " + event.target.value)
        setGameInstanceData({
            ...gameInstanceData,
            [event.target.name]: {
                value: event.target.value,
                error: "",
            },
        });
    };

    const onOrganizationSelect = (event) => {
        if (event.target.value === "" || event.target.value === undefined || event.target.value === null) {
            console.log("onOrganizationSelect event.target.value :", event.target.value);

            setGameInstanceData({
                ...gameInstanceData,
                organization: {
                    value: "",
                    error: "",
                },
                groupName: {
                    value: "",
                    error: "",
                },
                instancePlayers: [],
            });

            dispatch(resetGroupDetailsByOrgIDState());
            dispatch(resetGamePlayerDetailsByGroupIDState());

            return;
        }

        console.log("onOrganizationSelect ", event.target.value)

        // set the organization id in game instance state  
        setGameInstanceData({
            ...gameInstanceData,
            organization: {
                value: event.target.value,
                error: "",
            },
            groupName: {
                value: "",
                error: "",
            },
            instancePlayers: [],
        });
        //dispatch a request to get the group names
        const data = {
            organizationID: event.target.value,
        }
        dispatch(getGroupDetailsByOrgID(data));
        dispatch(resetGamePlayerDetailsByGroupIDState());
    };

    const onGroupNameSelect = (event) => {
        if (event.target.value === "" || event.target.value === undefined || event.target.value === null) {
            console.log("onGroupNameSelect event.target.value :", event.target.value);
            resetGamePlayerDetailsByGroupIDState();
            setGameInstanceData({
                ...gameInstanceData,
                groupName: {
                    value: "",
                    error: "",
                },
                instancePlayers: [],
            });
            return;
        }
        console.log("onGroupNameSelect ", event.target.value)
        setGameInstanceData({
            ...gameInstanceData,
            groupName: {
                value: event.target.value,
                error: "",
            },
        });

        //dispatch a request to get the gaeme players by group ID
        const data = {
            groupID: event.target.value,
        }
        dispatch(getGamePlayerDetailsByGroupID(data));
    };

    const onGroupSizeSelect = (event) => {
        console.log("onGroupSizeSelect ", event.target.value)
        setGameInstanceData({
            ...gameInstanceData,
            groupSize: {
                value: event.target.value,
                error: "",
            },
        });
    };

    const onScenarioNameSelect = (event) => {
        console.log("onScenarioNameSelect ", event.target.value)
        setGameInstanceData({
            ...gameInstanceData,
            scenarioName: {
                value: event.target.value,
                error: "",
            },
        });
    };

    const onLevelSelect = (event) => {
        console.log("onLevelSelect ", event.target.value)
        setGameInstanceData({
            ...gameInstanceData,
            level: {
                value: event.target.value,
                error: "",
            },
        });
    };

    const onPlayerChange = (event, index, field) => {
        console.log("selcted option : ", event.target.value);
        setGameInstanceData((prevPlayerData) => {
            const updatedPlayers = [...prevPlayerData.instancePlayers];
            updatedPlayers[index][field].value = event.target.value;
            return {
                ...prevPlayerData,
                instancePlayers: updatedPlayers,
            };
        });
    };

    // Creat game instance on submit
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log("on submit");

        let valid = true;
        let data = { ...gameInstanceData };
        let updatedPlayers = [...gameInstanceData.instancePlayers];

        // validate the gameInstanceData fields
        if (gameInstanceData?.instanceName?.value === "") {
            console.log("instanceName:", data.instanceName);
            data = {
                ...data,
                instanceName: {
                    ...data.instanceName,
                    error: "Please enter instance name",
                },
            };

            valid = false;
        }

        if (gameInstanceData?.organization?.value === "") {
            console.log("organization:", data.organization);
            data = {
                ...data,
                organization: {
                    ...data.organization,
                    error: "Please select organization",
                },
            };

            valid = false;
        }

        if (gameInstanceData?.groupName?.value === "") {
            console.log("groupName:", data.groupName);
            data = {
                ...data,
                groupName: {
                    ...data.groupName,
                    error: "Please select group name",
                },
            };

            valid = false;
        }

        if (gameInstanceData?.groupSize?.value === "") {
            console.log("groupSize:", data.groupSize);
            data = {
                ...data,
                groupSize: {
                    ...data.groupSize,
                    error: "Please select group size",
                },
            };

            valid = false;
        }

        if (gameInstanceData?.scenarioName?.value === "") {
            console.log("scenarioName:", data.scenarioName);
            data = {
                ...data,
                scenarioName: {
                    ...data.scenarioName,
                    error: "Please select scenario name",
                },
            };

            valid = false;
        }

        if (gameInstanceData?.level?.value === "") {
            console.log("level:", data.level);
            data = {
                ...data,
                level: {
                    ...data.level,
                    error: "Please select level",
                },
            };

            valid = false;
        }

        // Validate each player in the updatedPlayers array
        updatedPlayers = updatedPlayers?.map((player) => {
            let updatedPlayer = { ...player };

            // Perform validation checks on each field of the player object

            if (player.playerName.value === "") {
                updatedPlayer.playerName.error = "Please enter the player name.";
                console.log("playerName:", player.playerName);
                valid = false;
            }

            if (player.playerGroupName.value === "") {
                updatedPlayer.playerGroupName.error = "Please enter the player group name.";
                console.log("playerGroupName:", player.playerGroupName);
                valid = false;
            }

            if (player.playerRole.value === "") {
                updatedPlayer.playerRole.error = "Please select next question.";
                console.log("playerRole:", player.playerRole);
                valid = false;
            }


            // if (player.playerId.value === "") {
            //     updatedPlayer.playerId.error = "Please enter the player ID.";
            //     console.log("playerId:", player.playerId);
            //     valid = false;
            // }

            return updatedPlayer;
        });

        // Update the answers array in the state with the validated answers
        data = {
            ...data,
            instancePlayers: updatedPlayers,
        };

        // TODO:: set the initial state to show errors


        if (valid) {

            const data = {
                instanceID: instanceID,
                instanceName: gameInstanceData?.instanceName?.value,
                scenarioID: gameInstanceData?.scenarioName?.value,
                organizationID: gameInstanceData?.organization?.value,
                level: gameInstanceData?.level?.value,
                groupID: gameInstanceData?.groupName?.value,
                singleOrMultiplayer: gameInstanceData?.groupSize?.value,
                userID: "",
                requester: {
                    requestID: generateGUID(),
                    requesterID: credentials.data.userID,
                    requesterName: credentials.data.userName,
                    requesterType: credentials.data.role,
                },
            };

            console.log("data to update : ", data);
            dispatch(updateGameInstance(data));
        }
        else {
            toast.error("Please fill all the details.")
        }

    };

    const onCancel = () => {

        resetGameInstanceData();
        console.log("on cancel gameInstacneData :", gameInstanceData)

        navigateTo(`/instances`);
    };

    return (
        <PageContainer>
            {/* Top container:: start */}
            <div className={styles.topContainer}>
                <div className={styles.left}>
                    <label>Executive Team</label>
                </div>
                <div className={styles.right}>
                </div>
            </div>
            {/* Top container:: end */}

            {/* Create game instances input main container:: start */}
            <div className={styles.mainContainer}>

                {/* Instance details:: start */}
                <InputDataContainer
                    customRightContainerStyles={{
                        transform: "scaleY(-1)",
                        backgroundPosition: 'bottom right',
                        padding: ' 3rem 1.5rem'
                    }}
                >
                    <div className={styles.instanceDetailsContainer} >
                        <div className={styles.instanceDetailsLabelContainer}>
                            <label className={styles.innerLabel}>Instance Details</label>
                        </div>
                        <div className={styles.instanceDetailsInputContainer}>
                            <div className={styles.firstRow}>
                                <div className={styles.field}>
                                    <Input
                                        labelStyle={styles.inputLabel}
                                        type="text"
                                        value={gameInstanceData.instanceName.value}
                                        customStyle={{ margin: '0' }}
                                        name={"instanceName"}
                                        placeholder="Instance Name"
                                        onChange={onChange}
                                    />
                                </div>
                                <div className={styles.field}>
                                    {/*Select Organization :: start */}
                                    <div>
                                        <select
                                            id="dropdown_organization"
                                            value={gameInstanceData.organization.value}
                                            className="select_input"
                                            onChange={onOrganizationSelect}
                                        >
                                            <option value={""}>Select Organization</option>

                                            {masters &&
                                                masters.data &&
                                                isJSONString(masters.data) &&
                                                Array.isArray(JSON.parse(masters.data)) &&
                                                JSON.parse(masters.data).map((item, index) => {
                                                    if (item.MasterType !== "Organization") return;
                                                    return (
                                                        <option value={item.MasterID} key={index}>
                                                            {/* change item.MasterID to 
                                                            MasterDisplayName inorder to
                                                             send the name insed of id to backend */}
                                                            {item.MasterDisplayName}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                    {/*Select Organization :: end */}
                                </div>
                                <div className={styles.field}>
                                    {/*Select Group Name :: start */}
                                    <div>
                                        <select
                                            id="dropdown_group_name"
                                            value={gameInstanceData.groupName.value}
                                            className="select_input"
                                            onChange={onGroupNameSelect}
                                        >
                                            <option value={""}>Group Name</option>

                                            {groupByOrgIdDetails &&
                                                groupByOrgIdDetails.data &&
                                                isJSONString(groupByOrgIdDetails.data) &&
                                                Array.isArray(JSON.parse(groupByOrgIdDetails.data)) &&
                                                JSON.parse(groupByOrgIdDetails.data).map((item, index) => {
                                                    if (!item.GroupID && !item.GroupName) return;
                                                    return (
                                                        <option value={item.GroupID} key={index}>
                                                            {item.GroupName}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                    {/*Select Group Name :: end */}
                                </div>
                                <div className={styles.field}>
                                    {/*Select Group Size :: start */}
                                    <div>
                                        <select
                                            id="dropdown_group_size"
                                            value={gameInstanceData.groupSize.value}
                                            className="select_input"
                                            onChange={onGroupSizeSelect}
                                        >
                                            <option value={""}>Group Size</option>
                                            {[...Array(6)].map((_, index) => (
                                                <option key={index + 1} value={index + 1}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/*Select Group Size :: end */}
                                </div>
                            </div>
                            <div className={styles.secondRow}>
                                <div className={styles.field}>
                                    {/*Select Sceanrio Name :: start */}
                                    <div>
                                        <select
                                            id="dropdown_scenario_name"
                                            value={gameInstanceData.scenarioName.value}
                                            className="select_input"
                                            onChange={onScenarioNameSelect}
                                        >
                                            <option value={""}>Select Scenario</option>

                                            {scenarioNameAndIdDetails &&
                                                scenarioNameAndIdDetails.data &&
                                                isJSONString(scenarioNameAndIdDetails.data) &&
                                                Array.isArray(JSON.parse(scenarioNameAndIdDetails.data)) &&
                                                JSON.parse(scenarioNameAndIdDetails.data).map((item, index) => {
                                                    if (!item.ScenarioID && !item.ScenarioName) return;
                                                    return (
                                                        <option value={item.ScenarioID} key={index}>
                                                            {item.ScenarioName}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                    {/*Select Sceanrio Name :: end */}
                                </div>
                                <div className={styles.field}>
                                    {/*Select level :: start */}
                                    <div>
                                        <select
                                            id="dropdown_level"
                                            value={gameInstanceData.level.value}
                                            className="select_input"
                                            onChange={onLevelSelect}
                                        >
                                            <option value={""}>Select Level</option>
                                            {levels.map((level, index) => (
                                                <option key={index} value={level}>
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/*Select level :: end */}
                                </div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </InputDataContainer>
                {/* Instance details:: end */}

                {/* Instance players:: start */}
                <InputDataContainer
                    customRightContainerStyles={{
                        backgroundSize: 'cover'
                    }}
                >
                    <div className={styles.instancePlayersContainer} >
                        <div className={styles.instancePlayersLabelContainer}>
                            <label className={styles.innerLabel}>Instance Players</label>
                        </div>
                        <div className={styles.instancePlayersInputContainer}>
                            {
                                gameInstanceData.instancePlayers &&
                                    gameInstanceData.instancePlayers.length > 0 ? (
                                    gameInstanceData.instancePlayers.map((player, index) => (
                                        <div key={index} className={styles.instancePlayersInputRow}>
                                            <div className={styles.field}>
                                                <Input
                                                    labelStyle={styles.inputLabel}
                                                    type="text"
                                                    value={player.playerName.value}
                                                    customStyle={{ margin: '0' }}
                                                    name={"playerName"}
                                                    placeholder="Player Name"
                                                    onChange={(e) => onPlayerChange(e, index, 'playerName')}
                                                    disabled
                                                />
                                            </div>

                                            {/*Select Group Name :: start */}
                                            <div className={styles.field}>
                                                <Input
                                                    labelStyle={styles.inputLabel}
                                                    type="text"
                                                    value={player.playerGroupName.value}
                                                    customStyle={{ margin: '0' }}
                                                    name={"playerGroupName"}
                                                    placeholder="Assign Group"
                                                    onChange={(e) => onPlayerChange(e, index, 'playerGroupName')}
                                                    disabled
                                                />
                                                {/* <div>
                                                <select
                                                    id="dropdown_player_group_name"
                                                    value={player.playerGroupName.value}
                                                    className="select_input"
                                                    onChange={(e) => onPlayerChange(e, index, 'playerGroupName')}
                                                    disabled
                                                >
                                                    <option value={""}>Assign Group</option>

                                                    {groupByOrgIdDetails &&
                                                        groupByOrgIdDetails.data &&
                                                        isJSONString(groupByOrgIdDetails.data) &&
                                                        Array.isArray(JSON.parse(groupByOrgIdDetails.data)) &&
                                                        JSON.parse(groupByOrgIdDetails.data).map((item, index) => {
                                                            if (!item.GroupID && !item.GroupName) return;
                                                            return (
                                                                <option value={item.GroupID} key={index}>
                                                                    {item.GroupName}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div> */}
                                            </div>
                                            {/*Select Group Name :: end */}

                                            {/*Select Role  :: start */}
                                            <div className={styles.field}>
                                                <div>
                                                    <select
                                                        id="dropdown_player_designation"
                                                        value={player.playerDesignation.value}
                                                        className="select_input"
                                                        placeholder="Assign Role"
                                                        onChange={(e) => onPlayerChange(e, index, 'playerDesignation')}
                                                    >
                                                        <option value={""}>Assign Role</option>

                                                        {masters &&
                                                            masters.data &&
                                                            isJSONString(masters.data) &&
                                                            Array.isArray(JSON.parse(masters.data)) &&
                                                            JSON.parse(masters.data).map((item, index) => {
                                                                if (item.MasterType !== "Designation") return;
                                                                return (
                                                                    <option value={item.MasterID} key={index}>
                                                                        {item.MasterDisplayName}
                                                                    </option>
                                                                );
                                                            })}
                                                    </select>
                                                </div>
                                            </div>

                                            {/*Select Role:: end */}
                                            <div className={styles.field}></div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noInstancePlayerContainer}>
                                        <p>
                                            <label>Please select a group to load players</label>
                                        </p>
                                    </div>
                                )}

                        </div>
                    </div>
                </InputDataContainer>
                {/* Instance players:: start */}

            </div>
            {/* Create game instances input main container:: end */}

            {/* Button container:: start */}
            <div className={styles.buttonContainer}>
                <Button buttonType="cancel"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button onClick={onSubmit}>
                    Save
                </Button>
            </div>
            {/* Button container:: end */}
        </PageContainer>
    );
}

export default UpdateInstances;