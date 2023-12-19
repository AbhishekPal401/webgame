import { combineReducers } from "redux";
import login from "../auth/login.js";
import sidebar from "../local/sidebar.js";
import users from "../app/admin/users/users.js";

const reducers = combineReducers({
  login,
  sidebar,
  users,
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export default rootReducer;
