import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";
import { isJSONString } from "../../../../utils/common.js";

const slice = createSlice({
  name: "post-images-for-report",
  initialState: {
    postImageResponse: null,
    loading: false,
  },
  reducers: {
    requested: (report, action) => {
      report.loading = true;
    },
    success: (report, action) => {
      if (isJSONString(action.payload.data)) {
        const data = JSON.parse(action.payload.data);

        const newData = {
          ...action.payload,
          data: data,
        };

        report.postImageResponse = newData;
        report.loading = false;
      } else {
        report.postImageResponse = action.payload;
        report.loading = false;
      }
    },
    failed: (report, action) => {
      report.postImageResponse = action.payload;
      report.loading = false;
    },
    reset: (report, action) => {
      report.postImageResponse = null;
      report.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const postImage = (data) =>
  apiCallBegan({
    url: "/api/Report/UploadSummaryImages",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetpostImageState = () => async (dispatch) => {
  dispatch(reset());
};
