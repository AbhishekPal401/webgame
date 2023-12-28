import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../../components/ui/navbar";
import Sidebar from "../../components/ui/sidebar/adminsidebar/AdminSidebar";
import styles from "./admin.module.css";
import Homepage from "../../pages/app/admin/homepage";
import Users from "../../pages/app/admin/users";
import CreateUser from "../../pages/app/admin/createusers";
import CreateScenarios from "../../pages/app/admin/createscenarios";
import Scenarios from "../../pages/app/admin/scenarios";
import Profile from "../../pages/app/common/profile";
import Gamelanding from "../../pages/app/admin/gamelanding";
import Intro from "../../pages/app/admin/introduction";
import GamePlay from "../../pages/app/admin/gameplay";
import UserNavbar from "../../components/ui/usernavbar";

const Admin = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      {location.pathname.includes("/intro") ? null : location.pathname.includes(
          "/game"
        ) || location.pathname.includes("/gameplay") ? (
        <UserNavbar />
      ) : (
        <Navbar />
      )}

      <div className={styles.layoutContainer}>
        {location.pathname.includes("/game") ||
        location.pathname.includes("/intro") ||
        location.pathname.includes("/gameplay") ? null : (
          <div className={styles.leftContainer}>
            <Sidebar />
          </div>
        )}

        <div className={styles.rightContainer}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/users" element={<Users />} />
            <Route
              path="/users/createandedit/:userID?"
              element={<CreateUser />}
            />
            <Route path="/scenario" element={<Scenarios />} />
            <Route path="/createscenarios" element={<CreateScenarios />} />
            <Route path="/profile/:userID?" element={<Profile />} />
            <Route path="/game" element={<Gamelanding />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/gameplay" element={<GamePlay />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
