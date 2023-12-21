import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/ui/navbar";
import styles from "./userroutes.module.css";
import Homepage from "../../pages/app/gameuser/homepage";

const User = () => {
  return (
    <div className={styles.container}>
      <Navbar role="User" />
      <div className={styles.layoutContainer}>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </div>
    </div>
  );
};

export default User;
