import React, { useState } from 'react';
import { BookOpen, Sparkles, Brain, Compass, ArrowRight, Check } from 'lucide-react';
import { MEDITATION_TRADITIONS, MEDITATION_SESSIONS } from '../data/meditationContent';
import { MeditationTradition, MeditationSession } from '../types';

interface TraditionsLibraryProps {
  onStartSession: (session: MeditationSession) => void;
}

export const TraditionsLibrary: React.FC<TraditionsLibraryProps> = ({ onStartSession }) => {
  const [selectedTradition, setSelectedTradition] = useState<MeditationTradition>(
    MEDITATION_TRADITIONS[0]
  );

  const matchedSession = MEDITATION_SESSIONS.find(
    (s) => s.id === selectedTradition.recommendedSessionId
  ) || MEDITATION_SESSIONS[0];

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Contemplative Lineages & Practice Guides</span>
        </div>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
          Meditation Traditions & Lineage Wisdom
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
          Explore the historical origins, philosophical foundations, posture protocols, and peer-reviewed neuroscience behind classical contemplative disciplines.
        </p>
      </div>

      {/* Grid of Traditions Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        {MEDITATION_TRADITIONS.map((tradition) => {
          const isSelected = selectedTradition.id === tradition.id;
          return (
            <button
              key={tradition.id}
              onClick={() => setSelectedTradition(tradition)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-emerald-700 dark:border-emerald-400 bg-stone-100 dark:bg-stone-800 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                {tradition.historicalPeriod}
              </span>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                {tradition.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                {tradition.origin}
              </p>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Editorial Sheet for Selected Tradition */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* Title and Origin Header */}
        <div className="border-b border-stone-100 dark:border-stone-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-1">
              <span>{selectedTradition.origin}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedTradition.historicalPeriod}</span>
            </div>
            <h3 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
              {selectedTradition.name}
            </h3>
          </div>

          <button
            onClick={() => onStartSession(matchedSession)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-stone-950 text-xs font-semibold shadow-md transition-colors shrink-0"
          >
            <span>Practice Guided {selectedTradition.name.split(' ')[0]}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section 1: Philosophy & Historical Core */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-2">
            Core Philosophy & Worldview
          </h4>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-4xl">
            {selectedTradition.corePhilosophy}
          </p>
        </div>

        {/* Section 2: Neuroscience & Empirical Findings */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-400 mb-3">
            <Brain className="w-3.5 h-3.5 text-indigo-500" />
            <span>Peer-Reviewed Cognitive & Neurobiological Findings</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedTradition.scientificBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-xs text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2.5"
              >
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Physical Posture & Alignment */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-2">
            Physical Asana & Posture Alignment
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800 leading-relaxed">
            {selectedTradition.postureGuide}
          </p>
        </div>

        {/* Section 4: Systematic Step-by-Step Instructions */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-3">
            Step-by-Step Practice Protocol
          </h4>
          <div className="space-y-2.5">
            {selectedTradition.stepsToPractice.map((stepStr, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans"
              >
                {stepStr}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
