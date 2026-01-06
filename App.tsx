
import React, { useState, useEffect } from 'react';
import { Participant, AppTab } from './types';
import ParticipantManager from './components/ParticipantManager';
import LuckyDraw from './components/LuckyDraw';
import GroupGenerator from './components/GroupGenerator';
import { Users, Gift, ListChecks, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.PARTICIPANTS);

  // Persistence (optional but helpful)
  useEffect(() => {
    const saved = localStorage.getItem('hr-toolkit-names');
    if (saved) {
      try {
        setParticipants(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved names");
      }
    }
  }, []);

  const handleUpdateParticipants = (newList: Participant[]) => {
    setParticipants(newList);
    localStorage.setItem('hr-toolkit-names', JSON.stringify(newList));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-indigo-900 text-white flex flex-col p-6 space-y-8 sticky top-0 h-auto md:h-screen z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">HR Toolkit</h1>
        </div>

        <div className="flex flex-col space-y-2 flex-grow">
          <button
            onClick={() => setActiveTab(AppTab.PARTICIPANTS)}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
              activeTab === AppTab.PARTICIPANTS ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'hover:bg-indigo-800/50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">名單管理</span>
          </button>
          
          <button
            disabled={participants.length === 0}
            onClick={() => setActiveTab(AppTab.LUCKY_DRAW)}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
              participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              activeTab === AppTab.LUCKY_DRAW ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'hover:bg-indigo-800/50'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span className="font-medium">獎品抽籤</span>
          </button>

          <button
            disabled={participants.length === 0}
            onClick={() => setActiveTab(AppTab.GROUPING)}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
              participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              activeTab === AppTab.GROUPING ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'hover:bg-indigo-800/50'
            }`}
          >
            <ListChecks className="w-5 h-5" />
            <span className="font-medium">自動分組</span>
          </button>
        </div>

        <div className="text-xs text-indigo-300 font-medium">
          已匯入 {participants.length} 位成員
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === AppTab.PARTICIPANTS && (
            <ParticipantManager 
              participants={participants} 
              onUpdate={handleUpdateParticipants} 
              onNext={() => setActiveTab(AppTab.LUCKY_DRAW)}
            />
          )}
          
          {activeTab === AppTab.LUCKY_DRAW && (
            <LuckyDraw participants={participants} />
          )}

          {activeTab === AppTab.GROUPING && (
            <GroupGenerator participants={participants} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
