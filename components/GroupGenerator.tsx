
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { Users, Shuffle, Download, LayoutPanelLeft, FileSpreadsheet, Printer } from 'lucide-react';

interface Props {
  participants: Participant[];
}

const GroupGenerator: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);

  const generateGroups = () => {
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];

    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push({
        id: (i / groupSize) + 1,
        members: shuffled.slice(i, i + groupSize)
      });
    }

    setGroups(newGroups);
  };

  const exportToCSV = () => {
    if (groups.length === 0) return;

    // Build CSV content
    const headers = ["組別", "姓名"];
    const rows: string[] = [];

    groups.forEach(group => {
      group.members.forEach(member => {
        // Handle potential commas in names by wrapping in quotes if needed, 
        // though for simple names this is often overkill, good practice nonetheless.
        const safeName = member.name.includes(',') ? `"${member.name}"` : member.name;
        rows.push(`第 ${group.id} 組,${safeName}`);
      });
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create Blob with BOM (\uFEFF) for correct Chinese display in Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // Sanitize date string to remove slashes (which are invalid in filenames)
    // e.g., "2024/01/01" -> "2024-01-01"
    const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
    link.download = `分組名單_${dateStr}.csv`;

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">自動分組</h2>
          <p className="text-gray-500">設定分組大小，快速生成團隊名單。</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase">每組人數</span>
            <input
              type="number"
              min="2"
              max={participants.length}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
              className="w-16 bg-transparent text-lg font-bold text-indigo-600 outline-none"
            />
          </div>
          <button
            onClick={generateGroups}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200"
          >
            <Shuffle className="w-4 h-4" />
            隨機分組
          </button>
        </div>
      </header>

      {groups.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-gray-50 p-6 rounded-full">
            <LayoutPanelLeft className="w-16 h-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-400">尚未產生分組</h3>
          <p className="text-gray-400 max-w-xs">點擊上方按鈕，系統將自動將 {participants.length} 位成員分配到各組中。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100 flex items-center justify-between">
                <span className="font-bold text-indigo-700">第 {group.id} 組</span>
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-bold">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-5 space-y-2">
                {group.members.map((member, idx) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-400">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 font-medium">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {groups.length > 0 && (
        <div className="flex justify-center gap-6 pt-8 border-t border-gray-100">
          <button
            onClick={exportToCSV}
            className="text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all border border-indigo-100 shadow-sm"
          >
            <FileSpreadsheet className="w-5 h-5" />
            下載 CSV 紀錄
          </button>
          <button
            onClick={() => window.print()}
            className="text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all border border-gray-200 shadow-sm"
          >
            <Printer className="w-5 h-5" />
            列印分組結果
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupGenerator;
