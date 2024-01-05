import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_game_instance_by_id",
  initialState: {
    gameInstanceByIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.gameInstanceByIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.gameInstanceByIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.gameInstanceByIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getGameInstanceDetailsByID = (data) =>
  apiCallBegan({
    url: "api/Instance/GetInstanceDetailsByID",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetGameInstanceDetailState = () => async (dispatch) => {
  dispatch(reset());
};
