import React, { useState } from 'react';
import styles from "./userslist.module.css";


const UsersList = ({
    users,
    onToggleUser
}) => (
    <div className={styles.userInnerContainer}>
        {users &&
            users?.map((user, index) => (
                <div key={index} className={styles.userRow}>
                    <div className={styles.userColumns}>
                        {user.userEmail.value}
                    </div>
                    <div className={styles.userColumns}>
                        {user?.isUserAdded?.value ? (
                            <div>
                                <svg
                                    className={styles.xMarkIcon}
                                    onClick={() => onToggleUser(user)}
                                    width="13"
                                    height="16"
                                >
                                    <use xlinkHref={"sprite.svg#x_mark_icon"} />
                                </svg>
                            </div>
                        ) : (
                            <div>
                                <svg
                                    className={styles.plusIconLg}
                                    onClick={() => onToggleUser(user)}
                                    width="13"
                                    height="16"
                                >
                                    <use xlinkHref={"sprite.svg#plus_icon_lg"} />
                                </svg>
                            </div>

                        )}
                    </div>
                </div>
            ))}
    </div>
);

export default UsersList;
