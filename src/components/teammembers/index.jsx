import React, { useCallback, useEffect, useState } from "react";
import styles from "./teammembers.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersInSession,
  resetGetAllUsersInSessionState,
} from "../../store/app/admin/session/getAllSessionUser";
import { generateGUID, isJSONString } from "../../utils/common";

const TeamMembers = () => {
  const [show, setShow] = useState(false);

  const { allUsersInSession, loading } = useSelector(
    (state) => state.allSessionUser
  );

  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);

  const { activeUsers } = useSelector((state) => state.gameplay);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionDetails?.data) return;
    if (!isJSONString(sessionDetails.data)) return;
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      instanceID: sessionData.InstanceID,
      currentState: sessionData.CurrentState,
      requester: {
        requestID: generateGUID(),
        requesterID: credentials.data.userID,
        requesterName: credentials.data.userName,
        requesterType: credentials.data.role,
      },
    };
    dispatch(getAllUsersInSession(data));

    return () => {
      dispatch(resetGetAllUsersInSessionState());
    };
  }, []);

  const isActiveUser = useCallback(
    (UserId) => {
      const isLiveUser = activeUsers.find((user) => user.userID === UserId);

      if (isLiveUser) {
        return true;
      } else {
        return false;
      }
    },
    [activeUsers]
  );

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        onClick={() => {
          setShow((prev) => {
            return !prev;
          });
        }}
      >
        <div>Team Members</div>
        <div className={`${styles.arrow} ${show ? styles.show : ""}`}>
          <svg onClick={() => {}}>
            <use xlinkHref={"sprite.svg#up_arrow"} />
          </svg>
        </div>
      </div>
      {show &&
        allUsersInSession &&
        allUsersInSession.data &&
        Array.isArray(allUsersInSession.data) && (
          <div className={styles.mainContainer}>
            {allUsersInSession.data.map((item, index) => {
              return (
                <div className={styles.item} key={index}>
                  <div>{item.designation}</div>
                  <div className={styles.userContainer}>
                    {item &&
                      item.users &&
                      Array.isArray(item.users) &&
                      item.users.map((users, i) => {
                        return (
                          <div key={i}>
                            {i === 0 ? null : <hr />}
                            <div className={styles.itemDetails}>
                              <div>{users.UserName[0]}</div>
                              <div>{users.UserName}</div>
                              <div>{users.DesignationName}</div>
                              {isActiveUser(users.UserID) ? (
                                <div className={styles.active}></div>
                              ) : (
                                <div className={styles.inactive}></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default TeamMembers;
