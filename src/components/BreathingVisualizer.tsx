import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Sparkles, Wind } from 'lucide-react';
import { BREATHING_PATTERNS } from '../data/meditationContent';
import { BreathingPattern } from '../types';
import { soundEngine } from '../services/audioEngine';
import { storage } from '../services/storage';

interface BreathingVisualizerProps {
  initialPatternId?: string;
  onComplete?: () => void;
}

export const BreathingVisualizer: React.FC<BreathingVisualizerProps> = ({
  initialPatternId = 'box-breathing',
  onComplete,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(
    BREATHING_PATTERNS.find((p) => p.id === initialPatternId) || BREATHING_PATTERNS[0]
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(selectedPattern.defaultRounds);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Phase: 'inhale' | 'hold1' | 'exhale' | 'hold2'
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(selectedPattern.inhale);
  const [orbScale, setOrbScale] = useState<number>(1);

  // Update total rounds if pattern changes
  useEffect(() => {
    setTotalRounds(selectedPattern.defaultRounds);
    handleReset();
  }, [selectedPattern]);

  const handleReset = () => {
    setIsActive(false);
    setCurrentRound(1);
    setPhase('inhale');
    setPhaseSecondsLeft(selectedPattern.inhale);
    setOrbScale(1);
  };

  // Breathing loop ticker
  useEffect(() => {
    if (!isActive) return;

    // Trigger audio chime at phase start
    if (audioEnabled) {
      if (phase === 'inhale') soundEngine.playBreathCue('inhale');
      else if (phase === 'hold1' || phase === 'hold2') soundEngine.playBreathCue('hold');
      else if (phase === 'exhale') soundEngine.playBreathCue('exhale');
    }

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          advancePhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, selectedPattern, audioEnabled]);

  const advancePhase = () => {
    if (phase === 'inhale') {
      if (selectedPattern.hold1 > 0) {
        setPhase('hold1');
        setPhaseSecondsLeft(selectedPattern.hold1);
      } else {
        setPhase('exhale');
        setPhaseSecondsLeft(selectedPattern.exhale);
      }
    } else if (phase === 'hold1') {
      setPhase('exhale');
      setPhaseSecondsLeft(selectedPattern.exhale);
    } else if (phase === 'exhale') {
      if (selectedPattern.hold2 > 0) {
        setPhase('hold2');
        setPhaseSecondsLeft(selectedPattern.hold2);
      } else {
        finishCycle();
      }
    } else if (phase === 'hold2') {
      finishCycle();
    }
  };

  const finishCycle = () => {
    if (currentRound >= totalRounds) {
      setIsActive(false);
      soundEngine.playSingingBowlChime(261.63, 6.0);
      const cycleDuration = selectedPattern.inhale + selectedPattern.hold1 + selectedPattern.exhale + selectedPattern.hold2;
      const totalMinutes = Math.max(1, Math.round((cycleDuration * totalRounds) / 60));

      storage.recordSessionCompletion({
        sessionId: selectedPattern.id,
        sessionTitle: selectedPattern.name,
        category: 'breathwork',
        durationMinutes: totalMinutes,
        moodBefore: 3,
        moodAfter: 5,
        reflection: `Completed ${totalRounds} cycles of ${selectedPattern.name}.`,
      });

      if (onComplete) onComplete();
    } else {
      setCurrentRound((r) => r + 1);
      setPhase('inhale');
      setPhaseSecondsLeft(selectedPattern.inhale);
    }
  };

  // Compute visual orb scale based on current phase and timing
  const getOrbState = () => {
    switch (phase) {
      case 'inhale':
        return {
          scale: 1.45,
          text: 'Inhale through the nose',
          subText: 'Fill the lower belly, expand ribs',
          color: 'from-emerald-500/30 via-teal-500/20 to-transparent',
          ringColor: 'border-emerald-500/60',
        };
      case 'hold1':
        return {
          scale: 1.45,
          text: 'Hold gently',
          subText: 'Keep throat relaxed and soft',
          color: 'from-amber-500/30 via-emerald-500/20 to-transparent',
          ringColor: 'border-amber-400/70',
        };
      case 'exhale':
        return {
          scale: 1.0,
          text: 'Exhale slowly',
          subText: 'Release through soft lips or nose',
          color: 'from-indigo-500/30 via-sky-500/20 to-transparent',
          ringColor: 'border-indigo-400/60',
        };
      case 'hold2':
        return {
          scale: 1.0,
          text: 'Hold empty',
          subText: 'Rest in quiet stillness',
          color: 'from-stone-500/30 via-stone-400/20 to-transparent',
          ringColor: 'border-stone-400/50',
        };
    }
  };

  const orbState = getOrbState();

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Pattern Selector Tabs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
          <Wind className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Evidence-Based Breath Protocols</span>
        </div>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100 mb-4">
          Conscious Breathwork Pacer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BREATHING_PATTERNS.map((p) => {
            const isSelected = selectedPattern.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPattern(p);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-emerald-700 dark:border-emerald-400 bg-stone-100 dark:bg-stone-800 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="font-medium text-sm text-stone-900 dark:text-stone-100 leading-snug">
                  {p.name}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {p.inhale}s · {p.hold1}s · {p.exhale}s · {p.hold2}s
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Breathing Stage Container */}
      <div className="relative rounded-3xl bg-stone-900 text-stone-100 border border-stone-800 p-8 sm:p-12 shadow-2xl flex flex-col items-center justify-between min-h-[520px] overflow-hidden">
        
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-radial from-stone-800/40 via-transparent to-transparent pointer-events-none" />

        {/* Top bar within stage */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-wider text-emerald-400 uppercase">
              Round {currentRound} of {totalRounds}
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-400">
              {selectedPattern.tradition}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-lg border border-stone-800 bg-stone-800/60 text-stone-400 hover:text-stone-200 transition-colors"
              title={audioEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg border border-stone-800 bg-stone-800/60 text-stone-400 hover:text-stone-200 transition-colors"
              title="Reset Rounds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: The Breathing Orb */}
        <div className="relative flex flex-col items-center justify-center my-8 z-10">
          
          {/* Animated concentric rings */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            
            {/* Outer soft ambient halo */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${orbState.color} blur-2xl transition-transform duration-1000 ease-in-out`}
              style={{
                transform: `scale(${orbState.scale * 1.1})`,
                opacity: isActive ? 0.8 : 0.2,
              }}
            />

            {/* Middle pulsing dashed guide ring */}
            <div
              className={`absolute inset-6 rounded-full border border-dashed ${orbState.ringColor} transition-transform duration-1000 ease-in-out opacity-40`}
              style={{
                transform: `scale(${orbState.scale})`,
              }}
            />

            {/* Inner primary breathing sphere */}
            <div
              className="relative w-44 h-44 rounded-full bg-gradient-to-b from-stone-800 to-stone-950 border border-stone-700/80 shadow-inner flex flex-col items-center justify-center text-center transition-transform duration-1000 ease-in-out"
              style={{
                transform: `scale(${orbState.scale})`,
              }}
            >
              <span className="font-mono text-4xl sm:text-5xl font-light text-stone-100 tabular-nums">
                {isActive ? phaseSecondsLeft : selectedPattern.inhale}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mt-1">
                {isActive ? phase.toUpperCase() : 'READY'}
              </span>
            </div>
          </div>

          {/* Phase text instructions */}
          <div className="text-center mt-6">
            <h3 className="font-serif text-2xl font-medium tracking-tight text-stone-100">
              {isActive ? orbState.text : 'Find your posture'}
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
              {isActive ? orbState.subText : 'Relax the belly and drop the shoulders.'}
            </p>
          </div>
        </div>

        {/* Bottom controls & trigger */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 z-10 pt-4 border-t border-stone-800/80">
          
          {/* Rounds adjuster */}
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Rounds:</span>
            {[4, 6, 8, 12].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setTotalRounds(r);
                  handleReset();
                }}
                className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${
                  totalRounds === r
                    ? 'bg-stone-700 text-stone-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Main Play / Pause Trigger */}
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold text-xs shadow-lg shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Breathwork</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Physiological Benefits Card */}
      <div className="mt-6 p-6 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
        <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-2">
          Physiological Mechanism & Research
        </h4>
        <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
          {selectedPattern.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
          {selectedPattern.benefits.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
