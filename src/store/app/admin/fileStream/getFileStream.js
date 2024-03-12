import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";
import { baseUrl } from "../../../../middleware/url.js";
import axios from "axios";
import { extractFileType } from "../../../../utils/helper.js";

const slice = createSlice({
  name: "fileSteam_by_module",
  initialState: {
    fileStream: null,
    fileType: "",
    fileUrl: "",
    loading: false,
  },
  reducers: {
    requested: (users, action) => {
      users.loading = true;
    },
    success: (users, action) => {
      users.fileStream = action.payload.fileStream;
      users.fileType = action.payload.fileType;
      users.fileUrl = action.payload.fileUrl;

      users.loading = false;
    },
    failed: (users, action) => {
      users.fileStream = action.payload;

      users.loading = false;
    },
    reset: (users, action) => {
      users.fileStream = null;
      users.fileType = "";
      users.fileUrl = "";
      users.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getFileStream = (data) => async (dispatch, getState) => {
  try {
    dispatch(requested());

    const {
      login: { credentials },
    } = getState();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${credentials?.data?.token}`,
    };

    const response = await axios.request({
      baseURL: baseUrl,
      url: "/api/Storage/GetFileStream",
      method: "POST",
      data,
      headers,
      responseType: "blob",
    });

    const setdata = {
      fileStream: URL.createObjectURL(new Blob([response.data])),
      fileType: extractFileType(data?.fileName) || "",
      fileUrl: data?.fileName || "",
    };

    dispatch(success(setdata));
  } catch (err) {
    dispatch(
      failed(
        err.response && err.response.data ? err.response.data : err.message
      )
    );
  }
};

export const resetFileStreamState = () => async (dispatch) => {
  dispatch(reset());
};
