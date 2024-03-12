import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./createinstances.module.css";
import InputDataContainer from "../../../../../components/ui/inputdatacontainer";
import PageContainer from "../../../../../components/ui/pagecontainer";
import Input from "../../../../../components/common/input";
import Button from "../../../../../components/common/button";
import ModalContainer from "../../../../../components/modal";
import SearchUsers from "../../../../../components/ui/searchusers";
import UsersList from "../../../../../components/ui/userslist";
import { generateGUID, isJSONString } from "../../../../../utils/common";
import { baseUrl } from "../../../../../middleware/url";
import { getAllMasters } from "../../../../../store/app/admin/users/masters";
import {
    getScenarioNameAndIdDetails,
    resetScenarioNameAndIdDetailsState
} from "../../../../../store/app/admin/scenario/getScenarioNameAndId";
import {
    createGameInstance,
    resetCreateGameInstanceState
} from "../../../../../store/app/admin/gameinstances/createGameInstance";
import {
    getGroupDetailsByOrgID,
    resetGroupDetailsByOrgIDState
} from "../../../../../store/app/admin/gameinstances/getGroupDetailsByOrgId";
import {
    getGamePlayerDetailsByGroupID,
    resetGamePlayerDetailsByGroupIDState
} from "../../../../../store/app/admin/gameinstances/getGamePlayersByGrpId";
import {
    createGroup,
    resetCreateGroupState
} from "../../../../../store/app/admin/groups/createGroup";
import {
    createGroupUsers,
    resetCreateGroupUsersState
} from "../../../../../store/app/admin/groups/createGroupUsers";
import {
    getUsersbyPage,
    resetUserState,
} from "../../../../../store/app/admin/users/users";
import { debounce } from "../../../../../utils/helper";



