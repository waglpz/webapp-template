import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  globalAlertData: {
    show: false,
    title: '',
    subtitle: '',
  },
};

const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    setGlobalAlertData (state, action) {
      state.globalAlertData = action.payload;
    }
  },
  extraReducers: () => {
  },
});

export const miscReduxData = (state) => state.misc;
export const { setGlobalAlertData } = miscSlice.actions;
export default miscSlice.reducer;


