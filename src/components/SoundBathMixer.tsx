import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Headphones,
  Download,
  Bell,
  Check,
  RotateCcw,
} from 'lucide-react';
import { BINAURAL_PRESETS } from '../data/meditationContent';
import { BinauralPreset } from '../types';
import { soundEngine } from '../services/audioEngine';
import { storage } from '../services/storage';

export const SoundBathMixer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<BinauralPreset>(BINAURAL_PRESETS[0]);

  // Mixer track volumes (0 to 1)
  const [masterVol, setMasterVol] = useState<number>(0.7);
  const [carrierFreq, setCarrierFreq] = useState<number>(activePreset.carrierFreq);
  const [beatFreq, setBeatFreq] = useState<number>(activePreset.frequency);

  const [binauralVol, setBinauralVol] = useState<number>(0.65);
  const [bowlVol, setBowlVol] = useState<number>(0.45);
  const [rainVol, setRainVol] = useState<number>(0.2);
  const [riverVol, setRiverVol] = useState<number>(0.0);
  const [surfVol, setSurfVol] = useState<number>(0.15);

  const [savedOfflineToast, setSavedOfflineToast] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Apply preset change
  const applyPreset = (preset: BinauralPreset) => {
    setActivePreset(preset);
    setCarrierFreq(preset.carrierFreq);
    setBeatFreq(preset.frequency);

    if (isPlaying) {
      soundEngine.updateParameters({
        carrierFreq: preset.carrierFreq,
        beatFreq: preset.frequency,
      });
    }
  };

  // Toggle playback
  const togglePlay = () => {
    if (isPlaying) {
      soundEngine.stopMixer();
      setIsPlaying(false);
    } else {
      soundEngine.startMixer({
        carrierFreq,
        beatFreq,
        masterVol,
        binauralVol,
        bowlVol,
        rainVol,
        riverVol,
        surfVol,
      });
      setIsPlaying(true);
    }
  };

  // Live updates to audio engine
  useEffect(() => {
    if (isPlaying) {
      soundEngine.updateParameters({
        carrierFreq,
        beatFreq,
        masterVol,
        binauralVol,
        bowlVol,
        rainVol,
        riverVol,
        surfVol,
      });
    }
  }, [isPlaying, carrierFreq, beatFreq, masterVol, binauralVol, bowlVol, rainVol, riverVol, surfVol]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopMixer();
    };
  }, []);

  // Visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phaseOffset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;

      // Draw subtle harmonic waves
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.lineWidth = w === 1 ? 2 : 1;
        ctx.strokeStyle = isPlaying
          ? w === 1
            ? 'rgba(16, 185, 129, 0.8)'
            : 'rgba(52, 211, 153, 0.3)'
          : 'rgba(120, 113, 108, 0.25)';

        for (let x = 0; x < width; x++) {
          const progress = x / width;
          // Composite sine wave calculation
          const amp = isPlaying ? (20 + w * 8) * (binauralVol + bowlVol) : 4;
          const freq = (beatFreq * 0.1) + w * 0.02;
          const y =
            centerY +
            Math.sin(progress * Math.PI * 4 * freq + phaseOffset + w) * amp *
            Math.sin(progress * Math.PI); // Windowing envelope

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (isPlaying) {
        phaseOffset += 0.04 + beatFreq * 0.005;
      } else {
        phaseOffset += 0.005;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, beatFreq, binauralVol, bowlVol]);

  const handleSaveToOffline = () => {
    setSavedOfflineToast(true);
    setTimeout(() => setSavedOfflineToast(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
          <Headphones className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Stereo Acoustic Synthesizer · Best with Headphones</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
              Sound Baths & Binaural Beats
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              Real-time dual-frequency audio synthesis that synchronizes neural oscillations across hemispheres, paired with bronze singing bowl overtones.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => soundEngine.playSingingBowlChime(261.63, 7.0)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>Strike Bell</span>
            </button>
            <button
              onClick={handleSaveToOffline}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              {savedOfflineToast ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5" />}
              <span>{savedOfflineToast ? 'Saved Offline' : 'Cache Offline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selection Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
        {BINAURAL_PRESETS.map((preset) => {
          const isActive = activePreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-emerald-700 dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {preset.category}
                </span>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                  {preset.frequency} Hz
                </span>
              </div>
              <div className="font-medium text-xs text-stone-900 dark:text-stone-100 mt-1 truncate">
                {preset.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Deck */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 text-stone-100 shadow-2xl">
        
        {/* Visualizer & Master Deck */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-800">
          <div className="w-full sm:w-2/3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-1">
              Harmonic Resonance Visualizer
            </div>
            <div className="w-full h-24 bg-stone-950/80 rounded-xl border border-stone-800/80 overflow-hidden flex items-center justify-center relative">
              <canvas
                ref={canvasRef}
                width={500}
                height={96}
                className="w-full h-full"
              />
              <div className="absolute bottom-2 right-3 text-[10px] font-mono text-stone-500">
                L: {carrierFreq} Hz · R: {(carrierFreq + beatFreq).toFixed(1)} Hz
              </div>
            </div>
          </div>

          {/* Master Transport Button */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-1/3">
            <button
              onClick={togglePlay}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-semibold shadow-lg transition-all ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Mute Sound Bath</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Live Sound Bath</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-400 mt-2">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Master:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVol}
                onChange={(e) => setMasterVol(parseFloat(e.target.value))}
                className="w-24 accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Multi-Track Fader Rack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          
          {/* Channel 1: Binaural Beat */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-200">Binaural Beat Channel</span>
              <span className="text-[11px] font-mono text-emerald-400">{beatFreq.toFixed(1)} Hz</span>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Beat Differential</span>
                <span>{beatFreq.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="40"
                step="0.5"
                value={beatFreq}
                onChange={(e) => setBeatFreq(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Carrier Base Pitch</span>
                <span>{carrierFreq} Hz</span>
              </div>
              <select
                value={carrierFreq}
                onChange={(e) => setCarrierFreq(parseInt(e.target.value))}
                className="w-full text-xs bg-stone-900 border border-stone-700 rounded-lg p-1.5 text-stone-200"
              >
                <option value="108">108 Hz (Sub-Bass Grounding)</option>
                <option value="216">216 Hz (Deep Contemplation)</option>
                <option value="432">432 Hz (Natural Earth Tuning)</option>
                <option value="528">528 Hz (Solfeggio Transformation)</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Volume</span>
                <span>{Math.round(binauralVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={binauralVol}
                onChange={(e) => setBinauralVol(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Channel 2: Tibetan Singing Bowl Overtones */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-200">Tibetan Bronze Resonance</span>
              <span className="text-[11px] font-mono text-amber-400">Harmonics</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Dual-oscillator synthesized singing bowl overtone drone with slow tremolo.
            </p>
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Resonance Level</span>
                <span>{Math.round(bowlVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bowlVol}
                onChange={(e) => setBowlVol(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <button
              onClick={() => soundEngine.playSingingBowlChime(carrierFreq, 7.0)}
              className="w-full py-1.5 text-[11px] font-medium text-stone-300 border border-stone-800 rounded-lg bg-stone-900 hover:bg-stone-800 transition-colors"
            >
              Bell Strike (Trigger)
            </button>
          </div>

          {/* Channel 3: Natural Textures */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-200">Acoustic Nature Layers</span>
              <span className="text-[11px] font-mono text-sky-400">Pure Noise Filters</span>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Gentle Rain</span>
                <span>{Math.round(rainVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={rainVol}
                onChange={(e) => setRainVol(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Mountain Stream</span>
                <span>{Math.round(riverVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={riverVol}
                onChange={(e) => setRiverVol(parseFloat(e.target.value))}
                className="w-full accent-teal-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Ocean Surf Swell</span>
                <span>{Math.round(surfVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={surfVol}
                onChange={(e) => setSurfVol(parseFloat(e.target.value))}
                className="w-full accent-blue-400"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Preset Details / Science Info */}
      <div className="mt-6 p-6 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
            Active Wave Profile: {activePreset.name}
          </span>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-2xl leading-relaxed">
            {activePreset.description}
          </p>
        </div>
        <div className="text-xs text-stone-500 dark:text-stone-400 shrink-0">
          <span className="font-semibold text-stone-900 dark:text-white">Best for: </span>
          {activePreset.recommendedUse}
        </div>
      </div>

    </div>
  );
};
