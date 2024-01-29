import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "delete-scenario",
  initialState: {
    deleteScenarioResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.deleteScenarioResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.deleteScenarioResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.deleteScenarioResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const deleteScenarioByID = (data) =>
  apiCallBegan({
    url: "api/Scenario/DeleteScenario",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetDeleteScenarioState = () => async (dispatch) => {
  dispatch(reset());
};
