import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "create-game-instance",
  initialState: {
    createGameInstanceResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.createGameInstanceResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.createGameInstanceResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.createGameInstanceResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const createGameInstance = (data) =>
  apiCallBegan({
    url: "api/Instance/CreateInstance",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetCreateGameInstanceState = () => async (dispatch) => {
  dispatch(reset());
};
