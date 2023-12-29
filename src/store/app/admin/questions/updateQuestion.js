import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "update-question",
  initialState: {
    updateQuestionResponse: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.updateQuestionResponse = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.updateQuestionResponse = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.updateQuestionResponse = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const updateQuestion = (data) =>
  apiCallBegan({
    url: "api/Question/UpdateQuestionBuilders", 
    method: "PUT",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetUpdateQuestionState = () => async (dispatch) => {
  dispatch(reset());
};
