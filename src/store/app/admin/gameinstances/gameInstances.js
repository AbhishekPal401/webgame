import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "game-instances-by-page",
  initialState: {
    gameInstancesByPage: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.gameInstancesByPage = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.gameInstancesByPage = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.gameInstancesByPage = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getGameInstancesByPage = (data) =>
  apiCallBegan({
    url: "api/Instance/InstanceDetailByPage",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetGameInstancesState = () => async (dispatch) => {
  dispatch(reset());
};
