export type CpuData = {
  name: string,
  usage: number,
  threads: number,
  speed: number,
  uptime: string,
  cores: Number[]
  coresAll: Number[]
}

export type MemoryStorage = {
  disks: {
        device: string;
        used: number;
        total: number;
        free: number;
        percent: number;
    }[]
  memPercent: number;
  memTotal: number;
  memUsed: number;
  swapPercent: number;
  swapTotal: number;
  swapUsed: number;
}
