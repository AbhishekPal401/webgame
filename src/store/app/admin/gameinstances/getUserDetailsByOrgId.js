import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
    name: "get_user_detail_by_org_id",
    initialState: {
        userByOrgIdDetails: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.userByOrgIdDetails = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.userByOrgIdDetails = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.userByOrgIdDetails = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getUserDetailsByOrgID = (data) =>
    apiCallBegan({
        url: "api/User/UserDetailByOrgID",
        method: "POST",
        data,
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetUserDetailByOrgIdState = () => async (dispatch) => {
    dispatch(reset());
};
