import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import UserNavBar from "../../components/ui/usernavbar";

import styles from "./userroutes.module.css";
import Homepage from "../../pages/app/gameuser/homepage";
import Profile from "../../pages/app/common/profile";
import Intro from "../../pages/app/gameuser/introduction";
import GamePlay from "../../pages/app/gameuser/gameplay";

const User = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      {location.pathname.includes("/intro") ? null : (
        <UserNavBar role="Players" />
      )}
      <div className={styles.layoutContainer}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile/:userID?" element={<Profile />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/gameplay" element={<GamePlay />} />
        </Routes>
      </div>
    </div>
  );
};

export default User;
