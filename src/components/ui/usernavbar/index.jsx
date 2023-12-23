import React, { useEffect, useState } from "react";
import styles from "./usernavbar.module.css";
import logo from "../../../assets/logo/pwclabel.png";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const UserNavBar = ({ role = "User" }) => {
  const [initial, setInitials] = useState("");

  const { credentials } = useSelector((state) => state.login);

  const navigate = useNavigate();

  const extractInitials = (username) => {
    const words = username.split(" ");

    if (words.length >= 2) {
      const firstNameInitial = words[0][0].toUpperCase();
      const lastNameInitial = words[words.length - 1][0].toUpperCase();

      return `${firstNameInitial}${lastNameInitial}`;
    } else {
      return username[0].toUpperCase();
    }
  };

  useEffect(() => {
    if (credentials?.data) {
      const init = extractInitials(credentials.data.userName);

      if (init) {
        setInitials(init);
      }
    }
  }, []);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.icon}>
        <svg
          onClick={() => {
            navigate("./");
          }}
        >
          <use xlinkHref={"sprite.svg#pwc"} />
        </svg>
      </div>

      <div className={styles.label}>Game of Risks</div>
      <div className={styles.containerRight}>
        <div className={styles.role}>{role}</div>
        <div
          className={styles.profileIcon}
          onClick={() => {
            navigate(`/profile/${credentials.data.userID}`);
          }}
        >
          {initial}
        </div>
      </div>
    </div>
  );
};

export default UserNavBar;
