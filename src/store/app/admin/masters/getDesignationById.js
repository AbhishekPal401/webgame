import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_designation_by_id",
  initialState: {
    designationByIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.designationByIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.designationByIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.designationByIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getDesignationDetailsByID = (data) =>
  apiCallBegan({
    url: "api/User/GetDesignationByIDs",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetDesignationDetailState = () => async (dispatch) => {
  dispatch(reset());
};
