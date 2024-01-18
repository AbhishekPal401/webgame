import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "user-all-organizations",
  initialState: {
    organizations: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.organizations = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.organizations = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.organizations = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getAllOrganizations = () =>
  apiCallBegan({
    url: "api/User/GetOrganizationList",
    method: "POST",
    data: {},
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetOrganizationsState = () => async (dispatch) => {
  dispatch(reset());
};
