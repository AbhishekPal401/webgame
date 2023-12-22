import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/ui/navbar";
import styles from "./userroutes.module.css";
import Homepage from "../../pages/app/gameuser/homepage";
import Profile from "../../pages/app/common/profile";

const User = () => {
  return (
    <div className={styles.container}>
      <Navbar role="User" />
      <div className={styles.layoutContainer}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile/:userID?" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default User;
