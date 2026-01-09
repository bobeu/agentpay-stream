// lib/dummyData.ts
import { StreamData } from '@/hooks/useStreamData';

export const DUMMY_STREAMS: StreamData[] = [
  {
    stream_id: "0",
    sender: "0x7a1b...c2d3",
    recipient: "0x4f5e...g6h7",
    amount: "5000000000", // 50 MOVE
    start_time: (Math.floor(Date.now() / 1000) - 86400).toString(),
    end_time: (Math.floor(Date.now() / 1000) + 86400).toString(),
    rate_per_second: "28935",
    withdrawn: "1000000000",
    accruedFunds: 25.5,
    availableToWithdraw: 15.5,
    isActive: true,
    timeRemaining: 86400,
    progress: 51.0,
  },
  {
    stream_id: "1",
    sender: "0x7a1b...c2d3",
    recipient: "0x9i0j...k1l2",
    amount: "1000000000", // 10 MOVE
    start_time: (Math.floor(Date.now() / 1000) - 172800).toString(),
    end_time: (Math.floor(Date.now() / 1000) - 3600).toString(),
    rate_per_second: "5787",
    withdrawn: "1000000000",
    accruedFunds: 10.0,
    availableToWithdraw: 0,
    isActive: false,
    timeRemaining: 0,
    progress: 100.0,
  }
];