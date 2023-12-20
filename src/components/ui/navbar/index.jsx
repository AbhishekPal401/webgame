import React from "react";
import styles from "./navbar.module.css";
import logo from "../../../assets/logo/pwclabel.png";

const Navbar = ({ role = "Admin" }) => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.pwcLogo}>
        <img src={logo} />
      </div>
      <div className={styles.label}>Game of Risks</div>
      <div className={styles.containerRight}>
        <div className={styles.role}>{role}</div>
        <div className={styles.profileIcon}>EL</div>
      </div>
    </div>
  );
};

export default Navbar;
