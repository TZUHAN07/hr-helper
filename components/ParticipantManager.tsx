
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { Upload, Trash2, ArrowRight, UserPlus, FileText, Users, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
  onNext: () => void;
}

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate, onNext }) => {
  const [inputText, setInputText] = useState('');

  // 找出重複的姓名
  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return Object.keys(counts).filter(name => counts[name] > 1);
  }, [participants]);

  const handleProcessInput = () => {
    if (!inputText.trim()) return;
    
    const names = inputText.split(/[,\n]/).map(n => n.trim()).filter(n => n !== '');
    const newParticipants: Participant[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    onUpdate([...participants, ...newParticipants]);
    setInputText('');
  };

  const handleLoadDemo = () => {
    const demoNames = [
      '王大明', '李小華', '張美玲', '陳冠廷', 'Emma Wang', 
      '林志明', '黃雅婷', 'Jason Chen', '劉淑芬', '郭大為',
      '張美玲', '周杰倫', '蔡依林', '林俊傑', '王力宏',
      '李小華', 'Sophia Lin', 'David Ho', 'Sarah Wu', 'Kevin Zhang'
    ];
    const newParticipants: Participant[] = demoNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate(newParticipants);
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set();
    const uniqueList = participants.filter(p => {
      const isDuplicate = seen.has(p.name);
      seen.add(p.name);
      return !isDuplicate;
    });
    onUpdate(uniqueList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split(/[,\n\r]/).map(n => n.trim()).filter(n => n !== '');
      const newParticipants: Participant[] = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      onUpdate([...participants, ...newParticipants]);
    };
    reader.readAsText(file);
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('確定要清除所有名單嗎？')) {
      onUpdate([]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">名單管理</h2>
          <p className="text-gray-500">請貼上姓名清單、上傳 CSV 或使用模擬數據體驗。</p>
        </div>
        <button 
          onClick={handleLoadDemo}
          className="flex items-center gap-2 text-sm bg-purple-50 text-purple-600 px-4 py-2 rounded-lg font-bold hover:bg-purple-100 transition-colors border border-purple-200"
        >
          <Sparkles className="w-4 h-4" />
          載入範例名單
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              輸入來源
            </h3>
            <div className="relative">
              <input 
                type="file" 
                accept=".csv,.txt" 
                onChange={handleFileUpload} 
                className="hidden" 
                id="csv-upload" 
              />
              <label 
                htmlFor="csv-upload"
                className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-indigo-100 transition-colors"
              >
                <Upload className="w-4 h-4" />
                上傳 CSV
              </label>
            </div>
          </div>
          
          <textarea
            className="flex-grow min-h-[300px] w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-gray-700 font-mono text-sm"
            placeholder="例如：&#10;王小明&#10;李小華&#10;陳大文..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            onClick={handleProcessInput}
            disabled={!inputText.trim()}
            className="mt-4 w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            加入名單
          </button>
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              當前名單 ({participants.length})
            </h3>
            <div className="flex gap-4">
              {duplicateNames.length > 0 && (
                <button 
                  onClick={handleRemoveDuplicates}
                  className="text-orange-600 hover:text-orange-700 text-sm font-bold flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  移除重複 ({duplicateNames.length})
                </button>
              )}
              {participants.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  清空
                </button>
              )}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto max-h-[400px] border border-gray-50 rounded-xl bg-gray-50 p-4">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <Users className="w-12 h-12 opacity-20" />
                <p>尚無名單數據</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {participants.map((p) => {
                  const isDup = duplicateNames.includes(p.name);
                  return (
                    <div key={p.id} className={`group relative flex items-center justify-between px-3 py-2 rounded-lg border transition-all shadow-sm ${
                      isDup ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100 hover:border-indigo-300'
                    }`}>
                      <span className={`truncate text-sm font-medium ${isDup ? 'text-orange-700' : 'text-gray-700'}`}>
                        {p.name}
                        {isDup && <span className="ml-1 text-[10px] bg-orange-200 px-1 rounded text-orange-800">重複</span>}
                      </span>
                      <button 
                        onClick={() => removeParticipant(p.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={participants.length === 0}
            className="mt-4 w-full bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50"
          >
            去抽獎
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantManager;
