import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  successLinks: [],
  errorLinks: [],
  internalLinks: [],
  externalLinks: [],
  replacedLinks: [],
};

const linkSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    setLinks: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (Array.isArray(action.payload[key])) {
          state[key] = action.payload[key]; 
        }
      });
    },
  },
});

export const { setLinks } = linkSlice.actions;
export default linkSlice.reducer;
