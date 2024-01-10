import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "create-master-by-type",
  initialState: {
    createMasterResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.createMasterResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.createMasterResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.createMasterResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const createMaster = (data) =>
  apiCallBegan({
    url: "api/User/CreateMasters",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetCreateMasterState = () => async (dispatch) => {
  dispatch(reset());
};
