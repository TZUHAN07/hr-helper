
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { Gift, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

interface Props {
  participants: Participant[];
}

const LuckyDraw: React.FC<Props> = ({ participants }) => {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [remainingPool, setRemainingPool] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rollingName, setRollingName] = useState<string>('');
  const [winnersHistory, setWinnersHistory] = useState<Participant[]>([]);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingPool([...participants]);
  }, [participants]);

  const startDraw = () => {
    if (remainingPool.length === 0) {
      alert('所有參與者都已中獎！');
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    
    let iterations = 0;
    const maxIterations = 30; // Number of cycles before landing
    
    const tick = () => {
      iterations++;
      
      // Select a random name for the visual effect
      const randomIndex = Math.floor(Math.random() * participants.length);
      setRollingName(participants[randomIndex].name);
      
      if (iterations < maxIterations) {
        // Slow down effect: increase timeout as iterations approach max
        const timeout = 50 + (iterations * 5);
        timerRef.current = window.setTimeout(tick, timeout);
      } else {
        finalizeWinner();
      }
    };
    
    tick();
  };

  const finalizeWinner = () => {
    const pool = allowRepeat ? participants : remainingPool;
    if (pool.length === 0) return;

    const winnerIndex = Math.floor(Math.random() * pool.length);
    const chosenOne = pool[winnerIndex];

    setWinner(chosenOne);
    setWinnersHistory(prev => [chosenOne, ...prev]);
    
    if (!allowRepeat) {
      setRemainingPool(prev => prev.filter(p => p.id !== chosenOne.id));
    }

    setIsSpinning(false);
    setRollingName('');
  };

  const resetPool = () => {
    setRemainingPool([...participants]);
    setWinnersHistory([]);
    setWinner(null);
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">獎品抽籤</h2>
        <p className="text-gray-500">點擊按鈕，讓幸運女神降臨！</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Draw Area */}
        <div className="lg:col-span-2 flex flex-col items-center space-y-8">
          
          <div className="w-full bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center border border-indigo-50 relative overflow-hidden min-h-[400px]">
             {/* Decorative Background */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
             
             {isSpinning ? (
               <div className="flex flex-col items-center">
                 <div className="text-5xl md:text-7xl font-black text-indigo-600 animate-pulse tracking-tighter">
                   {rollingName}
                 </div>
                 <div className="mt-8 flex items-center gap-2 text-gray-400 font-medium italic">
                   <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                   正在抽取...
                 </div>
               </div>
             ) : winner ? (
               <div className="flex flex-col items-center text-center animate-in scale-in-0 duration-700">
                 <div className="bg-yellow-100 p-4 rounded-full mb-6">
                    <Award className="w-16 h-16 text-yellow-600" />
                 </div>
                 <h3 className="text-lg font-medium text-gray-500 uppercase tracking-widest mb-2">恭喜中獎</h3>
                 <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-700 leading-tight">
                   {winner.name}
                 </div>
               </div>
             ) : (
               <div className="text-center">
                 <div className="bg-indigo-50 p-6 rounded-full mb-6 inline-block">
                   <Gift className="w-16 h-16 text-indigo-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-400">準備好了嗎？</h3>
               </div>
             )}
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-4">
            <button
              onClick={startDraw}
              disabled={isSpinning || remainingPool.length === 0}
              className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-6 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {isSpinning ? '抽取中...' : '開始抽獎'}
            </button>
            <button
              onClick={resetPool}
              className="bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 px-8 rounded-2xl transition-all"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-sm font-semibold text-gray-700">重複抽取：</span>
            <button 
              onClick={() => setAllowRepeat(!allowRepeat)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${allowRepeat ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowRepeat ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-gray-500">
              {allowRepeat ? '同一人可多次中獎' : '每人限中一次'}
            </span>
          </div>
        </div>

        {/* Sidebar Results */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col max-h-[600px]">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            中獎名單 ({winnersHistory.length})
          </h3>
          <div className="flex-grow overflow-y-auto space-y-2 pr-2">
            {winnersHistory.length === 0 ? (
              <p className="text-center text-gray-400 py-8 italic text-sm">尚未產生中獎者</p>
            ) : (
              winnersHistory.map((w, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded">
                      #{winnersHistory.length - i}
                    </span>
                    <span className="font-semibold text-gray-700">{w.name}</span>
                  </div>
                  <Award className="w-4 h-4 text-yellow-500" />
                </div>
              ))
            )}
          </div>
          {!allowRepeat && (
             <div className="mt-4 pt-4 border-t border-gray-100">
               <div className="text-xs font-medium text-gray-400 mb-1">池內剩餘</div>
               <div className="text-lg font-bold text-indigo-600">{remainingPool.length} <span className="text-xs text-gray-400">人</span></div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
