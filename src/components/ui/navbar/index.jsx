import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import logo from "../../../assets/logo/pwclabel.png";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = ({ role = "Admin" }) => {
  const [initial, setInitials] = useState("");

  const { credentials } = useSelector((state) => state.login);

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
      console.log(init);

      if (init) {
        setInitials(init);
      }
    }
  }, []);

  return (
    <div className={styles.navbarContainer}>
      <Link to={"/"} className={styles.pwcLogo}>
        <img src={logo} />
      </Link>
      <div className={styles.label}>Game of Risks</div>
      <div className={styles.containerRight}>
        <div className={styles.role}>{role}</div>
        <div className={styles.profileIcon}>{initial}</div>
      </div>
    </div>
  );
};

export default Navbar;
