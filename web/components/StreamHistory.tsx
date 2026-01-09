// /**
//  * StreamHistory.tsx
//  */
// 'use client';

// import { StreamData } from '@/hooks/useStreamData';
// import { History, Download, ExternalLink } from 'lucide-react';

// interface StreamHistoryProps {
//   streams: StreamData[];
//   userAddress: string;
//   isDummy?: boolean;
// }

// export default function StreamHistory({ streams, userAddress, isDummy }: StreamHistoryProps) {
  
//   const exportToCSV = () => {
//     const headers = ["Stream ID", "Sender", "Recipient", "Total Amount (MOVE)", "Progress (%)", "Status"];
//     const rows = streams.map(s => [
//       s.stream_id,
//       s.sender,
//       s.recipient,
//       (parseInt(s.amount) / 100_000_000).toFixed(2),
//       s.progress.toFixed(2),
//       s.isActive ? "Active" : "Completed"
//     ]);

//     const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", `movement_streams_${new Date().toISOString().slice(0,10)}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

//   return (
//     <div className={`w-full bg-[#0A1F2E] border-2 rounded-xl overflow-hidden mt-8 ${isDummy ? 'opacity-60 grayscale-[0.5]' : ''}`}
//          style={{ borderRightWidth: '4px', borderBottomWidth: '4px', borderColor: isDummy ? '#1A3A4A' : '#00FFFF' }}>
      
//       <div className="p-4 border-b border-[#1A3A4A] bg-[#0F2A3A] flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <h3 className="text-[#00FFFF] font-bold uppercase tracking-tighter flex items-center gap-2">
//             <History className="w-4 h-4" /> Transaction Registry
//           </h3>
//           {isDummy && <span className="text-[10px] bg-[#FF6600] text-white px-2 py-0.5 rounded font-black animate-pulse">PREVIEW MODE</span>}
//         </div>
//         {!isDummy && (
//           <button 
//             onClick={exportToCSV}
//             className="flex items-center gap-2 text-xs font-bold text-[#A0A0A0] hover:text-[#00FFFF] transition-colors"
//           >
//             <Download className="w-3 h-3" /> EXPORT CSV
//           </button>
//         )}
//       </div>

//       <div className="overflow-x-auto custom-scrollbar max-h-[300px]">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="text-[10px] uppercase tracking-widest text-[#A0A0A0] bg-[#1A3A4A]/50">
//               <th className="p-3">Type</th>
//               <th className="p-3">Stream ID</th>
//               <th className="p-3">Counterparty</th>
//               <th className="p-3">Amount</th>
//               <th className="p-3 text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#1A3A4A]">
//             {streams.map((stream) => (
//               <tr key={stream.stream_id} className="hover:bg-[#00FFFF]/5 transition-colors group">
//                 <td className="p-3">
//                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
//                     stream.sender.toLowerCase() === userAddress.toLowerCase() 
//                     ? 'text-[#FF6600] bg-[#FF6600]/10' 
//                     : 'text-[#00FFFF] bg-[#00FFFF]/10'
//                   }`}>
//                     {stream.sender.toLowerCase() === userAddress.toLowerCase() ? 'OUTGOING' : 'INCOMING'}
//                   </span>
//                 </td>
//                 <td className="p-3 font-mono text-xs text-[#E0E0E0]">#{stream.stream_id}</td>
//                 <td className="p-3 font-mono text-xs text-[#A0A0A0]">
//                   {formatAddress(stream.recipient)}
//                 </td>
//                 <td className="p-3 text-sm font-bold text-white">
//                   {(parseInt(stream.amount) / 100_000_000).toFixed(2)} <span className="text-[#00FFFF] text-[10px]">MOVE</span>
//                 </td>
//                 <td className="p-3 text-right">
//                    <ExternalLink className="w-4 h-4 inline text-[#A0A0A0] cursor-not-allowed" />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }







