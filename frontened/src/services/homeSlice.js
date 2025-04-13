import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  maxPage: 1,
  category: "true",
  userLink: "",
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setMaxPage: (state, action) => {
      state.maxPage = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setUserLink: (state, action) => {
      state.userLink = action.payload;
    },
  },
});

export const { setMaxPage, setCategory, setUserLink } = homeSlice.actions;
export default homeSlice.reducer;
