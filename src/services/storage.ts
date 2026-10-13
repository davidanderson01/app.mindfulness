import { UserStats, SessionLog, JournalEntry, SpiritualPlace, CreatedSong, DailyAffirmation } from '../types';

const STATS_KEY = 'satori_user_stats';
const LOGS_KEY = 'satori_session_logs';
const JOURNAL_KEY = 'satori_journal_entries';
const CUSTOM_PLACES_KEY = 'satori_custom_places';
const OFFLINE_MODE_KEY = 'satori_offline_simulation';
const CREATED_SONGS_KEY = 'elevate_created_songs';
const CUSTOM_AFFIRMATIONS_KEY = 'elevate_custom_affirmations';
const FAVORITE_AFFIRMATIONS_KEY = 'elevate_favorite_affirmations';

const DEFAULT_STATS: UserStats = {
  totalMinutes: 74,
  totalSessions: 8,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  weeklyMinutes: {
    Mon: 15,
    Tue: 20,
    Wed: 10,
    Thu: 15,
    Fri: 14,
    Sat: 0,
    Sun: 0,
  },
  achievements: ['first_breath', '3day_stillness', 'sound_voyager'],
  downloadedSessionIds: ['daily-mindfulness-breath', 'tibetan-singing-bowl-bath', 'deep-rest-yoga-nidra'],
  bookmarkedPlaceIds: ['ryoan-ji', 'mount-shasta'],
};

const DEFAULT_LOGS: SessionLog[] = [
  {
    id: 'log-1',
    sessionId: 'daily-mindfulness-breath',
    sessionTitle: 'Awakening Stillness & Clarity',
    category: 'mindfulness',
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    durationMinutes: 10,
    moodBefore: 2,
    moodAfter: 5,
    journalReflection: 'Felt my nervous system settle into quietude within 4 minutes. A noticeable release behind the eyes.',
  },
  {
    id: 'log-2',
    sessionId: 'tibetan-singing-bowl-bath',
    sessionTitle: 'Himalayan Singing Bowl Sound Bath',
    category: 'sound-bath',
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    durationMinutes: 15,
    moodBefore: 3,
    moodAfter: 5,
    journalReflection: 'The overtone resonance washed away morning static. Highly resonant vibrations.',
  },
];

const DEFAULT_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    sessionId: 'tibetan-singing-bowl-bath',
    sessionTitle: 'Himalayan Singing Bowl Sound Bath',
    moodScore: 5,
    moodLabel: 'Deeply Serene',
    reflectionText: 'Finding spaciousness between thoughts. Breath flowed naturally without forcing.',
    intention: 'Cultivate inner calm throughout the afternoon',
  },
  {
    id: 'j-2',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    sessionId: 'box-breathing',
    sessionTitle: 'Box Breathing Stress Reset',
    moodScore: 4,
    moodLabel: 'Grounded & Centered',
    reflectionText: 'Steady 4-4-4-4 rhythm brought clarity before an intensive work block.',
    intention: 'Patience and presence',
  },
];

