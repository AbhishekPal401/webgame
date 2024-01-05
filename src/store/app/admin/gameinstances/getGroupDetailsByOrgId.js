import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_group_details_by_organization_id",
  initialState: {
    groupByOrgIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.groupByOrgIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.groupByOrgIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.groupByOrgIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getGroupDetailsByOrgID = (data) =>
  apiCallBegan({
    url: "api/Instance/GroupNameByOrgIDs",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetGroupDetailsByOrgIDState = () => async (dispatch) => {
  dispatch(reset());
};
