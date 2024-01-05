import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_scenario_name_and_id",
  initialState: {
    scenarioNameAndIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.scenarioNameAndIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.scenarioNameAndIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.scenarioNameAndIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getScenarioNameAndIdDetails = (data) =>
  apiCallBegan({
    url: "api/Scenario/GetScenarioDetails",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetScenarioNameAndIdDetailsState = () => async (dispatch) => {
  dispatch(reset());
};
