import React from 'react';
import {
  X,
  Download,
  Wifi,
  WifiOff,
  CheckCircle2,
  Play,
  Trash2,
  Sparkles,
  Headphones,
} from 'lucide-react';
import { MEDITATION_SESSIONS } from '../data/meditationContent';
import { MeditationSession } from '../types';
import { storage } from '../services/storage';
import { ElevateLogo } from './ElevateLogo';

interface OfflineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (session: MeditationSession) => void;
  isOfflineMode: boolean;
  setIsOfflineMode: (val: boolean) => void;
}

export const OfflineDrawer: React.FC<OfflineDrawerProps> = ({
  isOpen,
  onClose,
  onStartSession,
  isOfflineMode,
  setIsOfflineMode,
}) => {
  if (!isOpen) return null;

  const stats = storage.getStats();
  const downloadedSessions = MEDITATION_SESSIONS.filter((s) =>
    stats.downloadedSessionIds.includes(s.id)
  );

  const toggleOffline = () => {
    const nextVal = !isOfflineMode;
    setIsOfflineMode(nextVal);
    storage.setOfflineMode(nextVal);
  };

  const handleRemoveDownload = (sessionId: string) => {
    storage.toggleSessionDownload(sessionId);
    // Force re-render through parent or callback
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-stone-900 dark:text-stone-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <ElevateLogo className="w-9 h-9 shrink-0 drop-shadow-xs" />
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-0.5">
                <Download className="w-3.5 h-3.5" />
                <span>Elevate- Mindfulness</span>
              </div>
              <h3 className="font-serif text-2xl font-medium tracking-tight">
                Offline Playback & Storage
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Mode Switch Bar */}
        <div className="my-5 p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isOfflineMode
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                {isOfflineMode ? 'Airplane / Offline Mode Active' : 'Connected Mode'}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {isOfflineMode ? 'App runs exclusively from local audio cache' : 'Online data & synchronization active'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleOffline}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isOfflineMode
                ? 'bg-amber-700 text-white border-amber-800'
                : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-600'
            }`}
          >
            {isOfflineMode ? 'Disable' : 'Simulate Offline'}
          </button>
        </div>

        {/* Info on Web Audio synthesis */}
        <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
          Elevate-Mindfulness synthesizes binaural beats, bronze singing bowl harmonics, and nature soundscapes in real-time through the browser’s Web Audio API. This means all sound baths and breathing guides function seamlessly even with zero internet connectivity.
        </p>

        {/* Downloaded Sessions List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
            Downloaded Guided Sessions ({downloadedSessions.length})
          </div>

          {downloadedSessions.map((session) => (
            <div
              key={session.id}
              className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs text-stone-900 dark:text-stone-100 truncate">
                    {session.title}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5 font-mono">
                  <span>{Math.round(session.durationSeconds / 60)} min</span>
                  <span>·</span>
                  <span>{session.tradition}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onClose();
                    onStartSession(session);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-stone-950 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play</span>
                </button>
              </div>
            </div>
          ))}

          {downloadedSessions.length === 0 && (
            <div className="text-center py-8 text-xs text-stone-500">
              No sessions downloaded yet. Click the "Save Offline" button on any session to make it permanently accessible offline.
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
