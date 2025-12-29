import React, { useState } from 'react';
import { SimuladoProgress } from '../types';
import { QUESTOES_POR_SIMULADO, TODAS_QUESTOES } from '../constants';

interface StartScreenProps {
  onStart: (duration: number | null, count: number, isRandom: boolean) => void;
  selectedSimulado: number;
  onSelectSimulado: (id: number) => void;
  progressions: { [key: number]: SimuladoProgress };
}

const StartScreen: React.FC<StartScreenProps> = ({ 
  onStart, 
  selectedSimulado, 
  onSelectSimulado,
  progressions 
}) => {
  const simulados = [1, 2, 3, 4, 5, 6, 7];
  const [activeTab, setActiveTab] = useState<'modules' | 'random'>('modules');
  const [tempDuration, setTempDuration] = useState<number | null>(3600);
  const [questionCount, setQuestionCount] = useState<number>(60);

  const timeOptions = [
    { label: 'Sem Limite', value: null },
    { label: '30 min', value: 1800 },
    { label: '60 min', value: 3600 },
    { label: '1:30 h', value: 5400 },
  ];

  const currentProg = progressions[selectedSimulado];
  const randomProg = progressions[99] || { currentIndex: 0, showResult: false, userAnswers: [] };
  
  const hasModuleProgress = currentProg.currentIndex > 0 && !currentProg.showResult;
  const hasRandomProgress = randomProg.currentIndex > 0 && !randomProg.showResult;

  const handleStartClick = () => {
    const isRandom = activeTab === 'random';
    const targetSimId = isRandom ? 99 : selectedSimulado;
    const prog = progressions[targetSimId] || { currentIndex: 0, showResult: false, totalTime: null };
    const hasCurrentProgress = prog.currentIndex > 0 && !prog.showResult;
    
    onStart(hasCurrentProgress ? prog.totalTime : tempDuration, questionCount, isRandom);
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-8 flex flex-col items-center animate-in fade-in zoom-in duration-700">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4 ring-1 ring-indigo-100">
          <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Simulado CPA-20</h1>
        <p className="text-slate-500">Preparação completa com Simulados Oficiais I a VII.</p>
      </div>

      {/* Tabs for Mode Selection */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 w-full max-w-sm">
        <button 
          onClick={() => setActiveTab('modules')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'modules' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Módulos Fixos
        </button>
        <button 
          onClick={() => setActiveTab('random')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'random' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Modo Aleatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
        {/* Left Column: Settings */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Configurações</h4>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Tempo de Prova</label>
              <div className="grid grid-cols-2 gap-2">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setTempDuration(opt.value)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border-2 ${tempDuration === opt.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-slate-700">Qtd. Questões</label>
                <span className="text-indigo-600 font-black text-sm">{questionCount}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max={activeTab === 'random' ? TODAS_QUESTOES.length : (QUESTOES_POR_SIMULADO[selectedSimulado]?.length || 60)} 
                value={questionCount} 
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                <span>1</span>
                <span>{Math.floor((activeTab === 'random' ? TODAS_QUESTOES.length : (QUESTOES_POR_SIMULADO[selectedSimulado]?.length || 60)) / 2)}</span>
                <span>{activeTab === 'random' ? TODAS_QUESTOES.length : (QUESTOES_POR_SIMULADO[selectedSimulado]?.length || 60)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selections */}
        <div className="md:col-span-2">
          {activeTab === 'modules' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {simulados.map((num) => {
                const isActive = selectedSimulado === num;
                const prog = progressions[num];
                const questions = QUESTOES_POR_SIMULADO[num] || [];
                const answeredCount = prog.userAnswers ? prog.userAnswers.filter(a => a !== null).length : 0;
                const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
                
                return (
                  <button
                    key={num}
                    onClick={() => onSelectSimulado(num)}
                    className={`p-5 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${isActive ? 'bg-white border-indigo-600 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="relative z-10">
                      <span className={`text-[10px] font-black uppercase mb-1 block ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>Módulo</span>
                      <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight">
                        {num === 1 ? 'Simulado I' : num === 2 ? 'Simulado II' : num === 3 ? 'Simulado III' : num === 4 ? 'Simulado IV' : num === 5 ? 'Simulado V' : num === 6 ? 'Simulado VI' : num === 7 ? 'Simulado VII' : `Módulo 0${num}`}
                      </h3>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-bold text-slate-400">{questions.length} Questões</span>
                        {progressPercent > 0 && <span className="text-[10px] font-black text-indigo-600">{progressPercent}%</span>}
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col justify-center items-center text-center p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white mb-4">Mistura Completa</h3>
                <p className="text-indigo-100 mb-8 max-w-xs mx-auto">
                  Questões sorteadas de todos os {TODAS_QUESTOES.length} itens disponíveis. O desafio definitivo para sua certificação.
                </p>
                {hasRandomProgress && (
                   <div className="px-4 py-2 bg-white/20 rounded-full text-white text-[10px] font-bold inline-flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Você tem um teste em andamento
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleStartClick}
        className="w-full max-w-sm py-5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-4 group"
      >
        <span>
          {(activeTab === 'random' ? hasRandomProgress : hasModuleProgress) ? 'Continuar Simulado' : 'Iniciar Agora'}
        </span>
        <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );
};

export default StartScreen;
