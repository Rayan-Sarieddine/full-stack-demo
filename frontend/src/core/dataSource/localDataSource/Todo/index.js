import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const todoSliceName = "Todo";

export const todoSlice = createSlice({
  name: todoSliceName,
  initialState,
  reducers: {
    saveTodos: (state, { payload }) => {
      return payload.todos;
    },
    cleanData: () => {
      return initialState;
    },
  },
});

export const { saveTodos, cleanData } = todoSlice.actions;

export default todoSlice.reducer;
