import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "update-game-instance",
  initialState: {
    updateGameInstanceResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.updateGameInstanceResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.updateGameInstanceResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.updateGameInstanceResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const updateGameInstance = (data) =>
  apiCallBegan({
    url: "api/Instance/UpdateGameInstance", 
    method: "PUT",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetUpdateGameInstanceState = () => async (dispatch) => {
  dispatch(reset());
};
