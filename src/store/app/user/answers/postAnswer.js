import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";
import { isJSONString } from "../../../../utils/common.js";

const slice = createSlice({
  name: "post-answer-details",
  initialState: {
    answerDetails: null,
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

        users.answerDetails = newData;
      } else {
        users.answerDetails = action.payload;
      }

      users.loading = false;
    },
    failed: (users, action) => {
      users.answerDetails = action.payload;
      users.loading = false;
    },
    reset: (users, action) => {
      users.answerDetails = null;
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const submitAnswerDetails = (data) =>
  apiCallBegan({
    url: "/api/Question/AnswerSubmitRequest",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetAnswerDetailsState = () => async (dispatch) => {
  dispatch(reset());
};
