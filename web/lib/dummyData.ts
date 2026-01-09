// lib/dummyData.ts
import { StreamData } from '@/hooks/useStreamData';

const NOW = Math.floor(Date.now() / 1000);
const DAY_IN_SEC = 86400;

export const DUMMY_STREAMS: StreamData[] = [
  {
    stream_id: "0",
    sender: "0x7a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t",
    recipient: "0x4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e",
    amount: "5000000000", // 50 MOVE (8 decimals)
    start_time: (NOW - DAY_IN_SEC).toString(),
    end_time: (NOW + DAY_IN_SEC).toString(),
    coin_type: "0x1::aptos_coin::AptosCoin", // Crucial fix: Added coin_type
    isActive: true,
    progress: 50.0,
    accruedFunds: 25.0,
    availableToWithdraw: 1500000000, // In Octas (15 MOVE)
    timeRemaining: DAY_IN_SEC,
  },
  {
    stream_id: "1",
    sender: "0x7a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t",
    recipient: "0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
    amount: "100000000", // 100 USDC (6 decimals)
    start_time: (NOW - (DAY_IN_SEC * 2)).toString(),
    end_time: (NOW - 3600).toString(),
    coin_type: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC", 
    isActive: false,
    progress: 100.0,
    accruedFunds: 100.0,
    availableToWithdraw: 0,
    timeRemaining: 0,
  }
];