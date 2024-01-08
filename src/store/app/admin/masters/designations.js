import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "designation-all",
  initialState: {
    designationsByPage: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.designationsByPage = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.designationsByPage = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.designationsByPage = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getDesignationsbyPage = (data) =>
  apiCallBegan({
    url: "", // TODO:: add path
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetDesignationState = () => async (dispatch) => {
  dispatch(reset());
};
