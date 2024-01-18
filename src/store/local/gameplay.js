import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "game_play_local_states",
  initialState: {
    isConnectedToServer: false,
  },
  reducers: {
    changeConnectionState: (game, action) => {
      game.isConnectedToServer = action.payload;
    },

    reset: (game, action) => {
      game.isConnectedToServer = false;
    },
  },
});

const { changeConnectionState, reset } = slice.actions;

export default slice.reducer;

export const setConnectionState = (state) => async (dispatch) => {
  dispatch(changeConnectionState(state));
};

export const resetGamePlayStates = () => async (dispatch) => {
  dispatch(reset());
};
