import React, { useState } from 'react';
import { X, Sparkles, Clock, Compass, ArrowRight, Check } from 'lucide-react';
import { MEDITATION_SESSIONS, BREATHING_PATTERNS } from '../data/meditationContent';
import { MeditationSession } from '../types';

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (session: MeditationSession) => void;
  onSelectBreathing?: (patternId: string) => void;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 'result'>(1);
  const [mood, setMood] = useState<string>('anxious');
  const [duration, setDuration] = useState<number>(10);
  const [intention, setIntention] = useState<string>('calm');

  if (!isOpen) return null;

  const moodOptions = [
    { id: 'anxious', label: 'Restless or Anxious', description: 'Overactive nervous system, shallow breath, tension' },
    { id: 'foggy', label: 'Overwhelmed or Racing Mind', description: 'Cognitive clutter, mental chatter, multi-tasking fatigue' },
    { id: 'exhausted', label: 'Fatigued or Drained', description: 'Low energy, heaviness, needing gentle restorative rest' },
    { id: 'neutral', label: 'Neutral & Present', description: 'Seeking a peaceful sanctuary pause to maintain equilibrium' },
    { id: 'grateful', label: 'Grateful & Expansive', description: 'Ready to deepen heart presence and loving-kindness' },
  ];

  const durationOptions = [
    { minutes: 5, label: '5 min', desc: 'Quick micro-reset' },
    { minutes: 7, label: '7 min', desc: 'Focused somatic pause' },
    { minutes: 10, label: '10 min', desc: 'Balanced daily practice' },
    { minutes: 15, label: '15 min', desc: 'Deep acoustic immersion' },
    { minutes: 20, label: '20 min', desc: 'Full restorative descent' },
  ];

  const intentionOptions = [
    { id: 'calm', label: 'Calm the Nervous System', sub: 'Activate the parasympathetic brake' },
    { id: 'focus', label: 'Sharp Clarity & Presence', sub: 'Anchor attention and clear cognitive fog' },
    { id: 'sleep', label: 'Somatic Recovery & Rest', sub: 'Deep relaxation akin to restorative sleep' },
    { id: 'compassion', label: 'Heart Opening & Softness', sub: 'Release self-criticism and cultivate warmth' },
    { id: 'breath', label: 'Paced Breathwork Reset', sub: 'Cardiorespiratory nervous balance' },
  ];

  // Match optimal session
  const getPersonalizedRecommendation = (): { session: MeditationSession; rationale: string; soundTip: string } => {
    let matched = MEDITATION_SESSIONS[0];
    let rationale = 'Anchors wandering attention to the physical sensation of the breath.';
    let soundTip = 'Paired with 10 Hz Alpha waves to foster relaxed mental flow.';

    if (mood === 'anxious' || intention === 'calm') {
      matched = MEDITATION_SESSIONS.find(s => s.id === 'vagus-nerve-anxiety-relief') || MEDITATION_SESSIONS[0];
      rationale = 'Designed to stimulate the vagus nerve and slow elevated heart rate within minutes.';
      soundTip = 'Paired with Mountain Stream noise and 6 Hz Theta binaural waves.';
    } else if (mood === 'exhausted' || intention === 'sleep') {
      matched = MEDITATION_SESSIONS.find(s => s.id === 'deep-rest-yoga-nidra') || MEDITATION_SESSIONS[2];
      rationale = 'Systematically unwinds somatic tension points without requiring mental exertion.';
      soundTip = 'Paired with 2 Hz Delta wave drone for neuro-recovery.';
    } else if (mood === 'grateful' || intention === 'compassion') {
      matched = MEDITATION_SESSIONS.find(s => s.id === 'loving-kindness-metta') || MEDITATION_SESSIONS[3];
      rationale = 'Expands warmth across the heart center, dissolving judgment and isolation.';
      soundTip = 'Paired with 528 Hz Solfeggio heart resonance frequency.';
    } else if (intention === 'focus') {
      matched = MEDITATION_SESSIONS.find(s => s.id === 'zen-zazen-shikantaza') || MEDITATION_SESSIONS[0];
      rationale = 'Quiet non-attachment practice that clears mental chatter without forced concentration.';
      soundTip = 'Paired with Gentle Rain and 10 Hz Alpha frequency.';
    } else if (duration >= 15) {
      matched = MEDITATION_SESSIONS.find(s => s.id === 'tibetan-singing-bowl-bath') || MEDITATION_SESSIONS[1];
      rationale = 'Immersive Tibetan bronze acoustic harmonics that wash away visceral stress.';
      soundTip = 'Real harmonic overtones at 216 Hz carrier pitch.';
    }

    return { session: matched, rationale, soundTip };
  };

  const recommendation = getPersonalizedRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step !== 'result' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">
              <span>Step 0{step} of 03</span>
              <span aria-hidden="true">·</span>
              <span>Daily Alignment</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-emerald-700 dark:bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Mood */}
        {step === 1 && (
          <div>
            <h3 className="font-serif text-2xl font-medium tracking-tight mb-2 text-stone-900 dark:text-stone-100">
              How is your inner weather today?
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
              Honest awareness is the foundation of mindful practice.
            </p>
            <div className="space-y-2.5">
              {moodOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMood(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    mood === opt.id
                      ? 'border-emerald-700 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-stone-900 dark:text-stone-100">{opt.label}</span>
                    {mood === opt.id && <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{opt.description}</p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded-lg hover:bg-stone-800 dark:hover:bg-white transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Time Available */}
        {step === 2 && (
          <div>
            <h3 className="font-serif text-2xl font-medium tracking-tight mb-2 text-stone-900 dark:text-stone-100">
              How much time do you have to pause?
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
              Even a 5-minute conscious breath alters autonomic tone.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {durationOptions.map((opt) => (
                <button
                  key={opt.minutes}
                  onClick={() => setDuration(opt.minutes)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    duration === opt.minutes
                      ? 'border-emerald-700 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-base text-stone-900 dark:text-stone-100">{opt.label}</span>
                    {duration === opt.minutes && <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded-lg hover:bg-stone-800 dark:hover:bg-white transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Intention */}
        {step === 3 && (
          <div>
            <h3 className="font-serif text-2xl font-medium tracking-tight mb-2 text-stone-900 dark:text-stone-100">
              What is your primary intention?
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
              Aligning intention directs mental energy where it is most needed.
            </p>
            <div className="space-y-2.5">
              {intentionOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setIntention(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    intention === opt.id
                      ? 'border-emerald-700 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-stone-900 dark:text-stone-100">{opt.label}</span>
                    {intention === opt.id && <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep('result')}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded-lg hover:bg-stone-800 dark:hover:bg-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 dark:text-emerald-700" />
                <span>Craft My Session</span>
              </button>
            </div>
          </div>
        )}

        {/* Step: Result Recommendation */}
        {step === 'result' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored For Your State</span>
            </div>
            <h3 className="font-serif text-2xl font-medium tracking-tight mb-4 text-stone-900 dark:text-stone-100">
              {recommendation.session.title}
            </h3>

            <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 mb-5 space-y-3">
              <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                <span className="font-semibold text-stone-900 dark:text-white">Why this session: </span>
                {recommendation.rationale}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                <span className="font-semibold text-stone-900 dark:text-white">Acoustic resonance: </span>
                {recommendation.soundTip}
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-500 pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {Math.round(recommendation.session.durationSeconds / 60)} min
                </span>
                <span>·</span>
                <span>{recommendation.session.tradition}</span>
                <span>·</span>
                <span>Guide: {recommendation.session.guideName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-medium"
              >
                Change Answers
              </button>
              <button
                onClick={() => {
                  onClose();
                  onStartSession(recommendation.session);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-stone-950 text-xs font-semibold rounded-lg shadow-md transition-colors"
              >
                <span>Begin Guided Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
