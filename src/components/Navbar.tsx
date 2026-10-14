import React from 'react';
import { Sparkles, Moon, Sun, Download, WifiOff } from 'lucide-react';
import { ElevateLogo } from './ElevateLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCheckin: () => void;
  onOpenOffline: () => void;
  isOfflineMode: boolean;
  downloadedCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCheckin,
  onOpenOffline,
  isOfflineMode,
  downloadedCount,
  darkMode,
  setDarkMode,
}) => {
  const navItems = [
    { id: 'sanctuary', label: 'Daily Sanctuary' },
    { id: 'affirmations', label: 'Affirmations' },
    { id: 'breathing', label: 'Breathwork' },
    { id: 'sound-bath', label: 'Sound Bath' },
    { id: 'song-studio', label: 'Song Studio' },
    { id: 'traditions', label: 'Traditions' },
    { id: 'movement', label: 'Movement' },
    { id: 'places', label: 'Sacred Map' },
    { id: 'progress', label: 'Progress' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand Wordmark with official Elevate Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('sanctuary')}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <ElevateLogo className="w-[26px] h-[26px] shrink-0 group-hover:scale-105 transition-transform" />
              <span className="font-sans text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap shrink-0 leading-tight">
                Elevate-Mindfulness
              </span>
            </button>
            {isOfflineMode && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/60 px-2 py-0.5 rounded">
                <WifiOff className="w-3 h-3" /> Offline Active
              </span>
            )}
          </div>

          {/* Zone 2: Single-line Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-400">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-stone-900 dark:text-stone-100 font-semibold'
                      : 'hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 dark:bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Offline / Theme controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Offline drawer trigger */}
            <button
              onClick={onOpenOffline}
              title="Offline Downloads"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline</span>
              {downloadedCount > 0 && (
                <span className="text-[10px] font-mono px-1 py-0.2 bg-stone-200 dark:bg-stone-800 rounded">
                  {downloadedCount}
                </span>
              )}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors shrink-0"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenCheckin}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-950 rounded-lg hover:bg-stone-800 dark:hover:bg-white shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 dark:text-emerald-700" />
              <span>Daily Check-in</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation scroll bar */}
        <div className="flex lg:hidden overflow-x-auto no-scrollbar py-2.5 border-t border-stone-200/60 dark:border-stone-800/60 gap-4 text-xs font-medium text-stone-600 dark:text-stone-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 px-2 py-1 rounded-md transition-colors ${
                activeTab === item.id
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
