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
import { generateGUID } from "../../../../utils/common.js";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [pageCount, setPageCount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usersByPage, loading } = useSelector((state) => state.users);
  const { credentials } = useSelector((state) => state.login);

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
    if (usersByPage) {
      const newPageNumber = JSON.parse(usersByPage?.data)?.CurrentPage;

      if (newPageNumber && typeof newPageNumber === "number") {
        setPageNumber(newPageNumber);
      }
    }
  }, [usersByPage]);

  const navigateTo = () => {
    navigate("/users/createandedit");
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
              <th>Organisation</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {usersByPage &&
              usersByPage.success &&
              usersByPage.data &&
              JSON.parse(usersByPage.data)?.UserDetails.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>{index + pageCount * (pageNumber - 1) + 1}</td>
                    <td onClick={() => {}}>{user.UserName}</td>
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
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {usersByPage && usersByPage.success && usersByPage.data && (
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
    </PageContainer>
  );
};

export default Users;
