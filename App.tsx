
import React, { useState, useEffect, useCallback } from 'react';
import { AppState } from './types';
import type { UserSettings, Attempt } from './types';
import { useSpeech } from './hooks/useSpeech';
import { analyzePronunciation } from './services/geminiService';
import SetupPanel from './components/SetupPanel';
import InteractionScreen from './components/InteractionScreen';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [attemptHistory, setAttemptHistory] = useState<Attempt[]>([]);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    speak,
    isSupported: isSpeechSupported,
    resetTranscript
  } = useSpeech();

  const handleSetupComplete = (newSettings: UserSettings) => {
    setSettings(newSettings);
    setAttemptHistory([]);
    setAppState(AppState.READY_TO_LISTEN);
    const welcomeMessage = `Hello ${newSettings.childName}! Let's try to say: ${newSettings.targetWord}`;
    setAiFeedback(welcomeMessage);
    speak(welcomeMessage);
  };
  
  const handleStartRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setAiFeedback('');
      setError('');
      setAppState(AppState.LISTENING);
      startListening();
    }
  };
  
  const handleNewWord = (newWord: string) => {
    if (!settings) return;
    const newSettings = { ...settings, targetWord: newWord };
    setSettings(newSettings);
    setAttemptHistory([]);
    setAppState(AppState.READY_TO_LISTEN);
    const newWordMessage = `Great! Let's try saying: ${newWord}. Are you ready?`;
    setAiFeedback(newWordMessage);
    speak(newWordMessage);
  };

  const getAIAnalysis = useCallback(async (childsAttempt: string) => {
    if (!settings) return;

    setAppState(AppState.ANALYZING);
    setIsLoading(true);
    setError('');
    setAttemptHistory(prev => [...prev, { attemptNumber: prev.length + 1, transcript: childsAttempt }]);

    try {
      const feedback = await analyzePronunciation(settings.targetWord, childsAttempt, settings.childName);
      setAiFeedback(feedback);
      speak(feedback);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error("Error getting AI analysis:", errorMessage);
      setError("Oops! I had a little trouble thinking. Please try again.");
    } finally {
      setIsLoading(false);
      setAppState(AppState.FEEDBACK);
    }
  }, [settings, speak]);
  
  useEffect(() => {
    if (transcript && !isListening && appState === AppState.LISTENING) {
       getAIAnalysis(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening, getAIAnalysis]);


  return (
    <div className="bg-gradient-to-br from-blue-200 to-cyan-200 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 text-center text-slate-800">
        <h1 className="text-4xl md:text-5xl font-black text-blue-600 mb-2">Pronounce Pal</h1>
        <p className="text-slate-600 mb-8">Your friendly AI speech coach for kids!</p>

        {!isSpeechSupported && (
           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
            <p className="font-bold">Browser Not Supported</p>
            <p>Your browser does not support the Web Speech API. Please try Chrome or Edge.</p>
          </div>
        )}

        {appState === AppState.SETUP ? (
          <SetupPanel onSetupComplete={handleSetupComplete} />
        ) : settings && isSpeechSupported ? (
          <InteractionScreen
            appState={appState}
            settings={settings}
            isListening={isListening}
            isLoading={isLoading}
            aiFeedback={aiFeedback}
            error={error}
            attemptHistory={attemptHistory}
            onRecord={handleStartRecording}
            onNewWord={handleNewWord}
          />
        ) : null}
      </div>
    </div>
  );
};

export default App;
