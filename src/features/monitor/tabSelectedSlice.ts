import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'Selected Tabs Monitor',
  initialState: {
    value: '',
  },
  reducers: {
    set(state, action) {
      state.value = action.payload;
    },
    change: (state, action) => {
      state.value = action.payload === 'chart-overall' ? 'chart-percore' : 'chart-overall';
    },
  },
});

export const { set, change } = counterSlice.actions;

export default counterSlice.reducer;
