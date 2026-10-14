import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  Trash2,
  Check,
  Disc,
  Sliders,
  Wand2,
  Headphones,
  Info,
  Clock,
  Radio,
} from 'lucide-react';
import { CreatedSong } from '../types';
import { soundEngine } from '../services/audioEngine';
import { storage } from '../services/storage';
import { ElevateLogo } from './ElevateLogo';

interface SongStudioProps {
  onOpenPaidKeyFlow?: () => void;
}

// Contemplative Scales (in Hz)
const SCALES: {
  [key: string]: {
    name: string;
    description: string;
    notes: { name: string; freq: number }[];
  };
} = {
  hirajoshi: {
    name: 'Hirajoshi (Japanese Zen)',
    description: 'Traditional Japanese pentatonic tuning known for serene stillness and longing.',
    notes: [
      { name: 'C4', freq: 261.63 },
      { name: 'Db4', freq: 277.18 },
      { name: 'F4', freq: 349.23 },
      { name: 'G4', freq: 392.00 },
      { name: 'Ab4', freq: 415.30 },
      { name: 'C5', freq: 523.25 },
    ],
  },
  solfeggio432: {
    name: '432 Hz Solfeggio Harmonic',
    description: 'Harmonically aligned with the mathematical Golden Ratio and Earth resonance.',
    notes: [
      { name: '216 Hz', freq: 216.0 },
      { name: '288 Hz', freq: 288.0 },
      { name: '324 Hz', freq: 324.0 },
      { name: '432 Hz', freq: 432.0 },
      { name: '528 Hz', freq: 528.0 },
      { name: '648 Hz', freq: 648.0 },
    ],
  },
  insen: {
    name: 'Insen (Shakuhachi Flute)',
    description: 'Contemplative scale historically blown by Komuso monks in Buddhist practice.',
    notes: [
      { name: 'C4', freq: 261.63 },
      { name: 'Db4', freq: 277.18 },
      { name: 'F4', freq: 349.23 },
      { name: 'G4', freq: 392.00 },
      { name: 'Bb4', freq: 466.16 },
      { name: 'C5', freq: 523.25 },
    ],
  },
  ragaBhupali: {
    name: 'Raga Bhupali (Dawn Awakening)',
    description: 'Ancient Indian morning raga invoking peace, devotion, and radiant dawn light.',
    notes: [
      { name: 'C4', freq: 261.63 },
      { name: 'D4', freq: 293.66 },
      { name: 'E4', freq: 329.63 },
      { name: 'G4', freq: 392.00 },
      { name: 'A4', freq: 440.00 },
      { name: 'C5', freq: 523.25 },
    ],
  },
};

