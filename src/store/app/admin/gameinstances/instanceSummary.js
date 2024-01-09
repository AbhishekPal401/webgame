import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_instance_summary",
  initialState: {
    instanceSummary: null,
    loading: false,
  },
  reducers: {
    requested: (instance, action) => {
      instance.loading = true;
    },
    success: (instance, action) => {
      instance.instanceSummary = action.payload;
      instance.loading = false;
    },
    failed: (instance, action) => {
      instance.instanceSummary = action.payload;
      instance.loading = false;
    },
    reset: (instance, action) => {
      instance.instanceSummary = null;
      instance.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getInstanceSummaryById = (data) =>
  apiCallBegan({
    url: "api/Instance/GroupNameByOrgIDs",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetInstanceSummaryByIDState = () => async (dispatch) => {
  dispatch(reset());
};
