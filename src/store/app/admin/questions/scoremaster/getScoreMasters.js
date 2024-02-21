import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../../middleware/actions";

const slice = createSlice({
    name: "get_score_masters_by_scenario_id",
    initialState: {
        scoreMastersByScenarioIdDetails: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.scoreMastersByScenarioIdDetails = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.scoreMastersByScenarioIdDetails = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.scoreMastersByScenarioIdDetails = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getScoreMastersByScenarioID = (data) =>
    apiCallBegan({
        url: "api/Question/GetScoreMasters",
        method: "POST",
        data,
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetScoreMastersByScenarioIDState = () => async (dispatch) => {
    dispatch(reset());
};
