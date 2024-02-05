import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
    name: "update-designation",
    initialState: {
        updateDesignationResponse: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.updateDesignationResponse = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.updateDesignationResponse = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.updateDesignationResponse = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const updateDesignation = (data) =>
    apiCallBegan({
        url: "api/User/UpdateDesignations",
        method: "POST",
        data,
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetUpdateDesignationState = () => async (dispatch) => {
    dispatch(reset());
};
