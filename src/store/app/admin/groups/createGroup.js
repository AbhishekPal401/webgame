import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "create-group",
  initialState: {
    createGroupResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.createGroupResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.createGroupResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.createGroupResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const createGroup = (data) =>
  apiCallBegan({
    url: "api/User/CreateGroup", // TODO:: add path
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetCreateGroupState = () => async (dispatch) => {
  dispatch(reset());
};
