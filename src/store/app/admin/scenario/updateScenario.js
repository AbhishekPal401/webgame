import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "update-scenario",
  initialState: {
    updateScenarioResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.updateScenarioResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.updateScenarioResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.updateScenarioResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const updateScenario = (data) =>
  apiCallBegan({
    url: "api/Scenario/UpdateScenario", // TODO:: add path
    method: "PUT",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetUpdateScenarioState = () => async (dispatch) => {
  dispatch(reset());
};
