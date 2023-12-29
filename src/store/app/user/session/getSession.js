import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get-session-details",
  initialState: {
    sessionDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.sessionDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.sessionDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.sessionDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getSessionDetails = (data) =>
  apiCallBegan({
    url: "api/GameSession/GetLiveSessionByUserID",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetSessionDetailsState = () => async (dispatch) => {
  dispatch(reset());
};
