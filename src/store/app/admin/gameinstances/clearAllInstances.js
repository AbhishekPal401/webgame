import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
    name: "clear-all-game-instances",
    initialState: {
        clearAllGameInstancesResponse: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.clearAllGameInstancesResponse = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.clearAllGameInstancesResponse = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.clearAllGameInstancesResponse = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const clearAllGameInstances = () =>
    apiCallBegan({
        url: "api/Instance/ClearInstance",
        method: "GET",
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetClearAllGameInstancesState = () => async (dispatch) => {
    dispatch(reset());
};
