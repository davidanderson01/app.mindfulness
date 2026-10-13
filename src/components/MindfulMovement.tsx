import React, { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MINDFUL_MOVEMENT_ROUTINES } from '../data/meditationContent';
import { MindfulMovementRoutine, MovementPosture } from '../types';
import { soundEngine } from '../services/audioEngine';
import { storage } from '../services/storage';

export const MindfulMovement: React.FC = () => {
  const [selectedRoutine, setSelectedRoutine] = useState<MindfulMovementRoutine>(
    MINDFUL_MOVEMENT_ROUTINES[0]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPostureIdx, setCurrentPostureIdx] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    selectedRoutine.postures[0].durationSec
  );
  const [completedRoutine, setCompletedRoutine] = useState<boolean>(false);

  const currentPosture: MovementPosture = selectedRoutine.postures[currentPostureIdx];
  const totalPostures = selectedRoutine.postures.length;

  // Handle changing routine
  const handleSelectRoutine = (routine: MindfulMovementRoutine) => {
    setSelectedRoutine(routine);
    setIsPlaying(false);
    setCurrentPostureIdx(0);
    setSecondsRemaining(routine.postures[0].durationSec);
    setCompletedRoutine(false);
  };

  // Main posture timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          advancePosture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentPostureIdx, selectedRoutine]);

  const advancePosture = () => {
    soundEngine.playSingingBowlChime(329.63, 4.0); // transition bell
    if (currentPostureIdx + 1 < totalPostures) {
      const nextIdx = currentPostureIdx + 1;
      setCurrentPostureIdx(nextIdx);
      setSecondsRemaining(selectedRoutine.postures[nextIdx].durationSec);
    } else {
      setIsPlaying(false);
      setCompletedRoutine(true);
      soundEngine.playSingingBowlChime(261.63, 7.0);

      storage.recordSessionCompletion({
        sessionId: selectedRoutine.id,
        sessionTitle: selectedRoutine.title,
        category: 'fitness',
        durationMinutes: selectedRoutine.durationMinutes,
        moodBefore: 3,
        moodAfter: 5,
        reflection: `Completed mindful fitness routine: ${selectedRoutine.title}.`,
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
          <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Mindful Somatics & Conscious Movement</span>
        </div>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
          Mindful Fitness & Somatic Mobility
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
          Gentle kinetic sequences designed to mobilize spinal fascia, release nervous tension from desk work, and unite deliberate breath with graceful physical postures.
        </p>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {MINDFUL_MOVEMENT_ROUTINES.map((routine) => {
          const isSelected = selectedRoutine.id === routine.id;
          return (
            <button
              key={routine.id}
              onClick={() => handleSelectRoutine(routine)}
              className={`text-left p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-emerald-700 dark:border-emerald-400 bg-stone-100 dark:bg-stone-800 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {routine.durationMinutes} min
                </span>
                <span>{routine.difficulty}</span>
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
                {routine.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                {routine.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Routine Stage */}
      <div className="bg-stone-900 text-stone-100 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
              Active Routine · {selectedRoutine.title}
            </span>
            <span className="text-xs text-stone-400">
              Posture {currentPostureIdx + 1} of {totalPostures}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentPostureIdx(0);
                setSecondsRemaining(selectedRoutine.postures[0].durationSec);
                setCompletedRoutine(false);
              }}
              className="p-2 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800"
              title="Restart Routine"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Posture Details & Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-8">
          
          {/* Left: Big Circular Timer */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center rounded-full bg-stone-950 border border-stone-800 shadow-inner">
              <span className="font-mono text-4xl font-light tabular-nums text-stone-100">
                {formatTime(secondsRemaining)}
              </span>
              <span className="absolute bottom-10 text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                {isPlaying ? 'HOLDING' : 'READY'}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-semibold shadow-md transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Start Flow'}</span>
              </button>
              <button
                onClick={advancePosture}
                className="p-2.5 text-stone-400 hover:text-stone-100 border border-stone-800 rounded-xl hover:bg-stone-800 transition-colors"
                title="Next Posture"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Posture Alignment & Instructions */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Current Posture
              </span>
              <h3 className="font-serif text-2xl font-medium tracking-tight text-white mt-0.5">
                {currentPosture.name}
              </h3>
            </div>

            {/* Breath cue callout */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300">
              <span className="font-semibold block mb-0.5 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                Breath Coordination:
              </span>
              {currentPosture.breathCue}
            </div>

            {/* Instruction steps */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                Step-by-Step Alignment
              </span>
              {currentPosture.instructions.map((inst, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-stone-300">
                  <span className="w-4 h-4 rounded-full bg-stone-800 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>

            {/* Alignment Tip */}
            <p className="text-xs text-stone-400 italic pt-1">
              Tip: {currentPosture.alignmentTip}
            </p>
          </div>

        </div>

        {/* Postures Progress Strip */}
        <div className="border-t border-stone-800 pt-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {selectedRoutine.postures.map((pos, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentPostureIdx(idx);
                setSecondsRemaining(pos.durationSec);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                currentPostureIdx === idx
                  ? 'bg-emerald-900/60 border border-emerald-500/60 text-emerald-200 font-semibold'
                  : 'bg-stone-800/40 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {idx + 1}. {pos.name.split(' ')[0]}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
