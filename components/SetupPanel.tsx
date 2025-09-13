
import React, { useState } from 'react';
import type { UserSettings } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface SetupPanelProps {
  onSetupComplete: (settings: UserSettings) => void;
}

const SetupPanel: React.FC<SetupPanelProps> = ({ onSetupComplete }) => {
  const [childName, setChildName] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (childName.trim() && targetWord.trim()) {
      onSetupComplete({ childName, targetWord });
    } else {
      setError('Please fill out both fields.');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-700 mb-6">Let's Get Started!</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="childName" className="block text-left text-sm font-bold text-slate-600 mb-2">
            Child's First Name
          </label>
          <input
            id="childName"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="e.g., John"
            className="w-full px-4 py-3 bg-white/80 rounded-xl border-2 border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label htmlFor="targetWord" className="block text-left text-sm font-bold text-slate-600 mb-2">
            Word or Sentence to Practice
          </label>
          <input
            id="targetWord"
            type="text"
            value={targetWord}
            onChange={(e) => setTargetWord(e.target.value)}
            placeholder="e.g., Suddenly the lion roared"
            className="w-full px-4 py-3 bg-white/80 rounded-xl border-2 border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <SparklesIcon />
          Start Practice
        </button>
      </form>
    </div>
  );
};

export default SetupPanel;
