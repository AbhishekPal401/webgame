import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "user-all-designations",
  initialState: {
    designations: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.designations = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.designations = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.designations = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getAllDesignations = (data) =>
  apiCallBegan({
    url: "api/User/GetDesignationListByPage",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetDesignationsState = () => async (dispatch) => {
  dispatch(reset());
};
