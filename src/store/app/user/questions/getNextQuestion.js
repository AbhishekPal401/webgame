import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";
import { isJSONString } from "../../../../utils/common.js";

const slice = createSlice({
  name: "get-next-question-details",
  initialState: {
    questionDetails: null,
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      if (isJSONString(action.payload.data)) {
        const data = JSON.parse(action.payload.data);
        const newData = {
          ...action.payload,
          data: data,
        };

        users.questionDetails = newData;
      } else {
        users.questionDetails = action.payload;
      }

      users.loading = false;
    },
    failed: (users, action) => {
      users.questionDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.questionDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getNextQuestionDetails = (data) =>
  apiCallBegan({
    url: "api/Question/GetNextQuestionDetails",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetNextQuestionDetailsState = () => async (dispatch) => {
  dispatch(reset());
};
