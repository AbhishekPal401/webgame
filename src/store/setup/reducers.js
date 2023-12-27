import { combineReducers } from "redux";

import login from "../auth/login.js";
import sidebar from "../local/sidebar.js";

import users from "../app/admin/users/users.js";
import getUserbyId from "../app/admin/users/getUserbyId.js";
import deleteUser from "../app/admin/users/deleteUser.js";

import masters from "../app/admin/users/masters.js";
import createUser from "../app/admin/users/createUser.js";
import scenarios from "../app/admin/scenario/scenario.js";
import createScenario from "../app/admin/scenario/createScenario.js";
import sessionHistory from "../app/admin/session/session.js";

import getSession from "../app/user/session/getSession.js";

const reducers = combineReducers({
  login,
  sidebar,
  users,
  getUserbyId,
  deleteUser,
  masters,
  createUser,
  sessionHistory,
  scenarios,
  createScenario,
  getSession,
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export default rootReducer;
