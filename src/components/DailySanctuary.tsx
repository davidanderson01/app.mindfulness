import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Play,
  Download,
  Check,
  Compass,
  ArrowRight,
  Headphones,
  Wind,
  Activity,
  Heart,
  Moon,
  Sun,
  ShieldCheck,
  Music,
} from 'lucide-react';
import { MEDITATION_SESSIONS, DAILY_AFFIRMATIONS } from '../data/meditationContent';
import { MeditationSession, MeditationCategory } from '../types';
import { storage } from '../services/storage';
import { soundEngine } from '../services/audioEngine';
import { LotusIcon } from './LotusIcon';
import { ElevateLogo } from './ElevateLogo';

interface DailySanctuaryProps {
  onStartSession: (session: MeditationSession) => void;
  onOpenCheckin: () => void;
  onSelectTab: (tab: string) => void;
}

export const DailySanctuary: React.FC<DailySanctuaryProps> = ({
  onStartSession,
  onOpenCheckin,
  onSelectTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [stats, setStats] = useState(storage.getStats());

  const categories = [
    { id: 'all', label: 'All Sessions' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'sound-bath', label: 'Sound Baths' },
    { id: 'focus', label: 'Focus & Zen' },
    { id: 'sleep', label: 'Deep Sleep & NSDR' },
    { id: 'anxiety', label: 'Somatic Relief' },
    { id: 'compassion', label: 'Loving-Kindness' },
  ];

  const featuredSession = MEDITATION_SESSIONS[0]; // Awakening Stillness & Clarity

  const filteredSessions = MEDITATION_SESSIONS.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  const toggleDownload = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.toggleSessionDownload(sessionId);
    setStats(storage.getStats());
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Editorial Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] items-stretch">
          
          {/* Left Text Zone (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Daily Contemplative Practice</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight max-w-xl text-balance">
                Awaken Stillness & Deep Neural Clarity
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-4 leading-relaxed max-w-lg font-sans">
                "The quieter you become, the more you can hear." A personalized sanctuary of pure breathwork, real-time binaural sound baths, and somatic presence.
              </p>
            </div>

            {/* Quick Action Strip */}
            <div className="pt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onStartSession(featuredSession)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold text-xs shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Today's Practice (10m)</span>
              </button>

              <button
                onClick={onOpenCheckin}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-medium text-xs transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tailor to Current Mood</span>
              </button>
            </div>

            {/* Quiet Metadata separator */}
            <div className="pt-6 flex items-center gap-3 text-xs text-stone-400 font-mono">
              <span>{stats.streakDays}-Day Streak</span>
              <span aria-hidden="true">·</span>
              <span>{stats.totalMinutes} Mindful Minutes</span>
              <span aria-hidden="true">·</span>
              <span>100% Offline Ready</span>
            </div>
          </div>

          {/* Right Hero Image (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/src/assets/images/zen_stone_sanctuary_1791924428174.jpg"
              alt="Zen stone sanctuary garden at Ryōan-ji"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-900 via-stone-900/40 to-transparent" />
            <div className="absolute bottom-4 right-4 bg-stone-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-700/60 text-[10px] font-mono text-stone-300">
              Ryōan-ji Zen Sanctuary, Kyoto
            </div>
          </div>

        </div>
      </section>

      {/* Daily Affirmation Spotlight Banner featuring the Sacred Lotus */}
      <section className="relative rounded-2xl p-6 sm:p-8 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4 z-10">
          <ElevateLogo className="w-12 h-12 shrink-0 drop-shadow-sm" />
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-1">
              <span>Affirmation of the Day</span>
              <span aria-hidden="true">·</span>
              <span>{DAILY_AFFIRMATIONS[0].category}</span>
            </div>
            <p className="font-serif text-xl sm:text-2xl font-medium text-stone-900 dark:text-stone-100 leading-snug">
              "{DAILY_AFFIRMATIONS[0].text}"
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic">
              {DAILY_AFFIRMATIONS[0].contemplation}
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('affirmations')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-all shrink-0 self-start sm:self-center shadow-sm"
        >
          <span>Embody in Affirmations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Quick Sanctuary Pathways (Zero clutter, functional buttons) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Instant Gateways
            </span>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
              Micro-Restorations
            </h2>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Designed for swift nervous system regulation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Affirmations */}
          <button
            onClick={() => onSelectTab('affirmations')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 shadow-sm text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3 group-hover:scale-105 transition-transform p-2">
              <LotusIcon className="w-full h-full" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
              Affirmations
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Sacred mantras & breath-synced anchors.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span>Open Deck</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Box Breathing */}
          <button
            onClick={() => onSelectTab('breathing')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 shadow-sm text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
              Box Breathing
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              4-4-4-4 rhythm to neutralize acute stress.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span>Open Pacer</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Sound Bath */}
          <button
            onClick={() => onSelectTab('sound-bath')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 shadow-sm text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
              Binaural Sound Bath
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Real-time Theta & Alpha wave generator with singing bowls.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span>Launch Mixer</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Mindful Movement */}
          <button
            onClick={() => onSelectTab('movement')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 shadow-sm text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/60 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
              Spinal Awakening Flow
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Gentle somatic postures to unwind thoracic and cervical strain.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span>Start Routine</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Sacred Map */}
          <button
            onClick={() => onSelectTab('places')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 shadow-sm text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
              Sacred Sanctuaries
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Interactive map of quiet zen gardens, temples & acoustic domes.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span>Explore Map</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Song Studio */}
          <button
            onClick={() => onSelectTab('song-studio')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 shadow-sm text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3 group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-1">
              Song Studio
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Compose songs with or without Google Lyria AI music models.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span>Create Song</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>
      </section>

      {/* Guided Meditation Library */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
              Guided Meditation Sanctuary
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-stone-200/60 dark:bg-stone-900 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const isDownloaded = stats.downloadedSessionIds.includes(session.id);
            return (
              <div
                key={session.id}
                onClick={() => onStartSession(session)}
                className="group cursor-pointer rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-600/40 dark:hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                {/* Image Cover */}
                <div className="relative h-44 w-full bg-stone-800 overflow-hidden">
                  <img
                    src={session.image}
                    alt={session.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top Bar on Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-200 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/20">
                      {session.tradition}
                    </span>

                    <button
                      onClick={(e) => toggleDownload(session.id, e)}
                      className={`p-1.5 rounded-full backdrop-blur-md border transition-colors ${
                        isDownloaded
                          ? 'bg-emerald-950/80 border-emerald-400/60 text-emerald-400'
                          : 'bg-black/40 border-white/20 text-stone-300 hover:text-white'
                      }`}
                      title={isDownloaded ? 'Downloaded Offline' : 'Save Offline'}
                    >
                      {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Play circle trigger */}
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-emerald-600 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed metadata line with typographic separator */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono mb-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.round(session.durationSeconds / 60)} min
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Guide: {session.guideName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{session.intensity}</span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {session.title}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span className="capitalize">{session.audioTheme.replace('-', ' ')}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium group-hover:underline">
                      Begin Session →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
