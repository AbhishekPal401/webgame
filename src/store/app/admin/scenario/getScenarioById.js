import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_scenario_by_id",
  initialState: {
    scenarioByIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.scenarioByIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.scenarioByIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.scenarioByIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getScenarioDetailsByID = (data) =>
  apiCallBegan({
    url: "api/Scenario/ScenarioDetailsByID",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetScenarioDetailState = () => async (dispatch) => {
  dispatch(reset());
};
