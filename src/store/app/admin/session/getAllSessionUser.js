import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../../../../middleware/actions.js";
import { isJSONString } from "../../../../utils/common.js";

const slice = createSlice({
  name: "get_all_users_in_session",
  initialState: {
    allUsersInSession: null,
    loading: false,
  },
  reducers: {
    requested: (session, action) => {
      session.loading = true;
    },
    success: (session, action) => {
      if (isJSONString(action.payload.data)) {
        const data = JSON.parse(action.payload.data);

        const groupedData = data.reduce((result, user) => {
          const designationName = user.DesignationName;

          // Checking if the designation already exists in the result
          const existingGroup = result.find(
            (group) => group.designation === designationName
          );

          if (existingGroup) {
            // Adding the user to the existing group
            existingGroup.users.push(user);
          } else {
            // Creating a new group for the designation
            result.push({
              designation: designationName,
              users: [user],
            });
          }

          return result;
        }, []);
        const newData = {
          ...action.payload,
          data: groupedData,
        };

        session.allUsersInSession = newData;
      } else {
        session.allUsersInSession = action.payload;
      }

      session.loading = false;
    },
    failed: (session, action) => {
      session.allUsersInSession = action.payload;
      session.loading = false;
    },
    reset: (session, action) => {
      session.allUsersInSession = null;
      session.loading = false;
    },
  },
});

const { requested, success, failed, reset } = slice.actions;

export default slice.reducer;

export const getAllUsersInSession = (data) =>
  apiCallBegan({
    url: "api/GameSession/GetAllSessionUsers",
    method: "POST",
    data,
    onStart: requested.type,
    onSuccess: success.type,
    onFailed: failed.type,
  });

export const resetGetAllUsersInSessionState = () => async (dispatch) => {
  dispatch(reset());
};
