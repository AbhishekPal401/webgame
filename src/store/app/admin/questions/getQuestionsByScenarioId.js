import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
  name: "get-questions-by-scenario-id",
  initialState: {
    questionsByScenarioIdDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.questionsByScenarioIdDetails = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.questionsByScenarioIdDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.questionsByScenarioIdDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getQuestionsByScenarioId = (data) =>
  apiCallBegan({
    url: "api/Question/GetQuestionListByPage",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetQuestionDetailState = () => async (dispatch) => {
  dispatch(reset());
};
