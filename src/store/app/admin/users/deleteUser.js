import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "delete-user",
  initialState: {
    deleteUserResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.deleteUserResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.deleteUserResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.deleteUserResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const deleteUserByID = (data) =>
  apiCallBegan({
    url: "api/User/DeleteUser",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetDeleteUserState = () => async (dispatch) => {
  dispatch(reset());
};
