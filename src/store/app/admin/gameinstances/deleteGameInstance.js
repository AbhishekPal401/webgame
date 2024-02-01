import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
    name: "delete-game-instance",
    initialState: {
        deleteGameInstanceResponse: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.deleteGameInstanceResponse = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.deleteGameInstanceResponse = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.deleteGameInstanceResponse = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const deleteGameInstanceByID = (data) =>
    apiCallBegan({
        url: "api/Instance/DeleteInstance",
        method: "POST",
        data,
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetDeleteGameInstanceState = () => async (dispatch) => {
    dispatch(reset());
};
