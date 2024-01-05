import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_game_players_by_group_id",
  initialState: {
    gamePlayersByGroupIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.gamePlayersByGroupIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.gamePlayersByGroupIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.gamePlayersByGroupIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getGamePlayerDetailsByGroupID = (data) =>
  apiCallBegan({
    url: "api/Instance/GetGamePlayersByGroupID",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetGamePlayerDetailsByGroupIDState = () => async (dispatch) => {
  dispatch(reset());
};
