export type MeditationCategory =
  | 'mindfulness'
  | 'focus'
  | 'sleep'
  | 'anxiety'
  | 'compassion'
  | 'sound-bath'
  | 'breathwork';

export interface MeditationStep {
  timeOffset: number; // in seconds
  cue: string;
  transcription: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  subtitle: string;
  tradition: string; // Vipassana, Zen, Metta, Yoga Nidra, etc.
  durationSeconds: number;
  category: MeditationCategory;
  description: string;
  guideName: string;
  audioTheme: 'tibetan-bowls' | 'crystal-resonance' | 'stream-flow' | 'deep-drone' | 'rain-silence';
  image: string;
  steps: MeditationStep[];
  isOfflineAvailable?: boolean;
  intensity?: 'Gentle' | 'Moderate' | 'Deep Immersion' | 'Restorative';
}

export interface BreathingPattern {
  id: string;
  name: string;
  subtitle: string;
  tradition: string;
  description: string;
  inhale: number; // seconds
  hold1: number;
  exhale: number;
  hold2: number;
  defaultRounds: number;
  benefits: string[];
  themeColor: string;
}

export interface BinauralPreset {
  id: string;
  name: string;
  category: 'Delta' | 'Theta' | 'Alpha' | 'Beta' | 'Gamma' | 'Solfeggio';
  frequency: number; // Hz beat frequency (e.g. 10 Hz for Alpha)
  carrierFreq: number; // base Hz (e.g. 432 Hz)
  description: string;
  recommendedUse: string;
  solfeggioName?: string;
}

export interface SpiritualPlace {
  id: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  category: 'Zen Temple' | 'Mountain Sanctuary' | 'Sacred Water' | 'Sound Dome' | 'Ancient Forest';
  description: string;
  acousticProfile: {
    silenceRating: number; // percentage
    reverbSeconds: number;
    ambientSound: string;
  };
  bestTime: string;
  image: string;
  history: string;
  meditationGuidance: string;
  isBookmarked?: boolean;
}

export interface MovementPosture {
  name: string;
  durationSec: number;
  instructions: string[];
  breathCue: string;
  alignmentTip: string;
}

export interface MindfulMovementRoutine {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  category: 'Spinal Awakening' | 'Desk Decompression' | 'Yin Release' | 'Qigong Energy' | 'Somatic Reset';
  difficulty: 'Gentle' | 'All Levels' | 'Restorative';
  benefits: string[];
  postures: MovementPosture[];
  description: string;
}

export interface MeditationTradition {
  id: string;
  name: string;
  origin: string;
  historicalPeriod: string;
  corePhilosophy: string;
  scientificBenefits: string[];
  postureGuide: string;
  stepsToPractice: string[];
  recommendedSessionId: string;
}

export interface SessionLog {
  id: string;
  sessionId: string;
  sessionTitle: string;
  category: string;
  completedAt: string; // ISO
  durationMinutes: number;
  moodBefore?: number; // 1-5
  moodAfter?: number; // 1-5
  journalReflection?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  sessionId?: string;
  sessionTitle?: string;
  moodScore: number; // 1 to 5
  moodLabel: string;
  reflectionText: string;
  intention?: string;
}

export interface UserStats {
  totalMinutes: number;
  totalSessions: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  weeklyMinutes: { [dayOfWeek: string]: number }; // Mon, Tue, etc.
  achievements: string[];
  downloadedSessionIds: string[];
  bookmarkedPlaceIds: string[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requiredMetric: string;
}

export interface CreatedSong {
  id: string;
  title: string;
  type: 'lyria' | 'acoustic-composer';
  prompt?: string;
  model?: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  audioBase64?: string;
  audioUrl?: string;
  mimeType?: string;
  lyrics?: string;
  createdAt: string;
  durationSec: number;
  scaleName?: string;
  instrument?: string;
  bpm?: number;
  gridPattern?: boolean[][];
  notes?: number[];
  isDownloaded?: boolean;
}

export interface DailyAffirmation {
  id: string;
  text: string;
  category: 'Inner Peace' | 'Self-Compassion' | 'Clarity & Focus' | 'Grounding' | 'Sleep & Release' | 'Courage';
  contemplation: string;
  breathAnchor: {
    inhale: string;
    exhale: string;
  };
  isFavorite?: boolean;
  isCustom?: boolean;
}


