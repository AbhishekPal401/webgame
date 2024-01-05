import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "create-group-users",
  initialState: {
    createGroupUsersResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.createGroupUsersResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.createGroupUsersResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.createGroupUsersResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const createGroupUsers = (data) =>
  apiCallBegan({
    url: "api/User/CreateGroupUsers", // TODO:: add path
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetCreateGroupUsersState = () => async (dispatch) => {
  dispatch(reset());
};
