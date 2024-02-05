import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
    name: "update-organization",
    initialState: {
        updateOrganizationResponse: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.updateOrganizationResponse = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.updateOrganizationResponse = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.updateOrganizationResponse = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const updateOrganization = (data) =>
    apiCallBegan({
        url: "api/User/UpdateOrganization", 
        method: "POST",
        data,
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetUpdateOrganizationState = () => async (dispatch) => {
    dispatch(reset());
};
