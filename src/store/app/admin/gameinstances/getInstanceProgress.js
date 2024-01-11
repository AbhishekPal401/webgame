import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";
import { isJSONString } from "../../../../utils/common.js";

const slice = createSlice({
  name: "get_instance_progress_by_id",
  initialState: {
    instanceProgress: null,
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

        instance.instanceProgress = newData;
        instance.loading = false;
      } else {
        instance.instanceProgress = action.payload;
        instance.loading = false;
      }
    },
    failed: (instance, action) => {
      instance.instanceProgress = action.payload;
      instance.loading = false;
    },
    reset: (instance, action) => {
      instance.instanceProgress = null;
      instance.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getInstanceProgressyById = (data) =>
  apiCallBegan({
    url: "/api/Instance/GetInstanceProgress",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetInstanceProgressByIDState = () => async (dispatch) => {
  dispatch(reset());
};
