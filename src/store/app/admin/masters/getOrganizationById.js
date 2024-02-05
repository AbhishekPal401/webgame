import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_organization_by_id",
  initialState: {
    organizationByIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.organizationByIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.organizationByIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.organizationByIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getOrganizationDetailsByID = (data) =>
  apiCallBegan({
    url: "api/User/GetOrganizationByIDs",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetOrganizationDetailState = () => async (dispatch) => {
  dispatch(reset());
};
