
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { QUESTOES_POR_SIMULADO, TODAS_QUESTOES } from './constants';
import { QuizState, SimuladoProgress, Question } from './types';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import StartScreen from './components/StartScreen';
import ReviewScreen from './components/ReviewScreen';

const STORAGE_KEY = 'cpa20_pro_v4_final';

const createEmptyProgress = (simuladoId: number): SimuladoProgress => {
  return {
    currentIndex: 0,
    score: 0,
    userAnswers: [],
    isAnswered: false,
    selectedOption: null,
    hasStarted: false,
    showResult: false,
    isReviewMode: false,
    timeLeft: null,
    totalTime: null,
    sessionQuestions: undefined
  };
};

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar progresso:", e);
      }
    }
    
    const initialProgressions: { [key: number]: SimuladoProgress } = {};
    for (let i = 1; i <= 7; i++) initialProgressions[i] = createEmptyProgress(i);
    initialProgressions[99] = createEmptyProgress(99); // 99 for random mode
    
    return {
      selectedSimulado: 1,
      progressions: initialProgressions,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeProgress = useMemo(() => 
    state.progressions[state.selectedSimulado], 
    [state.progressions, state.selectedSimulado]
  );

  const activeQuestions = useMemo(() => {
    if (activeProgress.sessionQuestions) return activeProgress.sessionQuestions;
    return QUESTOES_POR_SIMULADO[state.selectedSimulado] || [];
  }, [state.selectedSimulado, activeProgress.sessionQuestions]);

  const updateActiveProgress = useCallback((updates: Partial<SimuladoProgress>) => {
    setState(prev => ({
      ...prev,
      progressions: {
        ...prev.progressions,
        [prev.selectedSimulado]: {
          ...prev.progressions[prev.selectedSimulado],
          ...updates,
        }
      }
    }));
  }, [state.selectedSimulado]);

  useEffect(() => {
    let interval: number | null = null;
    if (activeProgress.hasStarted && !activeProgress.showResult && !activeProgress.isReviewMode && activeProgress.timeLeft !== null) {
      interval = window.setInterval(() => {
        if (activeProgress.timeLeft !== null && activeProgress.timeLeft > 0) {
          updateActiveProgress({ timeLeft: activeProgress.timeLeft - 1 });
        } else if (activeProgress.timeLeft === 0) {
          updateActiveProgress({ showResult: true });
          if (interval) clearInterval(interval);
        }
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [activeProgress.hasStarted, activeProgress.showResult, activeProgress.isReviewMode, activeProgress.timeLeft, updateActiveProgress]);

  const handleStart = useCallback((duration: number | null, count: number, isRandom: boolean) => {
    const targetSimId = isRandom ? 99 : state.selectedSimulado;
    const currentProg = state.progressions[targetSimId];
    
    if (currentProg.hasStarted && currentProg.currentIndex > 0 && !currentProg.showResult) {
       setState(prev => ({ ...prev, selectedSimulado: targetSimId }));
       updateActiveProgress({ hasStarted: true });
       return;
    }

    let sessionQs: Question[] = [];
    if (isRandom) {
      sessionQs = [...TODAS_QUESTOES].sort(() => Math.random() - 0.5).slice(0, count);
    } else {
      sessionQs = (QUESTOES_POR_SIMULADO[state.selectedSimulado] || []).slice(0, count);
    }

    setState(prev => ({
      ...prev,
      selectedSimulado: targetSimId,
      progressions: {
        ...prev.progressions,
        [targetSimId]: {
          ...createEmptyProgress(targetSimId),
          hasStarted: true,
          totalTime: duration,
          timeLeft: duration,
          sessionQuestions: sessionQs,
          userAnswers: new Array(sessionQs.length).fill(null)
        }
      }
    }));
  }, [state.selectedSimulado, state.progressions, updateActiveProgress]);

  const handleSelectSimulado = useCallback((id: number) => {
    setState(prev => ({ ...prev, selectedSimulado: id }));
  }, []);

  const handleSelectOption = useCallback((index: number) => {
    if (activeProgress.isAnswered) return;
    const newUserAnswers = [...activeProgress.userAnswers];
    newUserAnswers[activeProgress.currentIndex] = index;
    const isCorrect = index === activeQuestions[activeProgress.currentIndex].c;
    updateActiveProgress({
      selectedOption: index,
      isAnswered: true,
      userAnswers: newUserAnswers,
      score: isCorrect ? activeProgress.score + 1 : activeProgress.score
    });
  }, [activeProgress, activeQuestions, updateActiveProgress]);

  const handleNext = useCallback(() => {
    if (activeProgress.currentIndex + 1 >= activeQuestions.length) {
      updateActiveProgress({ showResult: true });
    } else {
      updateActiveProgress({
        currentIndex: activeProgress.currentIndex + 1,
        isAnswered: false,
        selectedOption: null,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeProgress.currentIndex, activeQuestions.length, updateActiveProgress]);

  const handleRestart = useCallback(() => {
    updateActiveProgress(createEmptyProgress(state.selectedSimulado));
  }, [updateActiveProgress, state.selectedSimulado]);

  const handleReview = useCallback(() => {
    updateActiveProgress({ isReviewMode: true, showResult: false });
  }, [updateActiveProgress]);

  const handleExit = useCallback(() => {
    updateActiveProgress({ hasStarted: false });
  }, [updateActiveProgress]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "Livre";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeProgress.hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <StartScreen 
          onStart={handleStart} 
          selectedSimulado={state.selectedSimulado}
          onSelectSimulado={handleSelectSimulado}
          progressions={state.progressions}
        />
      </div>
    );
  }

  if (activeProgress.isReviewMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewScreen 
          questions={activeQuestions} 
          userAnswers={activeProgress.userAnswers} 
          onClose={handleRestart}
        />
      </div>
    );
  }

  if (activeProgress.showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <ResultScreen 
          score={activeProgress.score} 
          total={activeQuestions.length} 
          onRestart={handleRestart} 
          onReview={handleReview}
        />
      </div>
    );
  }

  const currentQuestion = activeQuestions[activeProgress.currentIndex];
  const isTimeLow = activeProgress.timeLeft !== null && activeProgress.timeLeft < 300;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Compacto e Fixo com Progresso em Destaque */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm px-4 py-3">
        <div className="max-w-3xl mx-auto grid grid-cols-3 items-center">
          {/* Sair */}
          <button 
            onClick={handleExit}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-xs font-bold hidden sm:block uppercase tracking-wider">Sair</span>
          </button>
          
          {/* Progresso Prominente */}
          <div className="flex flex-col items-center">
            <div className="bg-indigo-50 px-4 py-1.5 rounded-full ring-1 ring-indigo-100/50 flex items-center gap-2">
               <span className="text-lg font-black text-indigo-600 leading-none">
                 {activeProgress.currentIndex + 1}
               </span>
               <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">DE</span>
               <span className="text-lg font-black text-indigo-400 leading-none">
                 {activeQuestions.length}
               </span>
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 hidden sm:block">
              Questões
            </span>
          </div>

          {/* Timer */}
          <div className="flex justify-end">
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${isTimeLow ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-black font-mono leading-none">{formatTime(activeProgress.timeLeft)}</span>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-3">
          <ProgressBar current={activeProgress.currentIndex + 1} total={activeQuestions.length} />
        </div>
      </header>

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 pt-6 pb-32">
        <QuestionCard 
          question={currentQuestion}
          isAnswered={activeProgress.isAnswered}
          selectedOption={activeProgress.selectedOption}
          onSelect={handleSelectOption}
        />
      </main>

      {/* Footer com Botão Próxima */}
      {activeProgress.isAnswered && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-2xl border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-500 z-40">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleNext}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-4 group active:scale-95"
            >
              <span>{activeProgress.currentIndex + 1 === activeQuestions.length ? 'Finalizar Simulado' : 'Próxima Questão'}</span>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
