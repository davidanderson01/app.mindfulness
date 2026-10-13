import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Bell,
  Volume2,
  VolumeX,
  Download,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MeditationSession, MeditationStep } from '../types';
import { soundEngine } from '../services/audioEngine';
import { storage } from '../services/storage';

interface MeditationPlayerProps {
  session: MeditationSession;
  onClose: () => void;
  onSessionComplete: (durationMinutes: number) => void;
}

export const MeditationPlayer: React.FC<MeditationPlayerProps> = ({
  session,
  onClose,
  onSessionComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(session.durationSeconds);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(
    storage.getStats().downloadedSessionIds.includes(session.id)
  );

  // Post-session reflection modal state
  const [showReflectionModal, setShowReflectionModal] = useState<boolean>(false);
  const [moodBefore, setMoodBefore] = useState<number>(3);
  const [moodAfter, setMoodAfter] = useState<number>(5);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);

  const totalSeconds = session.durationSeconds;
  const elapsedSeconds = totalSeconds - secondsRemaining;
  const progressRatio = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0;

  // Sound environment setup
  useEffect(() => {
    // Play initial bell
    soundEngine.playSingingBowlChime(261.63, 7.0);

    // Start subtle ambient background audio
    if (!isAudioMuted) {
      if (session.audioTheme === 'tibetan-bowls') {
        soundEngine.startMixer({ carrierFreq: 216, beatFreq: 6, bowlVol: 0.4, rainVol: 0.05, masterVol: 0.5 });
      } else if (session.audioTheme === 'stream-flow') {
        soundEngine.startMixer({ carrierFreq: 432, beatFreq: 10, riverVol: 0.35, bowlVol: 0.15, masterVol: 0.5 });
      } else if (session.audioTheme === 'rain-silence') {
        soundEngine.startMixer({ carrierFreq: 432, beatFreq: 8, rainVol: 0.3, bowlVol: 0.1, masterVol: 0.5 });
      } else {
        soundEngine.startMixer({ carrierFreq: 432, beatFreq: 8, bowlVol: 0.3, rainVol: 0.1, masterVol: 0.5 });
      }
    }

    return () => {
      soundEngine.stopMixer();
    };
  }, []);

  // Sync ambient audio mute
  useEffect(() => {
    if (isAudioMuted) {
      soundEngine.stopMixer();
    } else if (isPlaying) {
      soundEngine.startMixer({ masterVol: 0.5 });
    }
  }, [isAudioMuted]);

  // Main countdown ticker
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishSession();
          return 0;
        }

        // Halfway interval bell check
        const newElapsed = totalSeconds - (prev - 1);
        if (Math.floor(newElapsed) === Math.floor(totalSeconds / 2)) {
          soundEngine.playSingingBowlChime(329.63, 6.0); // E4 note chime
        }

        // Advance steps based on timeOffset
        const nextStepIdx = session.steps.findIndex(
          (st, idx) =>
            newElapsed >= st.timeOffset &&
            (idx === session.steps.length - 1 || newElapsed < session.steps[idx + 1].timeOffset)
        );
        if (nextStepIdx !== -1 && nextStepIdx !== currentStepIndex) {
          setCurrentStepIndex(nextStepIdx);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, totalSeconds, currentStepIndex]);

  const handleFinishSession = () => {
    setIsPlaying(false);
    soundEngine.playSingingBowlChime(261.63, 9.0);
    soundEngine.stopMixer();

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch {
      // Ignored
    }

    setShowReflectionModal(true);
  };

  const handleSaveReflection = () => {
    const minutesCompleted = Math.max(1, Math.round(elapsedSeconds / 60));
    const result = storage.recordSessionCompletion({
      sessionId: session.id,
      sessionTitle: session.title,
      category: session.category,
      durationMinutes: minutesCompleted,
      moodBefore,
      moodAfter,
      reflection: reflectionText,
    });

    if (result.newBadge) {
      setUnlockedBadge(result.newBadge);
    }

    onSessionComplete(minutesCompleted);
    setShowReflectionModal(false);
    onClose();
  };

  const toggleDownload = () => {
    const updated = storage.toggleSessionDownload(session.id);
    setIsDownloaded(updated);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentStep: MeditationStep | undefined = session.steps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 text-stone-100 shadow-2xl flex flex-col items-center justify-between min-h-[580px] overflow-hidden">
        
        {/* Subtle Ambient Background Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600 via-transparent to-transparent" />

        {/* Top Controls Row */}
        <div className="relative w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDownload}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDownloaded
                  ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300'
                  : 'border-stone-800 bg-stone-800/60 text-stone-400 hover:text-stone-200'
              }`}
              title="Download for offline playback"
            >
              {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isDownloaded ? 'Downloaded Offline' : 'Save Offline'}</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playSingingBowlChime(261.63, 6.0);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-stone-800 bg-stone-800/60 text-stone-300 hover:text-white transition-colors"
              title="Strike Singing Bowl Bell"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Chime</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-200 border border-stone-800 bg-stone-800/40 transition-colors"
              title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`p-2 rounded-lg border transition-colors ${
                showTranscript
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                  : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle Spoken Guidance Text"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-200 border border-stone-800 bg-stone-800/40 transition-colors"
              title="Exit Session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Title & Circular Timer Ring */}
        <div className="relative w-full flex flex-col items-center my-6 z-10 text-center">
          <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-1">
            {session.tradition}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight mb-6 max-w-md">
            {session.title}
          </h2>

          {/* Circular Countdown Ring */}
          <div className="relative w-56 h-56 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="96"
                className="stroke-stone-800"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="112"
                cy="112"
                r="96"
                className="stroke-emerald-500 transition-all duration-1000 ease-linear"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 96}
                strokeDashoffset={2 * Math.PI * 96 * (1 - progressRatio)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Ring Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-4xl sm:text-5xl font-light tracking-tight tabular-nums text-stone-100">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-mono">
                {isPlaying ? 'Stillness' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Current Guidance Cue */}
          {currentStep && (
            <div className="mt-4 max-w-lg transition-all duration-500">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-widest mb-1">
                Cue {currentStepIndex + 1} of {session.steps.length}: {currentStep.cue}
              </div>
              {showTranscript && (
                <p className="text-sm text-stone-300 italic font-serif leading-relaxed px-4 py-2 bg-stone-800/40 rounded-xl border border-stone-800 mt-2 animate-in fade-in">
                  "{currentStep.transcription}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="relative w-full flex items-center justify-center gap-6 z-10 pt-4 border-t border-stone-800/80">
          <button
            onClick={() => {
              setSecondsRemaining((prev) => Math.min(totalSeconds, prev + 30));
            }}
            className="p-3 text-stone-400 hover:text-stone-200 transition-colors"
            title="Rewind 30 seconds"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-stone-950 flex items-center justify-center shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
          </button>

          <button
            onClick={handleFinishSession}
            className="px-4 py-2 text-xs font-medium text-stone-300 hover:text-white border border-stone-800 rounded-lg bg-stone-800/50 hover:bg-stone-800 transition-colors"
          >
            Complete Now
          </button>
        </div>

        {/* Post-Session Reflection Modal */}
        {showReflectionModal && (
          <div className="absolute inset-0 z-50 bg-stone-900/98 p-6 sm:p-8 flex flex-col justify-between rounded-3xl animate-in zoom-in-95 duration-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Practice Completed</span>
              </div>
              <h3 className="font-serif text-2xl font-medium mb-1">Gentle Reflection</h3>
              <p className="text-xs text-stone-400 mb-6">
                Noticing shifts in your somatic state cements the habit of presence.
              </p>

              {/* Mood Shift Comparison */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-2">
                    How was your state before starting? (1 = Restless, 5 = Deeply Serene)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setMoodBefore(score)}
                        className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-colors ${
                          moodBefore === score
                            ? 'bg-stone-800 border-emerald-500 text-emerald-400 font-bold'
                            : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-2">
                    How is your state now? (1 = Agitated, 5 = Deep Stillness)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setMoodAfter(score)}
                        className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-colors ${
                          moodAfter === score
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold'
                            : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reflection Notes */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Mindful Journal (Optional note to save)
                  </label>
                  <textarea
                    rows={3}
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="E.g., Felt tension soften behind my chest. Slower pulse..."
                    className="w-full text-xs p-3 rounded-xl bg-stone-800/80 border border-stone-700/80 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  setShowReflectionModal(false);
                  onClose();
                }}
                className="text-xs text-stone-400 hover:text-stone-200 px-3 py-2"
              >
                Skip Journal
              </button>
              <button
                onClick={handleSaveReflection}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-semibold rounded-lg shadow-md transition-colors"
              >
                Save & Continue
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
