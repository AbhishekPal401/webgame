import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "organization-all",
  initialState: {
    organizationsByPage: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.organizationsByPage = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.organizationsByPage = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.organizationsByPage = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getOrganizationsbyPage = (data) =>
  apiCallBegan({
    url: "", // TODO:: add path
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetOrganizationState = () => async (dispatch) => {
  dispatch(reset());
};
