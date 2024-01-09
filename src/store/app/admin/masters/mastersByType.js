import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "masters-by-type",
  initialState: {
    mastersByType: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.mastersByType = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.mastersByType = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.mastersByType = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getMastersByType = (data) =>
  apiCallBegan({
    url: "api/User/GetMasters",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetMastersByTypeState = () => async (dispatch) => {
  dispatch(reset());
};
