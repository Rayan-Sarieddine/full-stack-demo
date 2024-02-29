import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  id: "",
  fullName: "",
  userType: "",
  token: "",
};

export const userSliceName = "User";

export const userSlice = createSlice({
  name: userSliceName,
  initialState,
  reducers: {
    loggedIn: (state, { payload }) => {
      const { email, id, fullName, userType, token } = payload;

      return {
        email,
        id,
        fullName,
        userType,
        token,
      };
    },
    cleanData: () => {
      return { ...initialState };
    },
    updateImage: (state, { payload }) => {
      const { image } = payload;
      return { ...state, image };
    },
  },
});

export const { loggedIn, cleanData, updateImage } = userSlice.actions;

export default userSlice.reducer;
