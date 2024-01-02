'use client';

import { configureStore } from '@reduxjs/toolkit';
import { SidebarSlice } from './SidebarSlice';

export const store = configureStore({
  reducer: {
    sidebar: SidebarSlice.reducer,
  },
});
