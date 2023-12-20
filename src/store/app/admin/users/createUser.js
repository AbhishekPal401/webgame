import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "create-user",
  initialState: {
    createUserResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.createUserResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.createUserResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.createUserResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const createUser = (data) =>
  apiCallBegan({
    url: "api/User/CreateUser",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetCreateUserState = () => async (dispatch) => {
  dispatch(reset());
};
