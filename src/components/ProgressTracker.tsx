import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  Plus,
  Trash2,
} from 'lucide-react';
import { storage } from '../services/storage';
import { ACHIEVEMENTS } from '../data/meditationContent';
import { UserStats, SessionLog, JournalEntry } from '../types';

export const ProgressTracker: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(storage.getStats());
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(storage.getSessionLogs());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(storage.getJournalEntries());

  const [isAddingJournal, setIsAddingJournal] = useState<boolean>(false);
  const [newJournalText, setNewJournalText] = useState<string>('');
  const [newJournalMood, setNewJournalMood] = useState<number>(4);
  const [newJournalIntention, setNewJournalIntention] = useState<string>('');

  useEffect(() => {
    setStats(storage.getStats());
    setSessionLogs(storage.getSessionLogs());
    setJournalEntries(storage.getJournalEntries());
  }, []);

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalText.trim()) return;

    const entry = storage.addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      moodScore: newJournalMood,
      moodLabel: storage.getMoodLabel(newJournalMood),
      reflectionText: newJournalText,
      intention: newJournalIntention,
    });

    setJournalEntries([entry, ...journalEntries]);
    setNewJournalText('');
    setNewJournalIntention('');
    setIsAddingJournal(false);
  };

  // Compute average mood lift
  const logsWithBothMoods = sessionLogs.filter((l) => l.moodBefore && l.moodAfter);
  const avgMoodLift =
    logsWithBothMoods.length > 0
      ? (
          logsWithBothMoods.reduce((acc, l) => acc + (l.moodAfter! - l.moodBefore!), 0) /
          logsWithBothMoods.length
        ).toFixed(1)
      : '+1.6';

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxWeeklyMin = Math.max(30, ...Object.values(stats.weeklyMinutes));

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Contemplative Growth & Reflection Tracker</span>
        </div>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
          Mindful Practice & Elevate-Mindfulness Journal
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
          Monitor your ongoing rhythm of stillness, observe shifts in somatic tranquility, and chronicle insights from your contemplative sessions.
        </p>
      </div>

      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-2xl font-serif font-medium tabular-nums text-stone-900 dark:text-stone-100">
              {stats.streakDays} Days
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Current Continuity
            </div>
          </div>
        </div>

        {/* Total Mindful Minutes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
            <Clock className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <div className="text-2xl font-serif font-medium tabular-nums text-stone-900 dark:text-stone-100">
              {stats.totalMinutes} Min
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Stillness Immersion
            </div>
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <Sparkles className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <div className="text-2xl font-serif font-medium tabular-nums text-stone-900 dark:text-stone-100">
              {stats.totalSessions}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Sessions Completed
            </div>
          </div>
        </div>

        {/* Avg Mood Shift */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <TrendingUp className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <div className="text-2xl font-serif font-medium tabular-nums text-stone-900 dark:text-stone-100">
              +{avgMoodLift}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Avg Somatic Tranquility
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row: 7-Day Chart & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* 7-Day Activity Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Weekly Rhythm
              </span>
              <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                Daily Mindful Minutes
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
              {Object.values(stats.weeklyMinutes).reduce((a, b) => a + b, 0)} Total Min This Week
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-stone-100 dark:border-stone-800">
            {daysOfWeek.map((day) => {
              const minutes = stats.weeklyMinutes[day] || 0;
              const heightPct = Math.max(8, Math.round((minutes / maxWeeklyMin) * 100));
              const isToday = new Date().toLocaleDateString('en-US', { weekday: 'short' }) === day;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-stone-400 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                    {minutes}m
                  </span>
                  <div className="w-full bg-stone-100 dark:bg-stone-800/80 rounded-t-lg h-32 flex items-end p-1">
                    <div
                      className={`w-full rounded-md transition-all duration-700 ${
                        isToday
                          ? 'bg-emerald-600 dark:bg-emerald-500 shadow-sm'
                          : minutes > 0
                          ? 'bg-stone-400 dark:bg-stone-600'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono ${isToday ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'text-stone-500'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-3">
            <span>Steady 10-15 minutes daily yields long-term neuroplastic remodeling.</span>
          </div>
        </div>

        {/* Milestone Badges Showcase (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Milestones
              </span>
              <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">
                Sanctuary Achievements
              </h3>
            </div>
            <Award className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {ACHIEVEMENTS.slice(0, 4).map((badge) => {
              const isUnlocked = stats.achievements.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-center gap-3.5 transition-colors ${
                    isUnlocked
                      ? 'border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-stone-200/60 dark:border-stone-800/60 opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-700 dark:bg-emerald-500 text-white dark:text-stone-950'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-stone-900 dark:text-stone-100 truncate">
                        {badge.title}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 shrink-0">
                        {isUnlocked ? 'Unlocked' : badge.requiredMetric}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Mindful Journal & Reflections Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Contemplative Chronicle</span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
              Mindful Journal Entries ({journalEntries.length})
            </h3>
          </div>

          <button
            onClick={() => setIsAddingJournal(!isAddingJournal)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-white transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reflection</span>
          </button>
        </div>

        {/* New Reflection Form */}
        {isAddingJournal && (
          <form onSubmit={handleAddJournal} className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 mb-6 space-y-4 animate-in fade-in">
            <h4 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              Record a Mindful Insight
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Inner Mood Rating (1 to 5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewJournalMood(s)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                        newJournalMood === s
                          ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                          : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Intention / Anchor
                </label>
                <input
                  type="text"
                  value={newJournalIntention}
                  onChange={(e) => setNewJournalIntention(e.target.value)}
                  placeholder="E.g., Gentle presence, releasing anxiety"
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Reflection Text
              </label>
              <textarea
                rows={3}
                required
                value={newJournalText}
                onChange={(e) => setNewJournalText(e.target.value)}
                placeholder="What sensations, insights, or shifts did you observe during stillness?"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingJournal(false)}
                className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
              >
                Save Entry
              </button>
            </div>
          </form>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-5 rounded-2xl border border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-850 space-y-2 hover:border-stone-200 dark:hover:border-stone-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{entry.date}</span>
                  {entry.sessionTitle && (
                    <>
                      <span>·</span>
                      <span className="text-stone-700 dark:text-stone-300 font-sans font-medium">
                        {entry.sessionTitle}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Mood: {entry.moodScore}/5 · {entry.moodLabel}
                </span>
              </div>

              {entry.intention && (
                <div className="text-xs text-stone-600 dark:text-stone-400 italic">
                  Anchor Intention: "{entry.intention}"
                </div>
              )}

              <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-sans pt-1">
                {entry.reflectionText}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
