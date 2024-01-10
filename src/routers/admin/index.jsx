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
import MissionCompleted from "../../pages/app/admin/missioncompleted";
import UpdateScenarios from "../../pages/app/admin/updatescenarios";
import UploadQuestion from "../../pages/app/admin/questions/uploadquestions";
import QuestionList from "../../pages/app/admin/questions/questionlist";
import QuestionBuilder from "../../pages/app/admin/questions/questionbuilder";
import GameInstances from "../../pages/app/admin/gameinstances/gameInstances";
import CreateInstances from "../../pages/app/admin/gameinstances/createinstanaces";
import UpdateInstances from "../../pages/app/admin/gameinstances/updateinstances";
import NotFound from "../../pages/app/common/notfound";

const Admin = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      {location.pathname.includes("/intro") ? null : location.pathname.includes(
          "/game"
        ) ||
        location.pathname.includes("/gameplay") ||
        location.pathname.includes("/missioncompleted") ? (
        <UserNavbar role="Admin" />
      ) : (
        <Navbar />
      )}

      <div className={styles.layoutContainer}>
        {location.pathname.includes("/game") ||
        location.pathname.includes("/intro") ||
        location.pathname.includes("/gameplay") ||
        location.pathname.includes("/missioncompleted") ? null : (
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
            <Route
              path="/scenario/createscenarios"
              element={<CreateScenarios />}
            />
            <Route
              path="/scenario/updatescenarios/:scenarioID?"
              element={<UpdateScenarios />}
            />
            <Route
              path="/questions/uploadquestions/:scenarioID?"
              element={<UploadQuestion />}
            />
            <Route path="/questions/:scenarioID?" element={<QuestionList />} />
            <Route
              path="/questions/:scenarioID/questionbuilder/:questionID?"
              element={<QuestionBuilder />}
            />
            <Route path="/instances" element={<GameInstances />} />
            <Route
              path="/instances/createinstances"
              element={<CreateInstances />}
            />
            <Route
              path="/instances/updateinstances/:instanceID?"
              element={<UpdateInstances />}
            />
            <Route path="/profile/:userID?" element={<Profile />} />
            <Route path="/game/:instanceID?" element={<Gamelanding />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/gameplay" element={<GamePlay />} />
            <Route path="/missioncompleted" element={<MissionCompleted />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