export const SongStudio: React.FC<SongStudioProps> = ({ onOpenPaidKeyFlow }) => {
  // Mode: 'acoustic' (without Lyria) vs 'lyria' (with Lyria AI)
  const [activeMode, setActiveMode] = useState<'acoustic' | 'lyria'>('acoustic');

  // Acoustic Studio State
  const [selectedScaleKey, setSelectedScaleKey] = useState<string>('hirajoshi');
  const [selectedInstrument, setSelectedInstrument] = useState<
    'crystal-chime' | 'singing-bowl' | 'flute' | 'ambient-pad'
  >('flute');
  const [bpm, setBpm] = useState<number>(50); // slow meditative tempo
  const [isAcousticPlaying, setIsAcousticPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // 6 rows (notes) x 8 columns (steps) grid
  const initialGrid = Array(6)
    .fill(null)
    .map(() => Array(8).fill(false));
  // Default serene melody seed
  initialGrid[0][0] = true;
  initialGrid[2][2] = true;
  initialGrid[4][4] = true;
  initialGrid[1][6] = true;
  const [stepGrid, setStepGrid] = useState<boolean[][]>(initialGrid);
  const [songTitleInput, setSongTitleInput] = useState<string>('Bamboo Stream Meditation');

  // Lyria AI Studio State
  const [lyriaPrompt, setLyriaPrompt] = useState<string>(
    'A 30-second serene meditative track with Japanese bamboo shakuhachi flute, gentle temple bronze singing bowls, and falling mountain rain'
  );
  const [lyriaModel, setLyriaModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [isGeneratingLyria, setIsGeneratingLyria] = useState<boolean>(false);
  const [lyriaError, setLyriaError] = useState<string | null>(null);
  const [latestGeneratedSong, setLatestGeneratedSong] = useState<CreatedSong | null>(null);

  // Audio element for Lyria playback
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isLyriaAudioPlaying, setIsLyriaAudioPlaying] = useState<boolean>(false);

  // User's Created Songs
  const [savedSongs, setSavedSongs] = useState<CreatedSong[]>(() => storage.getCreatedSongs());
  const [activePlayingSongId, setActivePlayingSongId] = useState<string | null>(null);

  const scale = SCALES[selectedScaleKey] || SCALES.hirajoshi;

  // Step sequencer ticker
  useEffect(() => {
    if (!isAcousticPlaying) return;

    const stepDurationMs = (60 / bpm / 2) * 1000; // 8th notes
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % 8;

        // Play active notes at this step
        for (let noteIdx = 0; noteIdx < 6; noteIdx++) {
          if (stepGrid[noteIdx][next]) {
            const freq = scale.notes[noteIdx]?.freq;
            if (freq) {
              soundEngine.playAcousticNote(freq, selectedInstrument, 2.5);
            }
          }
        }

        return next;
      });
    }, stepDurationMs);

    return () => clearInterval(timer);
  }, [isAcousticPlaying, bpm, stepGrid, scale, selectedInstrument]);

  // Toggle grid cell
  const toggleCell = (rowIdx: number, colIdx: number) => {
    const updated = stepGrid.map((row, r) =>
      row.map((cell, c) => (r === rowIdx && c === colIdx ? !cell : cell))
    );
    setStepGrid(updated);

    // Audition sound
    if (!updated[rowIdx][colIdx]) return;
    const freq = scale.notes[rowIdx]?.freq;
    if (freq) {
      soundEngine.playAcousticNote(freq, selectedInstrument, 1.8);
    }
  };

  // Algorithmic Procedural Melody Generator (Zen Weaver)
  const handleWeaveProceduralSong = () => {
    const newGrid = Array(6)
      .fill(null)
      .map(() => Array(8).fill(false));

    // Choose 4-6 contemplative notes using pentatonic harmonic spacing
    const stepPositions = [0, 2, 4, 6];
    stepPositions.forEach((col) => {
      const randomNote = Math.floor(Math.random() * 6);
      newGrid[randomNote][col] = true;
    });

    // Maybe add 1 or 2 syncopations
    if (Math.random() > 0.4) newGrid[Math.floor(Math.random() * 6)][3] = true;
    if (Math.random() > 0.4) newGrid[Math.floor(Math.random() * 6)][7] = true;

    setStepGrid(newGrid);

    // Preview
    soundEngine.playSingingBowlChime(261.63, 4.0);
  };

  // Save current acoustic song
  const handleSaveAcousticSong = () => {
    const song: CreatedSong = {
      id: `song-${Date.now()}`,
      title: songTitleInput || 'Contemplative Melody',
      type: 'acoustic-composer',
      scaleName: scale.name,
      instrument: selectedInstrument.replace('-', ' '),
      bpm,
      durationSec: 32,
      createdAt: new Date().toISOString(),
      gridPattern: stepGrid,
      lyrics: `Composed in ${scale.name} at ${bpm} BPM using ${selectedInstrument}.`,
      isDownloaded: true,
    };

    storage.saveCreatedSong(song);
    setSavedSongs(storage.getCreatedSongs());
    setSongTitleInput('New Meditation Melody');
  };

  // Generate Song using Lyria API
  const handleGenerateLyria = async () => {
    if (!lyriaPrompt.trim()) return;

    setIsGeneratingLyria(true);
    setLyriaError(null);

    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: lyriaPrompt,
          model: lyriaModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate song.');
      }

      // Convert base64 to playable audio blob URL
      const byteCharacters = atob(data.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: data.mimeType || 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      const newSong: CreatedSong = {
        id: `lyria-${Date.now()}`,
        title: lyriaPrompt.slice(0, 36) + '...',
        type: 'lyria',
        prompt: data.prompt,
        model: data.model,
        audioBase64: data.audioBase64,
        audioUrl,
        mimeType: data.mimeType,
        lyrics: data.lyrics,
        createdAt: new Date().toISOString(),
        durationSec: lyriaModel === 'lyria-3-clip-preview' ? 30 : 90,
        isDownloaded: true,
      };

      setLatestGeneratedSong(newSong);
      storage.saveCreatedSong(newSong);
      setSavedSongs(storage.getCreatedSongs());

      // Auto play preview
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.play().catch(() => {});
        setIsLyriaAudioPlaying(true);
      }
    } catch (err: any) {
      console.error(err);
      setLyriaError(err?.message || 'Unable to generate song with Lyria. Please check paid key setup.');
    } finally {
      setIsGeneratingLyria(false);
    }
  };

  // Play a saved song
  const handlePlaySavedSong = (song: CreatedSong) => {
    if (activePlayingSongId === song.id) {
      // Toggle stop
      if (song.type === 'acoustic-composer') {
        setIsAcousticPlaying(false);
      } else if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        setIsLyriaAudioPlaying(false);
      }
      setActivePlayingSongId(null);
      return;
    }

    if (song.type === 'acoustic-composer' && song.gridPattern) {
      setStepGrid(song.gridPattern);
      if (song.bpm) setBpm(song.bpm);
      setIsAcousticPlaying(true);
      setActiveMode('acoustic');
      setActivePlayingSongId(song.id);
    } else if (song.type === 'lyria') {
      if (song.audioBase64) {
        const byteCharacters = atob(song.audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: song.mimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = url;
          audioPlayerRef.current.play().catch(() => {});
          setIsLyriaAudioPlaying(true);
          setActivePlayingSongId(song.id);
        }
      }
    }
  };

  const handleDeleteSavedSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteCreatedSong(id);
    setSavedSongs(storage.getCreatedSongs());
    if (activePlayingSongId === id) {
      setActivePlayingSongId(null);
    }
  };

  const promptInspirations = [
    '30-second tranquil Japanese bamboo shakuhachi flute over gentle mountain rain',
    'Ethereal frosted crystal singing bowls with Tibetan throat drone and warm wind',
    'Ambient warm analog synth pad tuned to 432 Hz for deep sleep and anxiety release',
    'Contemplative Celtic harp arpeggios with soft forest stream water sounds',
    'Minimalist Buddhist temple bell chime with lingering sub-bass harmonic resonance',
  ];

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Hidden audio element for Lyria playback */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => {
          setIsLyriaAudioPlaying(false);
          setActivePlayingSongId(null);
        }}
        onPause={() => setIsLyriaAudioPlaying(false)}
        onPlay={() => setIsLyriaAudioPlaying(true)}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
          <ElevateLogo className="w-4 h-4 shrink-0" />
          <span>Elevate-Mindfulness · Meditation Song Studio</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
              Contemplative Song Studio
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Compose original meditative songs using the interactive Acoustic Zen Composer (100% offline, zero-latency), or generate custom audio tracks with Google Lyria AI music models.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-stone-900 rounded-xl shrink-0">
            <button
              onClick={() => {
                setIsAcousticPlaying(false);
                setActiveMode('acoustic');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeMode === 'acoustic'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Without Lyria (Acoustic Composer)
            </button>
            <button
              onClick={() => {
                setIsAcousticPlaying(false);
                setActiveMode('lyria');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeMode === 'lyria'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              With Lyria (AI Generation)
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: WITHOUT LYRIA - ACOUSTIC COMPOSER */}
      {activeMode === 'acoustic' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl relative overflow-hidden">
            
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Acoustic Pentatonic Sequencer · 100% Offline</span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-white">
                  Contemplative Melody Weaver
                </h3>
              </div>

              {/* Controls strip */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleWeaveProceduralSong}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 transition-colors"
                  title="Algorithmic procedural composition"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Procedural Weave</span>
                </button>

                <button
                  onClick={() => setIsAcousticPlaying(!isAcousticPlaying)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
                    isAcousticPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
                  }`}
                >
                  {isAcousticPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isAcousticPlaying ? 'Pause Loop' : 'Play Song'}</span>
                </button>
              </div>
            </div>

            {/* Scale, Instrument & Tempo Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              {/* Scale */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                  Sacred Tuning Scale
                </label>
                <select
                  value={selectedScaleKey}
                  onChange={(e) => setSelectedScaleKey(e.target.value)}
                  className="w-full text-xs bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:border-emerald-500"
                >
                  {Object.entries(SCALES).map(([key, sc]) => (
                    <option key={key} value={key}>
                      {sc.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-400 mt-1 italic">
                  {scale.description}
                </p>
              </div>

              {/* Instrument */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                  Acoustic Tone Generator
                </label>
                <select
                  value={selectedInstrument}
                  onChange={(e) => setSelectedInstrument(e.target.value as any)}
                  className="w-full text-xs bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="flute">Shakuhachi Bamboo Flute</option>
                  <option value="crystal-chime">Crystal Quartz Chime</option>
                  <option value="singing-bowl">Tibetan Bronze Singing Bowl</option>
                  <option value="ambient-pad">Warm Analog Meditation Pad</option>
                </select>
                <p className="text-[11px] text-stone-400 mt-1">
                  Synthesized via real-time Web Audio API filters and overtones.
                </p>
              </div>

              {/* Meditative Tempo */}
              <div>
                <div className="flex justify-between text-xs font-mono text-stone-400 mb-1.5">
                  <span>Meditative Tempo (BPM)</span>
                  <span className="text-emerald-400">{bpm} BPM</span>
                </div>
                <input
                  type="range"
                  min="36"
                  max="76"
                  step="2"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 mt-2"
                />
                <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                  <span>36 (Trance)</span>
                  <span>56 (Breath)</span>
                  <span>76 (Gentle Flow)</span>
                </div>
              </div>
            </div>

            {/* Interactive 6x8 Sequencer Matrix */}
            <div className="my-6">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
                <span>Tap cells to place or remove notes</span>
                <span>8-Step Loop</span>
              </div>

              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                {scale.notes.map((note, rowIdx) => (
                  <div key={note.name} className="flex items-center gap-2">
                    {/* Note pitch label */}
                    <div className="w-16 text-right text-xs font-mono text-stone-400 shrink-0">
                      {note.name}
                    </div>

                    {/* Step cells */}
                    <div className="flex-1 grid grid-cols-8 gap-1.5 sm:gap-2">
                      {Array.from({ length: 8 }).map((_, colIdx) => {
                        const isNoteActive = stepGrid[rowIdx][colIdx];
                        const isCurrentColumn = isAcousticPlaying && currentStep === colIdx;

                        return (
                          <button
                            key={colIdx}
                            onClick={() => toggleCell(rowIdx, colIdx)}
                            className={`h-9 sm:h-11 rounded-lg border transition-all flex items-center justify-center ${
                              isNoteActive
                                ? 'bg-emerald-600 border-emerald-400 text-stone-950 font-bold shadow-md shadow-emerald-950/40'
                                : isCurrentColumn
                                ? 'bg-stone-800/80 border-stone-600'
                                : 'bg-stone-900/60 border-stone-800/80 hover:border-stone-700'
                            }`}
                          >
                            {isNoteActive && (
                              <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Step indicator footer */}
                <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
                  <div className="w-16" />
                  <div className="flex-1 grid grid-cols-8 gap-1.5 sm:gap-2 text-center text-[10px] font-mono text-stone-500">
                    {Array.from({ length: 8 }).map((_, c) => (
                      <span
                        key={c}
                        className={isAcousticPlaying && currentStep === c ? 'text-emerald-400 font-bold' : ''}
                      >
                        {c + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Song Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-800">
              <input
                type="text"
                value={songTitleInput}
                onChange={(e) => setSongTitleInput(e.target.value)}
                placeholder="Give your song a peaceful title..."
                className="w-full sm:w-72 text-xs px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />

              <button
                onClick={handleSaveAcousticSong}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-semibold rounded-xl shadow-md transition-colors shrink-0"
              >
                Save Song to Sanctuary
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODE 2: WITH LYRIA AI MUSIC GENERATION */}
      {activeMode === 'lyria' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl">
            
            {/* Header */}
            <div className="pb-6 border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google Lyria AI Music Models</span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-white">
                  Generative Sanctuary Music Composer
                </h3>
              </div>

              {/* Model Selector */}
              <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-xl border border-stone-800 shrink-0">
                <button
                  onClick={() => setLyriaModel('lyria-3-clip-preview')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    lyriaModel === 'lyria-3-clip-preview'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Lyria Clip (30s)
                </button>
                <button
                  onClick={() => setLyriaModel('lyria-3-pro-preview')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    lyriaModel === 'lyria-3-pro-preview'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Lyria Pro (Full Track)
                </button>
              </div>
            </div>

            {/* Prompt input area */}
            <div className="my-6 space-y-3">
              <label className="block text-xs font-medium text-stone-300">
                Describe the sonic atmosphere & instruments
              </label>

              <textarea
                rows={3}
                value={lyriaPrompt}
                onChange={(e) => setLyriaPrompt(e.target.value)}
                placeholder="E.g. A 30-second peaceful track with Tibetan singing bowls, cedar flute, and gentle mountain rain..."
                className="w-full text-xs p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />

              {/* Inspiration Chips */}
              <div className="pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-1.5">
                  Try Curated Meditation Prompts:
                </span>
                <div className="flex flex-wrap gap-2">
                  {promptInspirations.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setLyriaPrompt(item)}
                      className="text-[11px] text-stone-400 bg-stone-950/80 hover:bg-stone-800 hover:text-stone-200 border border-stone-800 rounded-lg px-2.5 py-1 text-left transition-colors"
                    >
                      {item.slice(0, 48)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error or Paid Key Notice */}
            {lyriaError && (
              <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Lyria Music Model Notice:</span>
                    <span>{lyriaError}</span>
                  </div>
                </div>
                {onOpenPaidKeyFlow && (
                  <button
                    onClick={onOpenPaidKeyFlow}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded-lg shrink-0 transition-colors"
                  >
                    Select Paid Key
                  </button>
                )}
              </div>
            )}

            {/* Generation CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <span className="text-[11px] font-mono text-stone-500">
                Model: {lyriaModel} · Audio Format: WAV (24kHz Mono)
              </span>

              <button
                onClick={handleGenerateLyria}
                disabled={isGeneratingLyria}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all ${
                  isGeneratingLyria
                    ? 'bg-stone-800 text-stone-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
                }`}
              >
                {isGeneratingLyria ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Track with Lyria...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Music with Lyria</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Song Player Card */}
            {latestGeneratedSong && (
              <div className="mt-6 p-5 rounded-2xl bg-stone-950 border border-emerald-900/60 animate-in fade-in space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                      Generated Audio Result
                    </span>
                    <h4 className="font-serif text-lg font-medium text-white">
                      {latestGeneratedSong.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlaySavedSong(latestGeneratedSong)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-stone-950 text-xs font-semibold"
                    >
                      {isLyriaAudioPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isLyriaAudioPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    {latestGeneratedSong.audioUrl && (
                      <a
                        href={latestGeneratedSong.audioUrl}
                        download="elevate-lyria-song.wav"
                        className="p-1.5 rounded-lg border border-stone-800 text-stone-300 hover:text-white"
                        title="Download WAV File"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {latestGeneratedSong.lyrics && (
                  <p className="text-xs text-stone-400 italic">
                    "{latestGeneratedSong.lyrics}"
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* USER'S SAVED SONGS LIBRARY */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Personal Vault
            </span>
            <h3 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
              Created Songs & Melodies ({savedSongs.length})
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            Available Offline
          </span>
        </div>

        <div className="space-y-3">
          {savedSongs.map((song) => {
            const isPlayingThis = activePlayingSongId === song.id;

            return (
              <div
                key={song.id}
                onClick={() => handlePlaySavedSong(song)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isPlayingThis
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPlayingThis
                        ? 'bg-emerald-600 text-stone-950'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {isPlayingThis ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-100 truncate">
                        {song.title}
                      </h4>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 shrink-0">
                        {song.type === 'lyria' ? 'Lyria AI' : 'Acoustic'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                      <span>{song.scaleName || song.model || 'Ambient'}</span>
                      <span>·</span>
                      <span>{song.instrument || 'AI Synthesizer'}</span>
                      <span>·</span>
                      <span>{song.durationSec}s</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {song.audioUrl && (
                    <a
                      href={song.audioUrl}
                      download={`${song.title}.wav`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                      title="Download Audio File"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={(e) => handleDeleteSavedSong(song.id, e)}
                    className="p-2 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                    title="Delete Song"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
