import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "game_play_local_states",
  initialState: {
    isConnectedToServer: false,
    activeUsers: [],
    progressImage: "",
  },
  reducers: {
    changeConnectionState: (game, action) => {
      game.isConnectedToServer = action.payload;
    },

    activeUsers: (game, action) => {
      game.activeUsers = action.payload;
    },

    setProgressImage: (game, action) => {
      game.progressImage = action.payload;
    },

    reset: (game, action) => {
      game.isConnectedToServer = false;
    },
  },
});

const { changeConnectionState, reset, activeUsers, setProgressImage } =
  slice.actions;

export default slice.reducer;

export const setConnectionState = (state) => async (dispatch) => {
  dispatch(changeConnectionState(state));
};

export const setActiveUsers = (state) => async (dispatch) => {
  dispatch(activeUsers(state));
};

export const setProgressImageData = (state) => async (dispatch) => {
  dispatch(setProgressImage(state));
};

export const resetGamePlayStates = () => async (dispatch) => {
  dispatch(reset());
};
