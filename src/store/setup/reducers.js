import { combineReducers } from "redux";
import login from "../auth/login.js";
import sidebar from "../local/sidebar.js";
import users from "../app/admin/users/users.js";
import masters from "../app/admin/users/masters.js";
import createUser from "../app/admin/users/createUser.js";

// dawdaw

const reducers = combineReducers({
  login,
  sidebar,
  users,
  masters,
  createUser,
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export default rootReducer;
