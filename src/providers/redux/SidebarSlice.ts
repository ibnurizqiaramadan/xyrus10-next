'use client';

import { createSlice } from '@reduxjs/toolkit';

export interface SidebarState {
  value: boolean
}

const initialState: SidebarState = {
  value: true,
};

export const SidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.value = !state.value;
    },
  },
});
