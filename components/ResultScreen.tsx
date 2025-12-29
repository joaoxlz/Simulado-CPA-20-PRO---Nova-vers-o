
import React from 'react';

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
  onReview: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, total, onRestart, onReview }) => {
  const percentage = (score / total) * 100;
  const isApproved = percentage >= 70;

  return (
    <div className="max-w-md mx-auto text-center py-12 px-4 bg-white rounded-3xl shadow-xl animate-in zoom-in duration-300">
      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
        isApproved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {isApproved ? (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        {isApproved ? 'Parabéns! Aprovado' : 'Não foi desta vez. Reprovado'}
      </h1>
      
      <p className="text-gray-500 mb-8">
        Você acertou <span className="font-bold text-gray-800">{score}</span> de <span className="font-bold text-gray-800">{total}</span> questões ({percentage.toFixed(0)}%).
      </p>

      <div className="bg-gray-50 p-6 rounded-2xl mb-8">
        <div className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Seu Desempenho</div>
        <div className="text-4xl font-black text-indigo-600">{percentage.toFixed(0)}%</div>
        <div className="w-full bg-gray-200 h-3 rounded-full mt-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isApproved ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onReview}
          className="w-full py-4 px-6 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl transition-all"
        >
          Revisar Questões
        </button>
        <button
          onClick={onRestart}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
