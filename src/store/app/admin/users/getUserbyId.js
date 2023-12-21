import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_user_by_id",
  initialState: {
    userByIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.userByIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.userByIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.userByIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getUserDetailsByID = (data) =>
  apiCallBegan({
    url: "api/User/GetUserDetails",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetUserDetailState = () => async (dispatch) => {
  dispatch(reset());
};