export const storage = {
  getStats(): UserStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (!data) {
        localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
        return DEFAULT_STATS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_STATS;
    }
  },

  saveStats(stats: UserStats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignored
    }
  },

  recordSessionCompletion(params: {
    sessionId: string;
    sessionTitle: string;
    category: string;
    durationMinutes: number;
    moodBefore?: number;
    moodAfter?: number;
    reflection?: string;
  }): { stats: UserStats; log: SessionLog; newBadge?: string } {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = dayNames[new Date().getDay()];

    // Streak logic
    if (stats.lastActiveDate !== today) {
      const lastDate = new Date(stats.lastActiveDate);
      const diffDays = Math.round((new Date(today).getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        stats.streakDays += 1;
      } else if (diffDays > 1) {
        stats.streakDays = 1;
      }
      stats.lastActiveDate = today;
    }

    stats.totalMinutes += params.durationMinutes;
    stats.totalSessions += 1;
    stats.weeklyMinutes[currentDay] = (stats.weeklyMinutes[currentDay] || 0) + params.durationMinutes;

    let newBadge: string | undefined = undefined;
    if (stats.totalMinutes >= 100 && !stats.achievements.includes('century_stillness')) {
      stats.achievements.push('century_stillness');
      newBadge = 'Century of Stillness (100+ Min)';
    }
    if (stats.streakDays >= 7 && !stats.achievements.includes('week_zen')) {
      stats.achievements.push('week_zen');
      newBadge = '7-Day Sanctuary Habit';
    }

    this.saveStats(stats);

    const log: SessionLog = {
      id: `log-${Date.now()}`,
      sessionId: params.sessionId,
      sessionTitle: params.sessionTitle,
      category: params.category,
      completedAt: new Date().toISOString(),
      durationMinutes: params.durationMinutes,
      moodBefore: params.moodBefore,
      moodAfter: params.moodAfter,
      journalReflection: params.reflection,
    };

    const logs = this.getSessionLogs();
    logs.unshift(log);
    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch {
      // Ignored
    }

    if (params.reflection && params.reflection.trim().length > 0) {
      this.addJournalEntry({
        date: today,
        sessionId: params.sessionId,
        sessionTitle: params.sessionTitle,
        moodScore: params.moodAfter || 4,
        moodLabel: this.getMoodLabel(params.moodAfter || 4),
        reflectionText: params.reflection,
      });
    }

    return { stats, log, newBadge };
  },

  getSessionLogs(): SessionLog[] {
    try {
      const data = localStorage.getItem(LOGS_KEY);
      if (!data) return DEFAULT_LOGS;
      return JSON.parse(data);
    } catch {
      return DEFAULT_LOGS;
    }
  },

  getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(JOURNAL_KEY);
      if (!data) return DEFAULT_JOURNAL;
      return JSON.parse(data);
    } catch {
      return DEFAULT_JOURNAL;
    }
  },

  addJournalEntry(entry: Omit<JournalEntry, 'id'>): JournalEntry {
    const fullEntry: JournalEntry = {
      ...entry,
      id: `j-${Date.now()}`,
    };
    const entries = this.getJournalEntries();
    entries.unshift(fullEntry);
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    } catch {
      // Ignored
    }
    return fullEntry;
  },

  toggleSessionDownload(sessionId: string): boolean {
    const stats = this.getStats();
    let isNowDownloaded = false;
    if (stats.downloadedSessionIds.includes(sessionId)) {
      stats.downloadedSessionIds = stats.downloadedSessionIds.filter(id => id !== sessionId);
      isNowDownloaded = false;
    } else {
      stats.downloadedSessionIds.push(sessionId);
      isNowDownloaded = true;
    }
    this.saveStats(stats);
    return isNowDownloaded;
  },

  toggleBookmarkPlace(placeId: string): boolean {
    const stats = this.getStats();
    let isBookmarked = false;
    if (stats.bookmarkedPlaceIds.includes(placeId)) {
      stats.bookmarkedPlaceIds = stats.bookmarkedPlaceIds.filter(id => id !== placeId);
      isBookmarked = false;
    } else {
      stats.bookmarkedPlaceIds.push(placeId);
      isBookmarked = true;
    }
    this.saveStats(stats);
    return isBookmarked;
  },

  getCustomPlaces(): SpiritualPlace[] {
    try {
      const data = localStorage.getItem(CUSTOM_PLACES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addCustomPlace(place: SpiritualPlace) {
    const places = this.getCustomPlaces();
    places.unshift(place);
    try {
      localStorage.setItem(CUSTOM_PLACES_KEY, JSON.stringify(places));
    } catch {
      // Ignored
    }
  },

  getMoodLabel(score: number): string {
    switch (score) {
      case 1: return 'Distressed / Agitated';
      case 2: return 'Restless / Anxious';
      case 3: return 'Neutral / Grounding';
      case 4: return 'Calm & Centered';
      case 5: return 'Deeply Serene & Clear';
      default: return 'Serene';
    }
  },

  isOfflineMode(): boolean {
    try {
      return localStorage.getItem(OFFLINE_MODE_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setOfflineMode(enabled: boolean) {
    try {
      localStorage.setItem(OFFLINE_MODE_KEY, enabled ? 'true' : 'false');
    } catch {
      // Ignored
    }
  },

  getCreatedSongs(): CreatedSong[] {
    try {
      const data = localStorage.getItem(CREATED_SONGS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    // Default initial curated songs
    const defaults: CreatedSong[] = [
      {
        id: 'song-seed-1',
        title: 'Shakuhachi Wind Over Bamboo',
        type: 'acoustic-composer',
        scaleName: 'Hirajoshi (Zen Scale)',
        instrument: 'Shakuhachi Flute & Singing Bowls',
        bpm: 52,
        durationSec: 30,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lyrics: 'Procedural contemplative pentatonic melody woven with organic wooden wind acoustics.',
        notes: [0, 2, 4, 1, 3, 2, 0, 4],
        isDownloaded: true,
      },
      {
        id: 'song-seed-2',
        title: 'Celestial 432 Hz Solfeggio Hymn',
        type: 'acoustic-composer',
        scaleName: 'Solfeggio Harmonic (432 Hz)',
        instrument: 'Crystal Chimes & Ocean Swell',
        bpm: 46,
        durationSec: 30,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        lyrics: 'Warm crystal overtones synchronized to natural earth resonance.',
        notes: [2, 0, 3, 1, 4, 2, 1, 0],
        isDownloaded: true,
      },
    ];
    try {
      localStorage.setItem(CREATED_SONGS_KEY, JSON.stringify(defaults));
    } catch {}
    return defaults;
  },

  saveCreatedSong(song: CreatedSong) {
    const list = this.getCreatedSongs();
    const updated = [song, ...list.filter((s) => s.id !== song.id)];
    try {
      localStorage.setItem(CREATED_SONGS_KEY, JSON.stringify(updated.slice(0, 30)));
    } catch {}
  },

  deleteCreatedSong(id: string) {
    const list = this.getCreatedSongs();
    const updated = list.filter((s) => s.id !== id);
    try {
      localStorage.setItem(CREATED_SONGS_KEY, JSON.stringify(updated));
    } catch {}
  },

  getCustomAffirmations(): DailyAffirmation[] {
    try {
      const data = localStorage.getItem(CUSTOM_AFFIRMATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomAffirmation(aff: DailyAffirmation) {
    const list = this.getCustomAffirmations();
    const updated = [aff, ...list.filter((a) => a.id !== aff.id)];
    try {
      localStorage.setItem(CUSTOM_AFFIRMATIONS_KEY, JSON.stringify(updated));
    } catch {}
  },

  getFavoriteAffirmationIds(): string[] {
    try {
      const data = localStorage.getItem(FAVORITE_AFFIRMATIONS_KEY);
      return data ? JSON.parse(data) : ['aff-peace-1', 'aff-compassion-1'];
    } catch {
      return ['aff-peace-1', 'aff-compassion-1'];
    }
  },

  toggleFavoriteAffirmation(id: string): boolean {
    const favs = this.getFavoriteAffirmationIds();
    let isNowFav = false;
    let updated: string[];
    if (favs.includes(id)) {
      updated = favs.filter((f) => f !== id);
      isNowFav = false;
    } else {
      updated = [...favs, id];
      isNowFav = true;
    }
    try {
      localStorage.setItem(FAVORITE_AFFIRMATIONS_KEY, JSON.stringify(updated));
    } catch {}
    return isNowFav;
  }
};
