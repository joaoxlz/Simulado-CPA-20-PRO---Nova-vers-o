
import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  isAnswered: boolean;
  selectedOption: number | null;
  onSelect: (index: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  isAnswered, 
  selectedOption, 
  onSelect 
}) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Enunciado da Questão */}
      <div className="bg-white p-5 md:p-7 rounded-[2rem] shadow-sm border border-slate-100 ring-1 ring-slate-200/50">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed text-pretty">
          {question.p}
        </h2>
      </div>
      
      {/* Alternativas */}
      <div className="grid grid-cols-1 gap-2.5">
        {question.o.map((option, idx) => {
          let stateStyles = "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/30";
          let circleStyles = "border-slate-200 text-slate-400";
          
          if (isAnswered) {
            if (idx === question.c) {
              stateStyles = "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-100";
              circleStyles = "bg-white text-emerald-600 border-white";
            } else if (idx === selectedOption) {
              stateStyles = "bg-red-500 border-red-600 text-white shadow-lg shadow-red-100";
              circleStyles = "bg-white text-red-600 border-white";
            } else {
              stateStyles = "bg-slate-50 border-slate-100 text-slate-300 opacity-60";
              circleStyles = "border-slate-200 text-slate-300";
            }
          } else if (selectedOption === idx) {
            stateStyles = "bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600";
            circleStyles = "bg-indigo-600 text-white border-indigo-600";
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => onSelect(idx)}
              className={`w-full p-4 md:p-4.5 text-left rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 active:scale-[0.98] ${stateStyles} group`}
            >
              <span className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center font-black text-sm transition-colors ${circleStyles}`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm md:text-base font-bold leading-tight pt-1.5">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explicação (Opcional) */}
      {isAnswered && question.e && (
        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 animate-in zoom-in-95 duration-500">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Explicação do Professor</span>
           </div>
           <p className="text-indigo-900/80 text-sm md:text-base leading-relaxed italic">
             {question.e}
           </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
