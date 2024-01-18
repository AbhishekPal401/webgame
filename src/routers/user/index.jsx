import React from "react";
import { Routes, Route, useLocation, useRoutes } from "react-router-dom";
import UserNavBar from "../../components/ui/usernavbar";

import styles from "./userroutes.module.css";
import Homepage from "../../pages/app/gameuser/homepage";
import Profile from "../../pages/app/common/profile";
import Intro from "../../pages/app/gameuser/introduction";
import GamePlay from "../../pages/app/gameuser/gameplay";
import MissionCompleted from "../../pages/app/gameuser/missioncompleted";
import NotFound from "../../pages/app/common/notfound";

const User = () => {
  const location = useLocation();

  const routeConfig = [
    { path: "/", element: <Homepage /> },
    { path: "/profile/:userID?", element: <Profile /> },
    { path: "/intro", element: <Intro /> },
    { path: "/gameplay", element: <GamePlay /> },
    { path: "/missioncompleted", element: <MissionCompleted /> },
  ];

  const routeElement = useRoutes(routeConfig);

  const isAnyRouteNotMatched = routeElement === null;

  return (
    <div className={styles.container}>
      {location.pathname.includes("/intro") || isAnyRouteNotMatched ? (
        <UserNavBar disable={true} role="Player" />
      ) : (
        <UserNavBar role="Player" />
      )}
      <div className={styles.layoutContainer}>
        {routeElement || <NotFound />}
      </div>
    </div>
  );
};

export default User;
