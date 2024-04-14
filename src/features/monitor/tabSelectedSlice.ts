import { createSlice } from '@reduxjs/toolkit';

export const monitorTabSelectedSlice = createSlice({
  name: 'Selected Tabs Monitor',
  initialState: {
    value: '',
  },
  reducers: {
    setSelectedTab(state, action) {
      state.value = action.payload;
    },
    changeSelectedTab: (state, action) => {
      state.value = action.payload === 'chart-overall' ? 'chart-percore' : 'chart-overall';
    },
  },
});

export const { setSelectedTab, changeSelectedTab } = monitorTabSelectedSlice.actions;

export default monitorTabSelectedSlice.reducer;
