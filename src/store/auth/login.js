import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../middleware/url.js";
import { azureService } from "../../services/azure.js";
import { signalRService } from "../../services/signalR.js";

//api calling type 2

// export const login = createAsyncThunk("login", async (data) => {
//   const response = await axios.post(`${baseUrl}\api/Auth/Auth`, data);
//   return response.data;
// });

const slice = createSlice({
  name: "user-login",
  initialState: {
    credentials: null,
    loginType: "default",
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
      users.credentials = null;
      users.loading = false;
      users.status = "idle";
    },

    reset: (users, action) => {
      users.credentials = null;
      users.loading = false;
      users.status = "idle";
    },

    loginType: (users, action) => {
      users.loginType = action.payload;
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

export const { requested, success, failed, logout, reset, loginType } =
  slice.actions;

export default slice.reducer;

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

export const pwclogin = (data) => async (dispatch) => {
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
    dispatch(loginType("pwc"));
  } catch (err) {
    dispatch(
      failed(
        err.response && err.response.data ? err.response.data : err.message
      )
    );
  }
};

export const logoutUser = () => async (dispatch, getState) => {
  const {
    login: { loginType },
  } = getState();

  if (loginType === "pwc") {
    // const { success } = await azureService.azureLogout(dispatch);
    // if (success) {
    //   dispatch(logout());
    // }
    sessionStorage.clear();
    signalRService.stopConnection();
    dispatch(logout());
  } else {
    signalRService.stopConnection();

    dispatch(logout());
  }
};
