import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "create-scenario",
  initialState: {
    createScenario: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.createScenario = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.createScenario = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.createScenario = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const createScenario = (data) =>
  apiCallBegan({
    url: "api/Scenario/CreateScenario",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetCreateScenarioState = () => async (dispatch) => {
  dispatch(reset());
};
