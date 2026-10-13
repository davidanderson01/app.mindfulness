import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  RotateCw,
  Copy,
  Check,
  Bell,
  Bookmark,
  BookmarkCheck,
  Plus,
  X,
  Wind,
  Share2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { DAILY_AFFIRMATIONS } from '../data/meditationContent';
import { DailyAffirmation } from '../types';
import { storage } from '../services/storage';
import { soundEngine } from '../services/audioEngine';
import { LotusIcon } from './LotusIcon';
import { ElevateLogo } from './ElevateLogo';

export const DailyAffirmations: React.FC = () => {
  const [affirmations, setAffirmations] = useState<DailyAffirmation[]>(() => {
    const custom = storage.getCustomAffirmations();
    return [...DAILY_AFFIRMATIONS, ...custom];
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => storage.getFavoriteAffirmationIds());

  // Current featured card index
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Breathing pacer state
  const [isBreathingMode, setIsBreathingMode] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);

  // Mala repetition counter (1 to 21)
  const [repetitionCount, setRepetitionCount] = useState<number>(1);

  // Custom affirmation modal
  const [isAddingModalOpen, setIsAddingModalOpen] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>('');
  const [newCategory, setNewCategory] = useState<
    'Inner Peace' | 'Self-Compassion' | 'Clarity & Focus' | 'Grounding' | 'Sleep & Release' | 'Courage'
  >('Inner Peace');
  const [newContemplation, setNewContemplation] = useState<string>('');

  const categories = [
    'All',
    'Favorites',
    'Inner Peace',
    'Self-Compassion',
    'Clarity & Focus',
    'Grounding',
    'Sleep & Release',
    'Courage',
  ];

  const filteredAffirmations = affirmations.filter((aff) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Favorites') return favoriteIds.includes(aff.id);
    return aff.category === activeCategory;
  });

  const currentAffirmation = filteredAffirmations[currentIndex] || filteredAffirmations[0] || DAILY_AFFIRMATIONS[0];

  // Breathing loop when in breathing contemplation mode
  useEffect(() => {
    if (!isBreathingMode) return;

    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            soundEngine.playBreathCue('hold');
            setBreathPhase('hold');
            return 4;
          } else if (breathPhase === 'hold') {
            soundEngine.playBreathCue('exhale');
            setBreathPhase('exhale');
            return 5;
          } else {
            soundEngine.playBreathCue('inhale');
            setBreathPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingMode, breathPhase]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    storage.toggleFavoriteAffirmation(id);
    setFavoriteIds(storage.getFavoriteAffirmationIds());
  };

  const handleCopy = (aff: DailyAffirmation, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(`"${aff.text}" — Elevate-Mindfulness Affirmation`);
    setCopiedId(aff.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleNextRandom = () => {
    soundEngine.playSingingBowlChime(329.63, 3.5);
    const nextIdx = (currentIndex + 1) % filteredAffirmations.length;
    setCurrentIndex(nextIdx);
    setRepetitionCount(1);
  };

  const handlePrevious = () => {
    soundEngine.playSingingBowlChime(261.63, 3.0);
    const prevIdx = (currentIndex - 1 + filteredAffirmations.length) % filteredAffirmations.length;
    setCurrentIndex(prevIdx);
    setRepetitionCount(1);
  };

  const incrementRepetition = () => {
    soundEngine.playBreathCue('inhale');
    if (repetitionCount >= 21) {
      soundEngine.playSingingBowlChime(261.63, 5.0);
      setRepetitionCount(1);
    } else {
      setRepetitionCount((c) => c + 1);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const custom: DailyAffirmation = {
      id: `aff-custom-${Date.now()}`,
      text: newText.trim(),
      category: newCategory,
      contemplation: newContemplation.trim() || 'Rest your awareness in this truth with three steady breaths.',
      breathAnchor: {
        inhale: `I welcome this truth...`,
        exhale: `I let this truth anchor within...`,
      },
      isCustom: true,
    };

    storage.saveCustomAffirmation(custom);
    setAffirmations([custom, ...affirmations]);
    setIsAddingModalOpen(false);
    setNewText('');
    setNewContemplation('');
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
            <LotusIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Daily Contemplative Anchors & Mantras</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
            Daily Sacred Affirmations
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Reprogram subconscious neural chatter with conscious daily intentions, breath-synchronized mantras, and somatic contemplation anchors.
          </p>
        </div>

        <button
          onClick={() => setIsAddingModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write My Affirmation</span>
        </button>
      </div>

      {/* Primary Featured Affirmation Stage */}
      <div className="relative rounded-3xl bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl p-6 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[460px]">
        
        {/* Subtle Watermark of the user's Lotus Icon in Background */}
        <div className="absolute right-[-20px] bottom-[-20px] pointer-events-none text-white/4 dark:text-white/3">
          <LotusIcon size={340} />
        </div>

        {/* Top Control Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-stone-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <ElevateLogo className="w-7 h-7 shrink-0" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              {currentAffirmation.category}
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-400 font-mono">
              Anchor {currentIndex + 1} of {filteredAffirmations.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => soundEngine.playSingingBowlChime(261.63, 6.0)}
              className="p-2 rounded-xl border border-stone-800 bg-stone-950/60 text-stone-300 hover:text-white hover:border-stone-700 transition-colors"
              title="Strike Singing Bowl"
            >
              <Bell className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={(e) => toggleFavorite(currentAffirmation.id, e)}
              className="p-2 rounded-xl border border-stone-800 bg-stone-950/60 text-stone-300 hover:text-white hover:border-stone-700 transition-colors"
              title="Favorite"
            >
              {favoriteIds.includes(currentAffirmation.id) ? (
                <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={(e) => handleCopy(currentAffirmation, e)}
              className="p-2 rounded-xl border border-stone-800 bg-stone-950/60 text-stone-300 hover:text-white hover:border-stone-700 transition-colors"
              title="Copy Affirmation"
            >
              {copiedId === currentAffirmation.id ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Center: Hero Affirmation Text & Breathing Synchronizer */}
        <div className="relative z-10 my-8 sm:my-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          
          <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight mb-6 text-balance">
            "{currentAffirmation.text}"
          </p>

          <p className="text-xs sm:text-sm text-stone-300 italic font-sans max-w-xl leading-relaxed mb-6">
            {currentAffirmation.contemplation}
          </p>

          {/* Interactive Breath Synchronization Box */}
          {isBreathingMode ? (
            <div className="w-full max-w-md p-5 rounded-2xl bg-stone-950/80 border border-emerald-500/50 shadow-inner space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Breath Pacing Mode</span>
                </span>
                <span>{breathTimer}s</span>
              </div>

              <div className="text-sm font-medium text-white py-1">
                {breathPhase === 'inhale' && currentAffirmation.breathAnchor.inhale}
                {breathPhase === 'hold' && 'Anchoring this truth within your chest...'}
                {breathPhase === 'exhale' && currentAffirmation.breathAnchor.exhale}
              </div>

              <div className="w-full bg-stone-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(breathTimer / (breathPhase === 'exhale' ? 5 : 4)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                soundEngine.playBreathCue('inhale');
                setIsBreathingMode(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 text-xs font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Synchronize with Paced Breath</span>
            </button>
          )}

          {isBreathingMode && (
            <button
              onClick={() => setIsBreathingMode(false)}
              className="text-[11px] text-stone-500 hover:text-stone-300 mt-2 font-mono"
            >
              Exit Breath Mode
            </button>
          )}
        </div>

        {/* Bottom Navigation & Mala Beads Repetition Counter */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-800/80">
          
          {/* Mala Counter */}
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span>Mala Beads:</span>
            <button
              onClick={incrementRepetition}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-950 border border-stone-800 hover:border-emerald-500/60 text-stone-200 transition-all font-mono"
              title="Tap to count repetitions"
            >
              <LotusIcon className="w-3 h-3 text-emerald-400" />
              <span>{repetitionCount} / 21 Repetitions</span>
            </button>
          </div>

          {/* Shuffle / Next / Prev */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-xl border border-stone-800 bg-stone-950/60 text-stone-400 hover:text-stone-200 transition-colors"
              title="Previous Affirmation"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextRandom}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Next Affirmation</span>
            </button>

            <button
              onClick={handleNextRandom}
              className="p-2 rounded-xl border border-stone-800 bg-stone-950/60 text-stone-400 hover:text-stone-200 transition-colors"
              title="Next Affirmation"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-stone-200/80 dark:bg-stone-900 rounded-xl">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
              activeCategory === cat
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Affirmations Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAffirmations.map((aff, index) => {
          const isFav = favoriteIds.includes(aff.id);
          const isSelected = aff.id === currentAffirmation.id;

          return (
            <div
              key={aff.id}
              onClick={() => {
                setCurrentIndex(index);
                soundEngine.playSingingBowlChime(261.63, 2.5);
              }}
              className={`group cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm'
              }`}
            >
              {/* Subtle background lotus watermark */}
              <div className="absolute right-[-10px] bottom-[-10px] pointer-events-none opacity-5 dark:opacity-10 text-stone-900 dark:text-white">
                <LotusIcon size={120} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span className="flex items-center gap-1">
                    <LotusIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{aff.category}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => toggleFavorite(aff.id, e)}
                      className="p-1 rounded-lg text-stone-400 hover:text-amber-500 transition-colors"
                      title="Favorite"
                    >
                      {isFav ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleCopy(aff, e)}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                      title="Copy"
                    >
                      {copiedId === aff.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 leading-snug mb-3">
                  "{aff.text}"
                </p>

                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 italic">
                  {aff.contemplation}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                <span>Contemplate in Center</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Write Custom Affirmation Modal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAddingModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-1">
              <LotusIcon className="w-3.5 h-3.5" />
              <span>Personal Sacred Anchor</span>
            </div>
            <h3 className="font-serif text-2xl font-medium tracking-tight mb-2 text-stone-900 dark:text-stone-100">
              Create Custom Affirmation
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Affirmations formulated in the present tense ground your intention into reality.
            </p>

            <form onSubmit={handleAddCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Affirmation Phrase (Present Tense)
                </label>
                <textarea
                  rows={2}
                  required
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="E.g., I am anchored in peace; my heart is light and receptive."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-500 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Sanctuary Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="Inner Peace">Inner Peace</option>
                  <option value="Self-Compassion">Self-Compassion</option>
                  <option value="Clarity & Focus">Clarity & Focus</option>
                  <option value="Grounding">Grounding</option>
                  <option value="Sleep & Release">Sleep & Release</option>
                  <option value="Courage">Courage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Contemplation & Somatic Guide (Optional)
                </label>
                <input
                  type="text"
                  value={newContemplation}
                  onChange={(e) => setNewContemplation(e.target.value)}
                  placeholder="E.g., Notice softness in your shoulders when speaking this."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                >
                  Save to My Sanctuary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
