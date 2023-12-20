import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/ui/navbar";
import Sidebar from "../../components/ui/sidebar/AdminSidebar";
import styles from "./admin.module.css";
import Homepage from "../../pages/app/admin/homepage";
import Users from "../../pages/app/admin/users";
import CreateUser from "../../pages/app/admin/createusers";
import CreateScenarios from "../../pages/app/admin/createscenarios";
import Scenarios from "../../pages/app/admin/scenarios";

const Admin = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.layoutContainer}>
        <div className={styles.leftContainer}>
          <Sidebar />
        </div>
        <div className={styles.rightContainer}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/createusers" element={<CreateUser />} />
            <Route path="/scenario" element={<Scenarios />} />
            <Route path="/createscenarios" element={<CreateScenarios />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
