import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get_question_details_by_id",
  initialState: {
    questionByIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.questionByIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.questionByIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.questionByIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getQuestionDetailsByID = (data) =>
  apiCallBegan({
    url: "api/Question/GetQuestionDetailsByID",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetQuestionDetailState = () => async (dispatch) => {
  dispatch(reset());
};
