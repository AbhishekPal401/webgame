import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/ui/navbar";
import Sidebar from "../../components/ui/sidebar/gameadminsidebar";
import styles from "./gameadmin.module.css";
import Homepage from "../../pages/app/gameadmin/homepage";
import Profile from "../../pages/app/common/profile";
import NotFound from "../../pages/app/common/notfound";

const GameAdmin = () => {
  return (
    <div className={styles.container}>
      <Navbar role="Game Admin" />
      <div className={styles.layoutContainer}>
        <div className={styles.leftContainer}>
          <Sidebar />
        </div>
        <div className={styles.rightContainer}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/profile/:userID?" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default GameAdmin;
