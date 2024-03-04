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
import updateQuestion from "../app/admin/questions/updateQuestion.js";
import getSession from "../app/user/session/getSession.js";
import getNextQuestion from "../app/user/questions/getNextQuestion.js";
import postAnswer from "../app/user/answers/postAnswer.js";
import gameInstances from "../app/admin/gameinstances/gameInstances.js";
import createGameInstance from "../app/admin/gameinstances/createGameInstance.js";
import getGroupDetailsByOrgId from "../app/admin/gameinstances/getGroupDetailsByOrgId.js";
import getScenarioNameAndId from "../app/admin/scenario/getScenarioNameAndId.js";
import getGamePlayersByGrpId from "../app/admin/gameinstances/getGamePlayersByGrpId.js";
import getGameInstanceById from "../app/admin/gameinstances/getGameInstanceById.js";
import updateGameInstance from "../app/admin/gameinstances/updateGameInstance.js";
import createGroup from "../app/admin/groups/createGroup.js";
import createGroupUsers from "../app/admin/groups/createGroupUsers.js";
import createMaster from "../app/admin/masters/createMaster.js";
import getOrganizations from "../app/admin/masters/getOrganizations.js";
import getDesignations from "../app/admin/masters/getDesignations.js";
import deleteScenario from "../app/admin/scenario/deleteScenario.js";
import deleteQuestions from "../app/admin/questions/deleteQuestions.js";
import instanceSummary from "../app/admin/gameinstances/instanceSummary.js";
import getInstanceProgress from "../app/admin/gameinstances/getInstanceProgress.js";
import getOverviewGameDetails from "../app/admin/gameinstances/getOverviewGameDetails.js";
import gameplay from "../local/gameplay.js";
import allSessionUser from "../app/admin/session/getAllSessionUser.js";
import deleteGameInstance from "../app/admin/gameinstances/deleteGameInstance.js";
import clearInstanceById from "../app/admin/gameinstances/clearInstanceById.js";
import clearAllInstances from "../app/admin/gameinstances/clearAllInstances.js";
import updateDesignation from "../app/admin/masters/updateDesignation.js";
import updateOrganization from "../app/admin/masters/updateOrganization.js";
import deleteMasterByTypeAndId from "../app/admin/masters/deleteMasterByTypeAndId.js";
import getDesignationById from "../app/admin/masters/getDesignationById.js";
import getOrganizationById from "../app/admin/masters/getOrganizationById.js";
import getReport from "../app/admin/report/getReport.js";
import getScoreMasters from "../app/admin/questions/scoremaster/getScoreMasters.js";
import updateScoreMasterByScenario from "../app/admin/questions/scoremaster/updateScoreMasterByScenario.js";
import postImages from "../app/admin/report/postImages.js";
import getFileStream from "../app/admin/fileStream/getFileStream.js";

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
  getNextQuestion,
  postAnswer,
  updateScenario,
  getScenarioById,
  getQuestionsByScenarioId,
  getQuestionDetailsByid,
  updateQuestion,
  gameInstances,
  createGameInstance,
  getGroupDetailsByOrgId,
  getScenarioNameAndId,
  getGamePlayersByGrpId,
  getGameInstanceById,
  updateGameInstance,
  createGroup,
  createGroupUsers,
  createMaster,
  instanceSummary,
  getInstanceProgress,
  getOverviewGameDetails,
  getDesignations,
  getOrganizations,
  gameplay,
  allSessionUser,
  deleteScenario,
  deleteQuestions,
  deleteGameInstance,
  clearInstanceById,
  clearAllInstances,
  updateDesignation,
  updateOrganization,
  deleteMasterByTypeAndId,
  getDesignationById,
  getOrganizationById,
  getReport,
  getScoreMasters,
  updateScoreMasterByScenario,
  postImages,
  getFileStream,
});

const rootReducer = (state, action) => {
  if (action.type === "user-login/logout") {
    if (state) {
      const nullState = Object.keys(state).reduce((acc, key) => {
        if (
          Object.keys(acc).length === 0 ||
          acc[key] === null ||
          acc[key] === undefined
        )
          return acc;

        acc[key] = null;
        return acc;
      }, {});
      state = nullState;
    }
  }

  return reducers(state, action);
};

export default rootReducer;
