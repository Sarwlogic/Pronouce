
import React, { useState } from 'react';
import { AppState } from '../types';
import type { UserSettings, Attempt } from '../types';
import RobotIcon from './icons/RobotIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import LoadingSpinner from './LoadingSpinner';

interface InteractionScreenProps {
  appState: AppState;
  settings: UserSettings;
  isListening: boolean;
  isLoading: boolean;
  aiFeedback: string;
  error: string;
  attemptHistory: Attempt[];
  onRecord: () => void;
  onNewWord: (word: string) => void;
}

const InteractionScreen: React.FC<InteractionScreenProps> = ({
  appState,
  settings,
  isListening,
  isLoading,
  aiFeedback,
  error,
  attemptHistory,
  onRecord,
  onNewWord,
}) => {
  const [newWordInput, setNewWordInput] = useState('');

  const handleNewWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWordInput.trim()) {
      onNewWord(newWordInput.trim());
      setNewWordInput('');
    }
  };
  
  const getMicButtonColor = () => {
    if (isListening) return 'bg-red-500 hover:bg-red-600 ring-red-300';
    if (isLoading) return 'bg-gray-400 cursor-not-allowed ring-gray-200';
    return 'bg-green-500 hover:bg-green-600 ring-green-300';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 shadow-inner">
        <p className="text-lg text-slate-600">Let's practice saying:</p>
        <p className="text-4xl font-black text-blue-600 break-words">{settings.targetWord}</p>
      </div>

      <div className="flex items-center justify-center gap-4 min-h-[80px]">
        <RobotIcon className="w-16 h-16 text-blue-400 flex-shrink-0" />
        <div className="bg-white text-left p-4 rounded-xl shadow-md flex-grow">
          {isLoading ? (
             <p className="text-slate-500 italic">Coach is thinking...</p>
          ) : error ? (
            <p className="text-red-600 font-bold">{error}</p>
          ) : (
            <p className="text-slate-700 font-semibold">{aiFeedback}</p>
          )}
        </div>
      </div>

      <button
        onClick={onRecord}
        disabled={isLoading}
        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-8 ${getMicButtonColor()}`}
      >
        {isLoading ? <LoadingSpinner /> : <MicrophoneIcon className="w-10 h-10" />}
      </button>
      
      <div className="pt-4 space-y-3">
        <h3 className="text-lg font-bold text-slate-600">
          Your Tries ({attemptHistory.length})
        </h3>
        <div className="max-h-32 overflow-y-auto space-y-2 pr-2 bg-slate-100/70 p-3 rounded-lg shadow-inner">
          {attemptHistory.length > 0 ? (
            attemptHistory.slice().reverse().map((attempt) => (
              <div key={attempt.attemptNumber} className="bg-white p-2 rounded-lg text-left shadow-sm animate-fade-in">
                <p className="text-xs text-gray-500 font-bold">ATTEMPT #{attempt.attemptNumber}</p>
                <p className="text-md font-semibold text-gray-800">"{attempt.transcript}"</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic text-center py-4">No attempts yet. Press the green button to try!</p>
          )}
        </div>
      </div>


      <form onSubmit={handleNewWordSubmit} className="flex gap-2 pt-4 border-t-2 border-slate-200">
        <input 
          type="text"
          value={newWordInput}
          onChange={(e) => setNewWordInput(e.target.value)}
          placeholder="Enter a new word or sentence"
          className="flex-grow px-4 py-2 bg-white/80 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors">
          Change
        </button>
      </form>
    </div>
  );
};

export default InteractionScreen;