/**
 * StreamHistory.tsx - Unified Registry for Generic Token Streams
 */
'use client';

import { StreamData } from '@/hooks/useStreamData';
import { History, Download } from 'lucide-react';

interface StreamHistoryProps {
  streams: StreamData[];
  userAddress: string;
  isDummy?: boolean;
}

export default function StreamHistory({ streams, userAddress, isDummy }: StreamHistoryProps) {
  
  const getStreamMetadata = (stream: StreamData) => {
    const isMove = stream.coin_type?.includes('aptos_coin') ?? true;
    return {
      symbol: isMove ? 'MOVE' : 'USDC',
      divisor: isMove ? 100_000_000 : 1_000_000
    };
  };

  const exportToCSV = () => {
    const headers = ["Stream ID", "Type", "Sender", "Recipient", "Total Amount", "Token", "Progress (%)", "Status"];
    const rows = streams.map(s => {
      const { symbol, divisor } = getStreamMetadata(s);
      return [
        s.stream_id,
        s.sender.toLowerCase() === userAddress.toLowerCase() ? 'OUTGOING' : 'INCOMING',
        s.sender,
        s.recipient,
        (parseInt(s.amount) / divisor).toFixed(6),
        symbol,
        s.progress.toFixed(2),
        s.isActive ? "Active" : "Completed"
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `movement_registry_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className={`w-full bg-[#0A1F2E] border-2 rounded-xl overflow-hidden mt-8 ${isDummy ? 'opacity-60 grayscale-[0.5]' : ''}`}
         style={{ borderRightWidth: '4px', borderBottomWidth: '4px', borderColor: isDummy ? '#1A3A4A' : '#00FFFF' }}>
      
      <div className="p-4 border-b border-[#1A3A4A] bg-[#0F2A3A] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-[#00FFFF] font-bold uppercase tracking-tighter flex items-center gap-2">
            <History className="w-4 h-4" /> Transaction Registry
          </h3>
          {isDummy && <span className="text-[10px] bg-[#FF6600] text-white px-2 py-0.5 rounded font-black animate-pulse">PREVIEW MODE</span>}
        </div>
        {!isDummy && (
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 text-xs font-bold text-[#A0A0A0] hover:text-[#00FFFF] transition-colors"
          >
            <Download className="w-3 h-3" /> EXPORT CSV
          </button>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar max-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-[#A0A0A0] bg-[#1A3A4A]/50">
              <th className="p-4">Type</th>
              <th className="p-4">ID</th>
              <th className="p-4">Counterparty</th>
              <th className="p-4">Asset Value</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A3A4A]">
            {streams.map((stream) => {
              const { symbol, divisor } = getStreamMetadata(stream);
              const isSender = stream.sender.toLowerCase() === userAddress.toLowerCase();
              
              return (
                <tr key={stream.stream_id} className="hover:bg-[#00FFFF]/5 transition-colors group">
                  <td className="p-4">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-sm tracking-tighter ${
                      isSender ? 'text-[#FF6600] bg-[#FF6600]/10 border border-[#FF6600]/20' : 'text-[#00FFFF] bg-[#00FFFF]/10 border border-[#00FFFF]/20'
                    }`}>
                      {isSender ? 'OUTGOING' : 'INCOMING'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-[#E0E0E0]">#{stream.stream_id}</td>
                  <td className="p-4 font-mono text-xs text-[#A0A0A0]">
                    {formatAddress(isSender ? stream.recipient : stream.sender)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white tracking-tight">
                        {(parseInt(stream.amount) / divisor).toFixed(4)}
                      </span>
                      <span className="text-[9px] font-bold text-[#00FFFF]">{symbol}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${stream.isActive ? 'bg-[#00FFFF] animate-pulse' : 'bg-gray-600'}`} />
                       <span className="text-[10px] font-mono text-[#A0A0A0]">
                         {stream.progress.toFixed(0)}%
                       </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}