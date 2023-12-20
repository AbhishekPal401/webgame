import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "user-all-masters",
  initialState: {
    masters: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.masters = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.masters = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.masters = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getAllMasters = () =>
  apiCallBegan({
    url: "api/User/GetMasters",
    method: "POST",
    data: { masterType: "" },
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetMastersState = () => async (dispatch) => {
  dispatch(reset());
};