const CreateInstances = () => {
    const [gameInstanceData, setGameInstanceData] = useState({
        instanceName: {
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
        instancePlayers: [],
    });

    const [addGroupData, setAddGroupData] = useState({
        groupName: {
            value: "",
            error: "",
        },
        organizationId: {
            value: "",
            error: "",
        },
        users: [],
        addedUsers: [],
    });

    const [searchValue, setSearchValue] = useState('');
    const [showAddGroupModal, setShowAddGroupModal] = useState(null);

    // game levels
    const levels = ['Easy', 'Medium', 'Hard'];

    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    const { masters, loading: masterLoading } = useSelector(
        (state) => state.masters
    );

    const { credentials } = useSelector((state) => state.login);

    const { createGameInstanceResponse, loading: createGameInstanceResponseLoading } =
        useSelector((state) => state.createGameInstance);

    const { createGroupResponse, loading: createGroupResponseLoading } =
        useSelector((state) => state.createGroup);

    const { createGroupUsersResponse, loading: createGroupUsersResponseLoading } =
        useSelector((state) => state.createGroupUsers);

    const { groupByOrgIdDetails, loading: groupByOrgIdDetailsLoading } =
        useSelector((state) => state.getGroupDetailsByOrgId);

    const { scenarioNameAndIdDetails, loading: scenarioNameAndIdDetailsLoading } =
        useSelector((state) => state.getScenarioNameAndId);

    const { gamePlayersByGroupIdDetails, loading: gamePlayersByGroupIdDetailsLoading } =
        useSelector((state) => state.getGamePlayersByGrpId);

    const { usersByPage, loading: usersByPageLoading } =
        useSelector((state) => state.users);

    const resetGameInstanceData = () => {
        setGameInstanceData({
            instanceName: {
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
            instancePlayers: [],
        });
    };

    const resetAddGroupData = () => {
        setAddGroupData({
            groupName: {
                value: "",
                error: "",
            },
            organizationId: {
                value: "",
                error: "",
            },
            users: [],
            addedUsers: [],
        })
    };

    //dispatch request to get the the masters and questionDetailsById
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getAllMasters());
            await dispatch(getScenarioNameAndIdDetails());
            await dispatch(resetGroupDetailsByOrgIDState());
            await dispatch(resetGamePlayerDetailsByGroupIDState());
            resetGameInstanceData();
        };
        fetchData();

        // return() => {
        //     console.log("Cleanup executed.")
        //     dispatch(resetGroupDetailsByOrgIDState());
        //     dispatch(resetGamePlayerDetailsByGroupIDState());
        //     resetGameInstanceData();
        // }
    }, []);

    //update game instance details
    useEffect(() => {
        if (createGameInstanceResponse === null || createGameInstanceResponse === undefined) return;

        if (createGameInstanceResponse?.success) {
            toast.success(createGameInstanceResponse?.message);
            resetGameInstanceData();

            dispatch(resetCreateGameInstanceState());
            dispatch(resetGroupDetailsByOrgIDState());
            dispatch(resetScenarioNameAndIdDetailsState());
            dispatch(resetGamePlayerDetailsByGroupIDState());

            navigateTo(`/instances`);

        } else if (!createGameInstanceResponse.success) {
            console.log(" error : ", createGameInstanceResponse?.message)
            // toast.error(createGameInstanceResponse?.message);
            toast.error(createGameInstanceResponse?.message);
            dispatch(resetCreateGameInstanceState());
        } else {
            dispatch(resetCreateGameInstanceState());
        }
    }, [createGameInstanceResponse]);

    //update group details
    useEffect(() => {
        if (createGroupResponse === null || createGroupResponse === undefined) return;

        if (createGroupResponse?.success) {
            // toast.success(createGroupResponse?.message);

            console.log("createGroupResponse :", createGroupResponse)

            try {
                console.log("createGroupResponse :", JSON.parse(createGroupResponse.data))
                const createdGroupData = JSON.parse(createGroupResponse.data);
                console.log("createdGroupData :", createdGroupData)
                console.log("addGroupData?.addedUsers :", addGroupData?.addedUsers)

                if (createdGroupData?.GroupID) {
                    const data = {
                        groupID: createdGroupData?.GroupID,
                        userIds: addGroupData?.addedUsers,
                        requester: {
                            requestID: generateGUID(),
                            requesterID: credentials.data.userID,
                            requesterName: credentials.data.userName,
                            requesterType: credentials.data.role,
                        },
                    };

                    console.log("createGroupUsers data to update : ", data);
                    dispatch(createGroupUsers(data));

                } else {
                    toast.error("Please fill all the mandatory details.");
                }
            } catch (error) {
                toast.error("An error occurred while saving the group users.");
                console.error("Saving group users error:", error);
            }

            resetAddGroupData();
            dispatch(resetCreateGroupState());
            setShowAddGroupModal(null);

        } else if (!createGroupResponse.success) {

            toast.error(createGroupResponse?.message);
            dispatch(resetCreateGroupState());
        } else {
            dispatch(resetCreateGroupState());
        }
    }, [createGroupResponse]);

    // update group user details
    useEffect(() => {
        if (createGroupUsersResponse === null || createGroupUsersResponse === undefined) return;

        if (createGroupUsersResponse?.success) {
            // toast.success(createGroupUsersResponse?.message);
            toast.success("Group created successfully");
            console.log("createGroupUsersResponse :", createGroupUsersResponse)

            //reset the grp id and players in local state
            setGameInstanceData({
                ...gameInstanceData,
                groupName: {
                    value: "",
                    error: "",
                },
                instancePlayers: [],
            });

            //reset the create group user and local state and show modal
            resetAddGroupData();
            dispatch(resetCreateGroupUsersState());
            setShowAddGroupModal(null);

            // dispatch request to get the newly added group ID's and reset the players state
            const data = {
                organizationID: gameInstanceData.organization.value,
            }
            dispatch(getGroupDetailsByOrgID(data));
            dispatch(resetGamePlayerDetailsByGroupIDState());

        } else if (!createGroupUsersResponse.success) {

            toast.error(createGroupUsersResponse?.message);
            dispatch(resetCreateGroupUsersState());
        } else {
            dispatch(resetCreateGroupUsersState());
        }
    }, [createGroupUsersResponse]);

    // set the updated data into GameIstance state
    const setGameInstanceDetailState = useCallback(() => {

        if (gamePlayersByGroupIdDetails === null ||
            gamePlayersByGroupIdDetails === undefined) return;

        if (isJSONString(gamePlayersByGroupIdDetails?.data)) {
            const data = JSON.parse(gamePlayersByGroupIdDetails?.data);

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
                    playerDesignation: {
                        value: player.Designation,
                        error: "",
                    },
                    playerGroupName: {
                        value: player.GroupName,
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

        console.log("gamePlayersByGroupIdDetails data:", JSON.parse(gamePlayersByGroupIdDetails.data));

        setGameInstanceDetailState();
    }, [gamePlayersByGroupIdDetails]);

    // dispatch request to get eht users on the showAddGroupModal change
    // useEffect(() => {
    //     if (credentials && showAddGroupModal) {
    //         const data = {
    //             pageNumber: "0",
    //             pageCount: "0",
    //             requester: {
    //                 requestID: generateGUID(),
    //                 requesterID: credentials.data.userID,
    //                 requesterName: credentials.data.userName,
    //                 requesterType: credentials.data.role,
    //             },
    //         };
    //         console.log("dispatch users")
    //         dispatch(getUsersbyPage(data));
    //     } else if (showAddGroupModal === null) {
    //         dispatch(resetUserState());
    //     }
    // }, []);

    // set the updated data into GameIstance state
    const setUserDetailState = useCallback(() => {

        if (usersByPage === null ||
            usersByPage === undefined ||
            showAddGroupModal === null
        ) return;

        if (isJSONString(usersByPage.data)) {
            const data = JSON.parse(usersByPage.data);
            console.log("fetched users :", data);
            // map answers from questionByIdDetails
            const users = data?.UserDetails?.map((user) => {
                return {
                    userId: {
                        value: user.UserID,
                        error: "",
                    },
                    userName: {
                        value: user.UserName,
                        error: "",
                    },
                    userEmail: {
                        value: user.UserName,
                        error: "",
                    },
                    userRole: {
                        value: user.Role,
                        error: "",
                    },
                    userDesignation: {
                        value: user.Designation,
                        error: "",
                    },
                    isUserAdded: {
                        value: false,
                        error: "",
                    },
                    isActive: {
                        value: user.Status,
                        error: "",
                    },
                };
            });

            const newData = (prevData) => ({
                ...prevData,
                users: users,
            })
            setAddGroupData(newData);
        }
    }, [usersByPage]);

    useEffect(() => {
        if (usersByPage === null ||
            usersByPage === undefined ||
            showAddGroupModal === null
        ) return;

        setUserDetailState();

    }, [usersByPage]);

    // // DEBUG :: start

    // useEffect(() => {
    //     console.log(" masters  :", masters);
    //     console.log(" JSON.parse(masters.data) :", JSON.parse(masters.data));
    //     console.log("gameInstanceData :", gameInstanceData);
    //     console.log("newData to set in GameInstanceData: ", gameInstanceData);

    // }, []);

    // useEffect(() => {
    //     console.log(" groupByOrgIdDetails  :", groupByOrgIdDetails);
    //     console.log(" JSON.parse(groupByOrgIdDetails.data) :", JSON.parse(groupByOrgIdDetails.data));
    //     console.log(" Array.isArray(JSON.parse(groupByOrgIdDetails.data))  :", Array.isArray(JSON.parse(groupByOrgIdDetails.data)));

    //     console.log(" JSON.parse(scenarioNameAndIdDetails.data) :", JSON.parse(scenarioNameAndIdDetails.data));

    //     console.log(" gamePlayersByGroupIdDetails  :", gamePlayersByGroupIdDetails);
    //     console.log(" JSON.parse(gamePlayersByGroupIdDetails.data) :", JSON.parse(gamePlayersByGroupIdDetails.data));

    // }, [groupByOrgIdDetails, scenarioNameAndIdDetails, gamePlayersByGroupIdDetails]);
    // // DEBUG :: end


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

    // Add group :: start

    const onAddGroupChange = (event) => {
        console.log("onAddGroupChange name : " + event.target.name + ", value : " + event.target.value)
        setAddGroupData(prevData => ({
            ...prevData,
            [event.target.name]: {
                value: event.target.value,
                error: "",
            },
        }));
    };

    const onAddGroupLinkClick = (organizationId) => {
        console.log("onAddGroupClick  : ")
        console.log("organizationId  : ", organizationId)

        if (organizationId === "" ||
            organizationId === null ||
            organizationId === undefined) return;

        if (credentials) {
            const data = {
                pageNumber: "0",
                pageCount: "0",
                requester: {
                    requestID: generateGUID(),
                    requesterID: credentials.data.userID,
                    requesterName: credentials.data.userName,
                    requesterType: credentials.data.role,
                },
            };
            dispatch(getUsersbyPage(data));
            setShowAddGroupModal(organizationId);
            setAddGroupData({
                ...addGroupData,
                organizationId: {
                    value: organizationId,
                    error: "",
                },
            });
            console.log("dispatch users")
        }
    };

    // on user change update addedUsers array
    const onToggleUser = (clickedUser) => {
        setAddGroupData((prevData) => {
            const updatedUsers = prevData.users.map((user) => {
                if (user.userId.value === clickedUser.userId.value) {
                    if (user.isUserAdded.value) {
                        return {
                            ...user,
                            isUserAdded: {
                                value: false,
                                error: "",
                            },
                        };
                    } else {
                        return {
                            ...user,
                            isUserAdded: {
                                value: true,
                                error: "",
                            },
                        };
                    }
                }
                return user;
            });

            const updatedAddedUsers = [...prevData.addedUsers];
            const clickedUserId = clickedUser.userId.value;

            if (updatedAddedUsers.includes(clickedUserId)) {
                // Remove the user ID from addedUsers array
                const index = updatedAddedUsers.indexOf(clickedUserId);
                updatedAddedUsers.splice(index, 1);
            } else {
                // Add the user ID to addedUsers array
                updatedAddedUsers.push(clickedUserId);
            }
            console.log("updatedUsers :", updatedUsers)
            console.log("updatedAddedUsers :", updatedAddedUsers)
            return {
                ...prevData,
                users: updatedUsers,
                addedUsers: updatedAddedUsers,
            };
        });
    };

    // search input
    const onSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    // clear search
    const clearSearch = () => {
        setSearchValue('');
    };

    // on add Group details
    const onAddGroup = () => {
        console.log("add group")
        console.log("onAddGroup");

        let isEmpty = false;
        let isUsersEmpty = false;
        let valid = true;
        let data = { ...addGroupData };

        // validate the addGroupData fields
        if (addGroupData?.groupName?.value?.trim() === "") {
            console.log("groupName:", data.groupName);
            data = {
                ...data,
                groupName: {
                    ...data.groupName,
                    error: "Please enter group name",
                },
            };

            valid = false;
            isEmpty = true;
        } else if (/^\d+$/.test(addGroupData.groupName.value)) {
            console.log("groupName:", data.groupName);
            data = {
                ...data,
                groupName: {
                    ...data.groupName,
                    error: "Group name should contain alphanumeric character",
                },
            };

            valid = false;
            toast.error("Group name should contain alphanumeric character");
        } else if (addGroupData?.groupName?.value !== addGroupData?.groupName?.value?.trim()) {
            console.log("groupName:", data.groupName);
            data = {
                ...data,
                groupName: {
                    ...data.groupName,
                    error: "Please enter a valid group name",
                },
            };

            valid = false;
            toast.error("Please enter a valid group name");
        }

        if (addGroupData?.addedUsers?.length <= 1) {
            console.log("Please add atleast two users to the group.");
            // toast.error("Please add atleast two users to the group.")
            valid = false;
            // isEmpty = true;
            isUsersEmpty = true;
        }


        // If all validations pass
        try {
            if (!isEmpty) {
                if (isUsersEmpty) {
                    toast.error("Please add atleast two users to the group.")

                }

                if (valid) {
                    const data = {
                        groupName: addGroupData?.groupName?.value,
                        groupDescription: "",
                        organizationID: addGroupData?.organizationId?.value,
                        requester: {
                            requestID: generateGUID(),
                            requesterID: credentials.data.userID,
                            requesterName: credentials.data.userName,
                            requesterType: credentials.data.role,
                        },
                    };
                    const groupByOrgIdData = {
                        organizationID: addGroupData?.organizationId?.value,
                    }

                    console.log("data to update : ", data);

                    // dispatch a request to create user and get group details by org id so the group names will be updated
                    dispatch(createGroup(data));
                    dispatch(getGroupDetailsByOrgID(groupByOrgIdData));


                }
            } else {
                toast.error("Please fill all the mandatory details.");
            }
        } catch (error) {
            toast.error("An error occurred while saving the group.");
            console.error("Saving group error:", error);
        }
    }
    // Add group :: end

    // Creat game instance on submit
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log("on submit");

        let isEmpty = false;
        let valid = true;
        let data = { ...gameInstanceData };
        let updatedPlayers = [...gameInstanceData.instancePlayers];

        // validate the gameInstanceData fields
        if (gameInstanceData?.instanceName?.value?.trim() === "") {
            console.log("instanceName:", data.instanceName);
            data = {
                ...data,
                instanceName: {
                    ...data.instanceName,
                    error: "Please enter instance name",
                },
            };

            valid = false;
            isEmpty = true;
        } else if (/^\d+$/.test(gameInstanceData?.instanceName?.value)) {
            console.log("instanceName:", data.instanceName);
            data = {
                ...data,
                instanceName: {
                    ...data.instanceName,
                    error: "Instance name should contain alphanumeric character",
                },
            };

            valid = false;
            toast.error("Instance name should contain alphanumeric character");
        } else if (gameInstanceData?.instanceName?.value !== gameInstanceData?.instanceName?.value?.trim()) {
            console.log("instanceName:", data.instanceName);
            data = {
                ...data,
                instanceName: {
                    ...data.instanceName,
                    error: "Please enter valid instance name",
                },
            };

            valid = false;
            toast.error("Please enter valid instance name");
        }

        if (gameInstanceData?.organization?.value?.trim() === "") {
            console.log("organization:", data.organization);
            data = {
                ...data,
                organization: {
                    ...data.organization,
                    error: "Please select organization",
                },
            };

            valid = false;
            isEmpty = true;

        }

        if (gameInstanceData?.groupName?.value?.trim() === "") {
            console.log("groupName:", data.groupName);
            data = {
                ...data,
                groupName: {
                    ...data.groupName,
                    error: "Please select group name",
                },
            };

            valid = false;
            isEmpty = true;

        }

        // if (gameInstanceData?.groupSize?.value?.trim() === "") {
        //     console.log("groupSize:", data.groupSize);
        //     data = {
        //         ...data,
        //         groupSize: {
        //             ...data.groupSize,
        //             error: "Please select group size",
        //         },
        //     };

        //     valid = false;
        // }

        if (gameInstanceData?.scenarioName?.value?.trim() === "") {
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

        // if (gameInstanceData?.level?.value?.trim() === "") {
        //     console.log("level:", data.level);
        //     data = {
        //         ...data,
        //         level: {
        //             ...data.level,
        //             error: "Please select level",
        //         },
        //     };

        //     valid = false;
        // }

        // Validate each user in the updatedPlayers array
        updatedPlayers = updatedPlayers.map((player) => {
            let updatedPlayer = { ...player };

            // Perform validation checks on each field of the player object

            if (player?.playerName?.value?.trim() === "") {
                updatedPlayer.playerName.error = "Please enter the player name.";
                console.log("playerName:", player.playerName);
                valid = false;
            }

            if (player?.playerGroupName?.value?.trim() === "") {
                updatedPlayer.playerGroupName.error = "Please enter the player group name.";
                console.log("playerGroupName:", player.playerGroupName);
                valid = false;
            }

            if (player?.playerRole?.value?.trim() === "") {
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


        if (!isEmpty) {
            if (valid) {

                const data = {
                    scenarioID: gameInstanceData?.scenarioName?.value,
                    instanceName: gameInstanceData?.instanceName?.value,
                    description: "",
                    startTime: "",
                    organizationID: gameInstanceData?.organization?.value,
                    singleOrMultiplayer: gameInstanceData?.groupSize?.value,
                    timeToAppear: "",
                    instanceDuration: "",
                    endTime: "",
                    groupID: gameInstanceData?.groupName?.value,
                    userID: "",
                    level: gameInstanceData?.level?.value,
                    requester: {
                        requestID: generateGUID(),
                        requesterID: credentials.data.userID,
                        requesterName: credentials.data.userName,
                        requesterType: credentials.data.role,
                    },
                };

                console.log("data to update : ", data);
                dispatch(createGameInstance(data));
            }
        } else {
            toast.error("Please fill all the mandatory details.")
        }


    };

    const onCancel = () => {

        resetGameInstanceData();
        console.log("on cancel gameInstacneData :", gameInstanceData)

        navigateTo(`/instances`);
    };

    const debouncedAddGroup = debounce(onAddGroup, 1000);
    const debouncedSubmit = debounce(onSubmit, 1000);

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
                        <label>Create New Instances</label>
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
                                            placeholder="Instance Name &#128900;"
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
                                                <option value={""} hidden> Select Organization &#128900;</option>

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
                                        <div className={styles.groupContainer}>
                                            {/*Select Group Name :: start */}
                                            <div>
                                                <select
                                                    id="dropdown_group_name"
                                                    value={gameInstanceData.groupName.value}
                                                    className="select_input"
                                                    onChange={onGroupNameSelect}
                                                >
                                                    <option value={""} hidden>Group Name &#128900;</option>

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

                                            {/*Add Group Name :: start */}
                                            <div className={styles.addGroup}>
                                                <p href=""
                                                    onClick={() => { onAddGroupLinkClick(gameInstanceData.organization.value) }}
                                                >+Add Group</p>
                                            </div>
                                            {/*Add Group Name :: start */}
                                        </div>

                                    </div>
                                    <div className={styles.field}>
                                        {/*Select Group Size :: start */}
                                        {/* <div>
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
                                        </div> */}
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
                                                <option value={""} hidden>Select Scenario &#128900;</option>

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
                                        {/*Select Level :: start */}
                                        {/* <div>
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
                                        </div> */}
                                        {/*Select Level :: end */}
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
                                                    {/* <Input
                                                        labelStyle={styles.inputLabel}
                                                        type="text"
                                                        // value={player.playerRole.value}
                                                        value="CTO"
                                                        customStyle={{ margin: '0' }}
                                                        name={"playerRole"}
                                                        placeholder="Assign Role"
                                                        onChange={(e) => onPlayerChange(e, index, 'playerRole')}
                                                        disabled
                                                    /> */}
                                                    <div>
                                                        <select
                                                            id="dropdown_player_designation"
                                                            value={player.playerDesignation.value}
                                                            className="select_input"
                                                            placeholder="Assign Role"
                                                            onChange={(e) => onPlayerChange(e, index, 'playerDesignation')}
                                                            disabled
                                                        >
                                                            <option value={""} hidden>Assign Role</option>

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
                    <Button 
                        // onClick={onSubmit}
                        onClick={debouncedSubmit}
                    >
                        Save
                    </Button>
                </div>
                {/* Button container:: end */}

                {/* Modal Container :: start*/}

                {showAddGroupModal && (
                    <ModalContainer>
                        <div className="modal_content">
                            <div className="modal_header">
                                <div>Add Group</div>
                                <div>
                                    <svg
                                        className="modal_crossIcon"
                                        onClick={() => {
                                            setShowAddGroupModal(null);
                                            resetAddGroupData();
                                            clearSearch();
                                        }}
                                    >
                                        <use xlinkHref={"sprite.svg#crossIcon"} />
                                    </svg>
                                </div>
                            </div>
                            <div className={styles.modalInputContainer}>
                                <div>
                                    <Input
                                        labelStyle={styles.modalInputLabel}
                                        label="Group Name"
                                        type="text"
                                        customStyle={{ marginTop: '1rem', }}
                                        name={"groupName"}
                                        value={addGroupData.groupName.value}
                                        placeholder="Group Name"
                                        onChange={onAddGroupChange}
                                    // autoFocus={!searchValue}
                                    />
                                </div>
                                <div className={styles.searchContainer}>
                                    <SearchUsers
                                        value={searchValue}
                                        onChange={onSearchChange}
                                        clearSearch={clearSearch}
                                        searchValue={searchValue}
                                    />
                                    {/* <UsersList
                                        users={
                                            searchValue
                                                ? addGroupData.users.filter((user) =>
                                                    user.userEmail.value.includes(searchValue)
                                                )
                                                : addGroupData.users
                                        }
                                        onToggleUser={onToggleUser}
                                    /> */}
                                    <UsersList
                                        users={
                                            searchValue
                                                ? addGroupData.users
                                                    .filter(user =>
                                                        user.userEmail.value.includes(searchValue))
                                                    .filter(user =>
                                                        user.userRole.value === "3") // Filter users with userRole.value === "3"
                                                    .filter(user =>
                                                        user.isActive.value === "Active") // Filter users with user.Status === "Active"
                                                : addGroupData.users
                                                    .filter(user =>
                                                        user.userRole.value === "3") // If no search value, only filter by userRole.value === "3"
                                                    .filter(user =>
                                                        user.isActive.value === "Active") // Filter users with user.Status === "Active"
                                        }
                                        onToggleUser={onToggleUser}
                                    />
                                </div>

                            </div>

                            <div className="modal_buttonContainer">
                                <Button
                                    buttonType={"cancel"}
                                    onClick={() => {
                                        setShowAddGroupModal(null);
                                        resetAddGroupData();
                                        clearSearch();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    customStyle={{
                                        marginLeft: "1rem",
                                    }}
                                    // onClick={onAddGroup}
                                    onClick={debouncedAddGroup}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    </ModalContainer>
                )}

                {/* Modal Container :: end*/}
            </div>
        </PageContainer>
    );
}

export default CreateInstances;