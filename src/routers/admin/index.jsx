import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/ui/navbar";
import Sidebar from "../../components/ui/sidebar/adminsidebar/AdminSidebar";
import styles from "./admin.module.css";
import Homepage from "../../pages/app/admin/homepage";
import Users from "../../pages/app/admin/users";
import CreateUser from "../../pages/app/admin/createusers";
import CreateScenarios from "../../pages/app/admin/createscenarios";
import Scenarios from "../../pages/app/admin/scenarios";
import Profile from "../../pages/app/common/profile";
import UpdateScenarios from "../../pages/app/admin/updatescenarios";
import UploadQuestion from "../../pages/app/admin/questions/uploadquestions";
import QuestionList from "../../pages/app/admin/questions/questionlist";
import QuestionBuilder from "../../pages/app/admin/questions/questionbuilder";
import GameInstances from "../../pages/app/admin/gameinstances/gameInstances";
import CreateInstances from "../../pages/app/admin/gameinstances/createinstanaces";
import UpdateInstances from "../../pages/app/admin/gameinstances/updateinstances";

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
            <Route path="/users/createandedit/:userID?" element={<CreateUser />} />
            <Route path="/scenario" element={<Scenarios />} />
            <Route path="/scenario/createscenarios" element={<CreateScenarios />} />
            <Route path="/scenario/updatescenarios/:scenarioID?" element={<UpdateScenarios />} />
            <Route path="/questions/uploadquestions/:scenarioID?" element={<UploadQuestion />} />
            <Route path="/questions/:scenarioID?" element={<QuestionList />} />
            <Route path="/questions/:scenarioID/questionbuilder/:questionID?" element={<QuestionBuilder />} />
            <Route path="/gameinstances" element={<GameInstances />} />
            <Route path="/gameinstances/createinstances" element={<CreateInstances />} />
            <Route path="/gameinstances/updateinstances/:instanceID?" element={<UpdateInstances />} />
            <Route path="/profile/:userID?" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
