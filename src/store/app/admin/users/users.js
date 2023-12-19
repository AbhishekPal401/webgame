import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "user-all",
  initialState: {
    usersByPage: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.usersByPage = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.usersByPage = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.usersByPage = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getUsersbyPage = (data) =>
  apiCallBegan({
    url: "api/User/UserDetailByPage",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetUserState = () => async (dispatch) => {
  dispatch(reset());
};
