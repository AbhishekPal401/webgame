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
import updateScenario from "../app/admin/scenario/updateScenario.js";
import sessionHistory from "../app/admin/session/session.js";
import getScenarioById from "../app/admin/scenario/getScenarioById.js";
import getQuestionsByScenarioId from "../app/admin/questions/getQuestionsByScenarioId.js";
import getQuestionDetailsByid from "../app/admin/questions/getQuestionDetailsById.js";
import updateQuestion from  "../app/admin/questions/updateQuestion.js";
// dawdaw

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
  updateScenario,
  getScenarioById,
  getQuestionsByScenarioId,
  getQuestionDetailsByid,
  updateQuestion,
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export default rootReducer;
