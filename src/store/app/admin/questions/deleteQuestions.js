import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "delete-question",
  initialState: {
    deleteQuestionResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.deleteQuestionResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.deleteQuestionResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.deleteQuestionResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const deleteQuestionByID = (data) =>
  apiCallBegan({
    url: "api/Question/DeleteQuestionLists",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetDeleteQuestionState = () => async (dispatch) => {
  dispatch(reset());
};
