import { configureStore } from "@reduxjs/toolkit";
import userReducer, { userSliceName } from "./User";
import todoReducer, { todoSliceName } from "./Todo";

export const store = configureStore({
  reducer: {
    [userSliceName]: userReducer,
    [todoSliceName]: todoReducer,
  },
  devTools: true,
});
