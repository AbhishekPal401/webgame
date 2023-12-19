import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "admin-sidebar",
  initialState: {
    currentActive: "home",
  },
  reducers: {
    success: (users, action) => {
      users.currentActive = action.payload;
    },

    reset: (users, action) => {
      users.currentActive = "home";
    },
  },
});

const { success, reset } = slice.actions;

export default slice.reducer;

export const setCurrentActive = (pagename) => async (dispatch) => {
  dispatch(success(pagename));
};

export const resetCurrentActive = () => async (dispatch) => {
  dispatch(reset());
};
