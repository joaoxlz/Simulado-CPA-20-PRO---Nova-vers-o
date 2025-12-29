
import React from 'react';
import { Question } from '../types';

interface ReviewScreenProps {
  questions: Question[];
  userAnswers: (number | null)[];
  onClose: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ questions, userAnswers, onClose }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 sticky top-4 z-20 bg-gray-50/90 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900">Revisão do Simulado</h2>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all"
        >
          Voltar ao Início
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const isCorrect = userAnswers[qIdx] === q.c;
          
          return (
            <div key={qIdx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`px-6 py-3 flex items-center gap-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {qIdx + 1}
                </span>
                <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Você acertou' : 'Você errou'}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">{q.p}</h3>
                
                <div className="space-y-3 mb-6">
                  {q.o.map((opt, oIdx) => {
                    let style = "border-gray-200 bg-white text-gray-700";
                    let marker = "border-gray-300 text-gray-400";

                    if (oIdx === q.c) {
                      style = "border-green-500 bg-green-50 text-green-700 font-semibold";
                      marker = "bg-green-500 text-white border-green-500";
                    } else if (oIdx === userAnswers[qIdx]) {
                      style = "border-red-500 bg-red-50 text-red-700 font-semibold";
                      marker = "bg-red-500 text-white border-red-500";
                    }

                    return (
                      <div key={oIdx} className={`p-4 rounded-xl border-2 flex gap-4 items-start ${style}`}>
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${marker}`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                        {oIdx === q.c && (
                          <span className="ml-auto text-green-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.e && (
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Comentário do Professor</div>
                    <p className="text-indigo-900 text-sm leading-relaxed">{q.e}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 mb-8 flex justify-center">
        <button 
          onClick={onClose}
          className="w-full max-w-xs py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all transform active:scale-95"
        >
          Finalizar Revisão
        </button>
      </div>
    </div>
  );
};

export default ReviewScreen;
