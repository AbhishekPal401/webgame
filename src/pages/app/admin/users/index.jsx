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

const Users = () => {
  const [pageCount, setPageCount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usersByPage, loading } = useSelector((state) => state.users);
  const { credentials } = useSelector((state) => state.login);
  const { deleteUserResponse } = useSelector((state) => state.deleteUser);

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
    if (usersByPage && isJSONString(usersByPage?.data)) {
      const newPageNumber = JSON.parse(usersByPage?.data)?.CurrentPage;

      if (newPageNumber && typeof newPageNumber === "number") {
        setPageNumber(newPageNumber);
      }
    }
  }, [usersByPage]);

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
    } else if (!deleteUserResponse.success) {
      toast.error(deleteUserResponse.message);
    }
  }, [deleteUserResponse]);

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
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label>Users</label>
        </div>
        <div className={styles.right}>
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
              <th>#</th>
              <th>Username</th>
              <th>EmailId</th>
              <th>Designation</th>
              <th>Organization</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {usersByPage &&
              usersByPage.success &&
              usersByPage.data &&
              isJSONString(usersByPage.data) &&
              JSON.parse(usersByPage.data)?.UserDetails.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>{index + pageCount * (pageNumber - 1) + 1}</td>
                    <td
                      onClick={() => {
                        navigate(`/users/createandedit/${user.UserID}`);
                      }}
                      className={styles.username}
                    >
                      {user.UserName}
                    </td>
                    <td>{user.Email}</td>
                    <td>{user.Designation}</td>
                    <td>{user.OrganizationName}</td>
                    <td>
                      <Button
                        customStyle={{
                          paddingTop: "0.2rem",
                          paddingBottom: "0.2rem",
                        }}
                        buttonType="cancel"
                        onClick={() => {
                          setShowDeleteModal(user);
                        }}
                      >
                        Delete
                      </Button>
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
    </PageContainer>
  );
};

export default Users;
