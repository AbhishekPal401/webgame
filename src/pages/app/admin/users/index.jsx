import React, { useEffect, useState } from "react";
import PageContainer from "../../../../components/ui/pagecontainer";
import styles from "./users.module.css";
import Button from "../../../../components/common/button";
import Pagination from "../../../../components/ui/pagination";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsersbyPage,
  resetUserState,
} from "../../../../store/app/admin/users/users";
import { generateGUID, isJSONString } from "../../../../utils/common.js";
import { useNavigate } from "react-router-dom";
import ModalContainer from "../../../../components/modal/index.jsx";
import {
  deleteUserByID,
  resetDeleteUserState,
} from "../../../../store/app/admin/users/deleteUser.js";
import { toast } from "react-toastify";
import { convertSecondsToHMS, formatDateString, formatTime } from "../../../../utils/helper.js";
import Checkbox from "../../../../components/ui/checkbox/index.jsx";
import { resetUserStates } from "../../../../store/local/menu.js";

const Users = () => {
  const [pageCount, setPageCount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usersByPage, loading } = useSelector((state) => state.users);
  const { credentials } = useSelector((state) => state.login);
  const { deleteUserResponse } = useSelector((state) => state.deleteUser);
  const { isUserReset } = useSelector((state) => state.menu);

  useEffect(() => {
    if (credentials) {
      const data = {
        pageNumber: pageNumber,
        pageCount: pageCount,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getUsersbyPage(data));
    }
  }, []);

  useEffect(() => {
    if (isUserReset) {
      const data = {
        pageNumber: 1,
        pageCount: pageCount,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getUsersbyPage(data));
      dispatch(resetUserStates());
    }
  }, [isUserReset]);

  useEffect(() => {
    if (usersByPage && isJSONString(usersByPage?.data)) {
      const newPageNumber = JSON.parse(usersByPage?.data)?.CurrentPage;

      if (newPageNumber && typeof newPageNumber === "number") {
        setPageNumber(newPageNumber);
      }
    }
  }, [usersByPage]);

  //DEBG:: start
  // useEffect(() => {
  //   if (!usersByPage) {
  //     return;
  //   }
  //   console.log("usersByPage :", JSON.parse(usersByPage.data))
  // }, [usersByPage]);
  //DEBG:: end

  useEffect(() => {
    if (deleteUserResponse === null || deleteUserResponse === undefined) return;

    if (deleteUserResponse.success) {
      toast.success(deleteUserResponse.message);
      const data = {
        pageNumber: pageNumber,
        pageCount: pageCount,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getUsersbyPage(data));
      dispatch(resetDeleteUserState());
      setShowDeleteModal(null);
      setSelectedCheckboxes([]);
    } else if (!deleteUserResponse.success) {
      toast.error(deleteUserResponse.message);
    }
  }, [deleteUserResponse]);

  const handleCheckboxChange = (userId) => {
    const isSelected = selectedCheckboxes.includes(userId);
    const updatedRows = isSelected
      ? selectedCheckboxes.filter((row) => row !== userId)
      : [...selectedCheckboxes, userId];

    setSelectedCheckboxes(updatedRows);
  };


  const navigateTo = () => {
    navigate("/users/createandedit");
  };

  const onDeleteUser = () => {
    const data = {
      userID: showDeleteModal.UserID,
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };

    dispatch(deleteUserByID(data));
  };

  return (
    <PageContainer>
      <div
        style={{
          background: 'url("./images/particles-yellow.png") top right no-repeat',
          backgroundSize: '80%',
        }}
      >

        <div className={styles.topContainer}>
          <div className={styles.left}>
            <div>
              <label>User Management</label>
            </div>
            <div>
              {/* <label>Users</label> */}
            </div>
          </div>
          <div
            className={styles.right}
          >
            <img src="./images/scenario.png" />
            <div className={styles.buttonContainer}>
              <Button onClick={navigateTo}>Create New</Button>
            </div>
          </div>
        </div>
        <div className={styles.mainContainer}>
          <table className={styles.table_content}>
            <thead>
              <tr>
                {/* <th></th> */}
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Organization</th>
                <th>Date Updated</th>
                <th>Role Played</th>
                <th>Playtime</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usersByPage &&
                usersByPage.success &&
                usersByPage.data &&
                isJSONString(usersByPage.data) &&
                JSON.parse(usersByPage.data)?.UserDetails.map((user, index) => {
                  // const isSelected = selectedCheckboxes.includes(user.UserID);
                  const isSelected = true;
                  return (
                    <tr key={index}>
                      {/* <td>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(user.UserID)}
                        />
                      </td> */}
                      <td>{index + pageCount * (pageNumber - 1) + 1}</td>
                      <td>
                        {user?.UserName}
                      </td>
                      <td>{user?.Email}</td>
                      <td>{user?.Mobile}</td>
                      <td>{user?.OrganizationName}</td>
                      <td>{user?.UpdatedAt && formatDateString(user.UpdatedAt)}</td>
                      <td>{user?.Designation}</td>
                      <td>{user?.Duration && convertSecondsToHMS(user.Duration)}</td>
                      <td>{(user?.Status === 'Active') ? "Active" : "Inactive"}</td>

                      <td>
                        <div className={styles.actions}>
                          <div className={styles.circleSvg}
                            onClick={() => {
                              if (isSelected && user?.Status === 'Active') {
                                navigate(`/users/createandedit/${user.UserID}`);
                              }
                            }}
                          >
                            <svg
                              height="11"
                              width="11"
                              style={{
                                opacity: (isSelected && user?.Status === 'Active') ? "1" : "0.3"
                              }}
                            >
                              <use xlinkHref="sprite.svg#edit_icon" />
                            </svg>
                          </div>
                          <div className={styles.circleSvg}
                            onClick={() => {
                              if (isSelected && user?.Status === 'Active') {
                                setShowDeleteModal(user);
                              }
                            }}
                          >
                            <svg
                              height="14"
                              width="12"
                              style={{
                                opacity: (isSelected && user?.Status === 'Active') ? "1" : "0.3"
                              }}
                            >
                              <use xlinkHref="sprite.svg#delete_icon" />
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {usersByPage &&
            usersByPage.success &&
            usersByPage.data &&
            isJSONString(usersByPage.data) && (
              <div className={styles.paginationContainer}>
                <Pagination
                  totalCount={JSON.parse(usersByPage.data)?.TotalCount}
                  pageNumber={pageNumber}
                  countPerPage={pageCount}
                  onPageChange={(pageNumber) => {
                    const data = {
                      pageNumber: pageNumber,
                      pageCount: pageCount,
                      requester: {
                        requestID: generateGUID(),
                        requesterID: credentials.data.userID,
                        requesterName: credentials.data.userName,
                        requesterType: credentials.data.role,
                      },
                    };

                    dispatch(getUsersbyPage(data));
                  }}
                />
              </div>
            )}
        </div>

        {showDeleteModal && (
          <ModalContainer>
            <div className="modal_content">
              <div className="modal_header">
                <div>Delete User</div>
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
                Are you sure you want to delete this user ?
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
                  onClick={onDeleteUser}
                >
                  Delete
                </Button>
              </div>
            </div>
          </ModalContainer>
        )}
      </div>
    </PageContainer>
  );
};

export default Users;
