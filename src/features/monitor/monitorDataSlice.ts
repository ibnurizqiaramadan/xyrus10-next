import { createSlice } from '@reduxjs/toolkit';
import { CpuData, MemoryStorage } from '@/helper/type';

type monitorType = {
  cpuData : CpuData,
  memoryStorage : MemoryStorage
}

export const monitorSlice = createSlice({
  name: 'Monitor Data Store',
  initialState: {
    cpuData: {
      name: '-',
      speed: 0,
      threads: 0,
      usage: 0,
      uptime: '-',
      cores: [],
      coresAll: [],
    },
    memoryStorage: {
      disk: [],
      memPercent: 0,
      memTotal: 0,
      memUsed: 0,
      swapPercent: 0,
      swapTotal: 0,
      swapUsed: 0,
    },
  } as unknown as monitorType,
  reducers: {
    setMonitorData(state, action) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setMonitorData } = monitorSlice.actions;

export default monitorSlice.reducer;
