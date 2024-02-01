import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
    name: "clear-game-instance-by-id",
    initialState: {
        clearGameInstanceByIdResponse: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.clearGameInstanceByIdResponse = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.clearGameInstanceByIdResponse = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.clearGameInstanceByIdResponse = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const clearGameInstanceByID = (data) =>
    apiCallBegan({
        url: "api/Instance/ClearInstance",
        method: "POST",
        data,
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetClearGameInstanceState = () => async (dispatch) => {
    dispatch(reset());
};
