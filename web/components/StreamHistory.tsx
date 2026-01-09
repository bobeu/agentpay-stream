/**
 * StreamHistory.tsx
 */
'use client';

import { StreamData } from '@/hooks/useStreamData';
import { History, Download, ExternalLink } from 'lucide-react';

interface StreamHistoryProps {
  streams: StreamData[];
  userAddress: string;
  isDummy?: boolean;
}

export default function StreamHistory({ streams, userAddress, isDummy }: StreamHistoryProps) {
  
  const exportToCSV = () => {
    const headers = ["Stream ID", "Sender", "Recipient", "Total Amount (MOVE)", "Progress (%)", "Status"];
    const rows = streams.map(s => [
      s.stream_id,
      s.sender,
      s.recipient,
      (parseInt(s.amount) / 100_000_000).toFixed(2),
      s.progress.toFixed(2),
      s.isActive ? "Active" : "Completed"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `movement_streams_${new Date().toISOString().slice(0,10)}.csv`);
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

      <div className="overflow-x-auto custom-scrollbar max-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-[#A0A0A0] bg-[#1A3A4A]/50">
              <th className="p-3">Type</th>
              <th className="p-3">Stream ID</th>
              <th className="p-3">Counterparty</th>
              <th className="p-3">Amount</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A3A4A]">
            {streams.map((stream) => (
              <tr key={stream.stream_id} className="hover:bg-[#00FFFF]/5 transition-colors group">
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    stream.sender.toLowerCase() === userAddress.toLowerCase() 
                    ? 'text-[#FF6600] bg-[#FF6600]/10' 
                    : 'text-[#00FFFF] bg-[#00FFFF]/10'
                  }`}>
                    {stream.sender.toLowerCase() === userAddress.toLowerCase() ? 'OUTGOING' : 'INCOMING'}
                  </span>
                </td>
                <td className="p-3 font-mono text-xs text-[#E0E0E0]">#{stream.stream_id}</td>
                <td className="p-3 font-mono text-xs text-[#A0A0A0]">
                  {formatAddress(stream.recipient)}
                </td>
                <td className="p-3 text-sm font-bold text-white">
                  {(parseInt(stream.amount) / 100_000_000).toFixed(2)} <span className="text-[#00FFFF] text-[10px]">MOVE</span>
                </td>
                <td className="p-3 text-right">
                   <ExternalLink className="w-4 h-4 inline text-[#A0A0A0] cursor-not-allowed" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
