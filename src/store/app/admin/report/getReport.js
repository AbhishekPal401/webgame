import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";
import { isJSONString } from "../../../../utils/common.js";

const slice = createSlice({
  name: "get-report-by-id",
  initialState: {
    reportData: null,
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

        report.reportData = newData;
        report.loading = false;
      } else {
        report.reportData = action.payload;
        report.loading = false;
      }
    },
    failed: (report, action) => {
      report.reportData = action.payload;
      report.loading = false;
    },
    reset: (report, action) => {
      report.reportData = null;
      report.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getReport = (data) =>
  apiCallBegan({
    url: "/api/Report/GenerateSummaryReport",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetReportState = () => async (dispatch) => {
  dispatch(reset());
};
