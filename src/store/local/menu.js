import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "sidebar_menu_local_states",
    initialState: {
        isHomePageReset: false,
        isMasterReset: false,
        isScenarioReset: false,
        isGameInstanceReset: false,
        isUserReset: false,
    },
    reducers: {
        changeResetHomePageState: (game, action) => {
            game.isHomePageReset = action.payload;
        },

        changeResetMasterState: (game, action) => {
            game.isMasterReset = action.payload;
        },

        changeResetScenarioState: (game, action) => {
            game.isScenarioReset = action.payload;
        },

        changeResetGameInstanceState: (game, action) => {
            game.isGameInstanceReset = action.payload;
        },

        changeResetUserState: (game, action) => {
            game.isUserReset = action.payload;
        },

        resetHomePageState: (game, action) => {
            game.isHomePageReset = false;
        },

        resetMasterState: (game, action) => {
            game.isMasterReset = false;
        },

        resetScenarioState: (game, action) => {
            game.isScenarioReset = false;
        },

        resetGameInstanceState: (game, action) => {
            game.isGameInstanceReset = false;
        },

        resetUserState: (game, action) => {
            game.isUserReset = false;
        },
    },
});

const {
    changeResetHomePageState,
    changeResetMasterState,
    changeResetScenarioState,
    changeResetGameInstanceState,
    changeResetUserState,
    resetHomePageState,
    resetMasterState,
    resetScenarioState,
    resetGameInstanceState,
    resetUserState,
} =
    slice.actions;

export default slice.reducer;

export const setIsResetHomePageState = (state) => async (dispatch) => {
    dispatch(changeResetHomePageState(state));
};

export const setIsResetMasterState = (state) => async (dispatch) => {
    dispatch(changeResetMasterState(state));
};

export const setIsResetScenarioState = (state) => async (dispatch) => {
    dispatch(changeResetScenarioState(state));
};

export const setIsResetGameInstanceState = (state) => async (dispatch) => {
    dispatch(changeResetGameInstanceState(state));
};

export const setIsResetUserState = (state) => async (dispatch) => {
    dispatch(changeResetUserState(state));
};


export const resetHomePageStates = () => async (dispatch) => {
    dispatch(resetHomePageState());
};

export const resetMasterStates = () => async (dispatch) => {
    dispatch(resetMasterState());
};

export const resetScenarioStates = () => async (dispatch) => {
    dispatch(resetScenarioState());
};

export const resetGameInstanceStates = () => async (dispatch) => {
    dispatch(resetGameInstanceState());
};

export const resetUserStates = () => async (dispatch) => {
    dispatch(resetUserState());
};
