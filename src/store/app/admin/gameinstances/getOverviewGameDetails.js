import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";
import { isJSONString } from "../../../../utils/common.js";

const slice = createSlice({
  name: "get_overview_game_details_by_id",
  initialState: {
    getOverviewGameByIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (instance, action) => {
      instance.loading = true;
    },
    success: (instance, action) => {
      if (isJSONString(action.payload.data)) {
        const data = JSON.parse(action.payload.data);

        const newData = {
          ...action.payload,
          data: data,
        };

        instance.getOverviewGameByIdDetails = newData;
        instance.loading = false;
      } else {
        instance.getOverviewGameByIdDetails = action.payload;
        instance.loading = false;
      }
    },
    failed: (instance, action) => {
      instance.getOverviewGameByIdDetails = action.payload;
      instance.loading = false;
    },
    reset: (instance, action) => {
      instance.getOverviewGameByIdDetails = null;
      instance.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getOverviewGameDetailsById = (data) =>
  apiCallBegan({
    url: "api/Instance/GetOverviewGameDetails",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetOverviewGameDetailState = () => async (dispatch) => {
  dispatch(reset());
};

