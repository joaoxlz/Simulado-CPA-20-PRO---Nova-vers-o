
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = ((current) / total) * 100;

  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div 
        className="bg-indigo-600 h-1.5 transition-all duration-700 ease-in-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
