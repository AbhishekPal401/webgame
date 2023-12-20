import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "scenario-by-page",
  initialState: {
    scenarioByPage: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.scenarioByPage = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.scenarioByPage = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.scenarioByPage = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getScenarioByPage = (data) =>
  apiCallBegan({
    url: "api/Scenario/ScenarioDetailByPage",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetUserState = () => async (dispatch) => {
  dispatch(reset());
};
