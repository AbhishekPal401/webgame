import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../middleware/actions.js";
import axios from "axios";
import { baseUrl } from "../../middleware/url.js";

//api calling type 2

// export const login = createAsyncThunk("login", async (data) => {
//   const response = await axios.post(`${baseUrl}\api/Auth/Auth`, data);
//   return response.data;
// });

const slice = createSlice({
  name: "user-login",
  initialState: {
    credentials: null,
    loading: false,
    status: "idle",
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.credentials = action.payload;
      users.loading = false;
    },
    failed: (users, action) => {
      users.credentials = action.payload;
      users.loading = false;
    },
    logout: (users, action) => {
      users.credentials = action.payload;
      users.loading = false;
    },

    reset: (users, action) => {
      users.credentials = null;
      users.loading = false;
      users.status = "idle";
    },
  },
  // extraReducers(builder) {
  //   builder
  //     .addCase(login.pending, (state, action) => {
  //       state.status = "loading";
  //     })
  //     .addCase(login.fulfilled, (state, action) => {
  //       state.status = "succeeded";
  //       state.posts = state.posts.concat(action.payload);
  //     })
  //     .addCase(login.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.error.message;
  //     });
  // },
});

const { requested, success, failed, logout, reset } = slice.actions;

export default slice.reducer;

//api calling type 1

// export const login = (data) =>
//   apiCallBegan({
//     url: "api/Auth/Auth",
//     method: "POST",
//     data,
//     onStart: requested.type,
//     onSuccess: success.type,
//     onFailed: failed.type,
//   });

export const login = (data) => async (dispatch) => {
  try {
    dispatch(requested());
    const headers = { "Content-Type": "application/json" };

    const response = await axios.request({
      baseURL: baseUrl,
      url: "/api/Auth/Auth",
      method: "POST",
      data,
      headers,
    });

    dispatch(success(response.data));
  } catch (err) {
    dispatch(
      failed(
        err.response && err.response.data ? err.response.data : err.message
      )
    );
  }
};

export const resetLoginState = () => async (dispatch) => {
  dispatch(reset());
};

export const azurelogin = (data) => async (dispatch) => {
  try {
    dispatch(requested());

    const headers = { "Content-Type": "application/json" };

    const response = await axios.request({
      baseURL: baseUrl,
      url: "/api/Auth/AuthByEmail",
      method: "POST",
      data,
      headers,
    });

    dispatch(success(response.data));
  } catch (err) {
    dispatch(
      failed(
        err.response && err.response.data ? err.response.data : err.message
      )
    );
  }
};
