import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../../middleware/actions";

const slice = createSlice({
    name: "update_score_master_by_scenario_id",
    initialState: {
        updateScoreMasterResponse: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.updateScoreMasterResponse = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.updateScoreMasterResponse = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.updateScoreMasterResponse = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const updateScoreMaster = (data) =>
    apiCallBegan({
        url: "api/Question/UpdateScoreMasterByScenario",
        method: "POST",
        data,
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetUpdateScoreMasterState = () => async (dispatch) => {
    dispatch(reset());
};
