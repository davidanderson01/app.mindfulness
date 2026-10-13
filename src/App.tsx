/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailySanctuary } from './components/DailySanctuary';
import { DailyAffirmations } from './components/DailyAffirmations';
import { BreathingVisualizer } from './components/BreathingVisualizer';
import { SoundBathMixer } from './components/SoundBathMixer';
import { SongStudio } from './components/SongStudio';
import { LotusIcon } from './components/LotusIcon';
import { ElevateLogo } from './components/ElevateLogo';
import { TraditionsLibrary } from './components/TraditionsLibrary';
import { MindfulMovement } from './components/MindfulMovement';
import { SpiritualPlacesMap } from './components/SpiritualPlacesMap';
import { ProgressTracker } from './components/ProgressTracker';
import { MeditationPlayer } from './components/MeditationPlayer';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import { OfflineDrawer } from './components/OfflineDrawer';
import { MeditationSession } from './types';
import { storage } from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('sanctuary');
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [isOfflineDrawerOpen, setIsOfflineDrawerOpen] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(storage.isOfflineMode());
  const [stats, setStats] = useState(storage.getStats());

  // Dark mode toggle (defaulting to dark mode for deep serene evening/zen meditation ambiance)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('satori_theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('satori_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('satori_theme', 'light');
    }
  }, [darkMode]);

  const handleStartSession = (session: MeditationSession) => {
    setActiveSession(session);
  };

  const handleSessionComplete = (minutes: number) => {
    setStats(storage.getStats());
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 transition-colors flex flex-col font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900/40">
      
      {/* Top Bar Navigation (3-Zone strict anti-slop contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCheckin={() => setIsCheckinOpen(true)}
        onOpenOffline={() => setIsOfflineDrawerOpen(true)}
        isOfflineMode={isOfflineMode}
        downloadedCount={stats.downloadedSessionIds.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Sanctuary Stage */}
      <main className="flex-1 pb-16">
        {activeTab === 'sanctuary' && (
          <DailySanctuary
            onStartSession={handleStartSession}
            onOpenCheckin={() => setIsCheckinOpen(true)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'affirmations' && (
          <DailyAffirmations />
        )}

        {activeTab === 'breathing' && (
          <BreathingVisualizer
            onComplete={() => setStats(storage.getStats())}
          />
        )}

        {activeTab === 'sound-bath' && (
          <SoundBathMixer />
        )}

        {activeTab === 'song-studio' && (
          <SongStudio />
        )}

        {activeTab === 'traditions' && (
          <TraditionsLibrary
            onStartSession={handleStartSession}
          />
        )}

        {activeTab === 'movement' && (
          <MindfulMovement />
        )}

        {activeTab === 'places' && (
          <SpiritualPlacesMap />
        )}

        {activeTab === 'progress' && (
          <ProgressTracker />
        )}
      </main>

      {/* Fullscreen Interactive Meditation Player */}
      {activeSession && (
        <MeditationPlayer
          session={activeSession}
          onClose={() => setActiveSession(null)}
          onSessionComplete={handleSessionComplete}
        />
      )}

      {/* Daily Personalization Check-in Modal */}
      <DailyCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        onStartSession={handleStartSession}
      />

      {/* Offline Downloads & Storage Drawer */}
      <OfflineDrawer
        isOpen={isOfflineDrawerOpen}
        onClose={() => setIsOfflineDrawerOpen(false)}
        onStartSession={handleStartSession}
        isOfflineMode={isOfflineMode}
        setIsOfflineMode={setIsOfflineMode}
      />

      {/* Quiet Minimalist Zen Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-850/80 py-8 px-4 sm:px-6 text-xs text-stone-500 dark:text-stone-500 bg-stone-100/50 dark:bg-stone-900/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ElevateLogo className="w-6 h-6 shrink-0" />
            <span className="font-sans font-semibold text-stone-800 dark:text-stone-200 text-sm tracking-tight">
              Elevate- Mindfulness
            </span>
            <span>·</span>
            <span>Mindfulness, Sound Baths & Sacred Sanctuaries</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Offline Audio Synthesizer</span>
            <span>·</span>
            <span>Web Audio API</span>
            <span>·</span>
            <span>Tabular Presence</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
