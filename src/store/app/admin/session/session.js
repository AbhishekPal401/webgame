import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "session-history-by-type",
  initialState: {
    sessionsHistoryByType: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.sessionsHistoryByType = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.sessionsHistoryByType = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.sessionsHistoryByType = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getSessionHistoryByType = (data) =>
  apiCallBegan({
    url: "api/Instance/InstanceDetailByPage",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetSessionState = () => async (dispatch) => {
  dispatch(reset());
};
