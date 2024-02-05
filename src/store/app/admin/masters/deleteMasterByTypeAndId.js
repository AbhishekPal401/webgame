import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";

const slice = createSlice({
    name: "delete-master-by-type-and-id",
    initialState: {
        deleteMasterByTypeAndIdResponse: null,
        loading: false,
    },
    reducers: {
        requested: (users, action) => {
            users.loading = true;
        },
        success: (users, action) => {
            users.deleteMasterByTypeAndIdResponse = action.payload;
            users.loading = false;
        },
        failed: (users, action) => {
            users.deleteMasterByTypeAndIdResponse = action.payload;
            users.loading = false;
        },
        reset: (users, action) => {
            users.deleteMasterByTypeAndIdResponse = null;
            users.loading = false;
        },
    },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const deleteMasterByTypeAndId = (data) =>
    apiCallBegan({
        url: "api/User/DeleteMaster", 
        method: "POST",
        data,
        onStart: requested.type,
        onSuccess: success.type,
        onFailed: failed.type,
    });

export const resetDeleteMasterByTypeAndIdState = () => async (dispatch) => {
    dispatch(reset());
};
