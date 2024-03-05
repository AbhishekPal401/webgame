import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../middleware/url.js";
import { signalRService } from "../../services/signalR.js";
import { UserManager } from "oidc-react";
import { oidcConfig } from "../../constants/oidc.js";

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
    id_token: null,
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
      users.loginType = "default";
      users.id_token = null;
    },

    loginType: (users, action) => {
      users.loginType = action.payload;
    },

    setToken: (users, action) => {
      users.id_token = action.payload;
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

export const {
  requested,
  success,
  failed,
  logout,
  reset,
  loginType,
  setToken,
} = slice.actions;

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

export const pwclogin = (data, token) => async (dispatch) => {
  try {
    dispatch(requested());

    dispatch(token(token.id_token));

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
    login: { loginType, id_token },
  } = getState();

  if (loginType === "pwc") {
    console.log("pwc logout");

    try {
      const userManager = new UserManager(oidcConfig);

      console.log("id_token", id_token);

      await userManager.signoutPopup({ id_token_hint: id_token });
      sessionStorage.clear();
      signalRService.stopConnection();
      dispatch(logout());
    } catch (error) {
      console.error("Error logging out:", error);
    }
  } else {
    signalRService.stopConnection();

    dispatch(logout());
  }
};
