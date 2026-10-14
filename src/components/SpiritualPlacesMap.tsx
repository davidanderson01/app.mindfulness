import React, { useState } from 'react';
import forestMeditationRetreat from '../assets/images/forest_meditation_retreat_1791924429897.jpg';
import {
  MapPin,
  Compass,
  Bookmark,
  BookmarkCheck,
  Volume2,
  Clock,
  Sparkles,
  Plus,
  Search,
  ZoomIn,
  ZoomOut,
  X,
  Layers,
} from 'lucide-react';
import { SPIRITUAL_PLACES } from '../data/meditationContent';
import { SpiritualPlace } from '../types';
import { storage } from '../services/storage';

export const SpiritualPlacesMap: React.FC = () => {
  const [places, setPlaces] = useState<SpiritualPlace[]>(() => {
    const custom = storage.getCustomPlaces();
    return [...SPIRITUAL_PLACES, ...custom];
  });

  const [selectedPlace, setSelectedPlace] = useState<SpiritualPlace>(SPIRITUAL_PLACES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAddingPlace, setIsAddingPlace] = useState<boolean>(false);

  // Custom place form state
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceLocation, setNewPlaceLocation] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState<'Zen Temple' | 'Mountain Sanctuary' | 'Sacred Water' | 'Sound Dome' | 'Ancient Forest'>('Mountain Sanctuary');
  const [newPlaceDesc, setNewPlaceDesc] = useState('');
  const [newPlaceSilence, setNewPlaceSilence] = useState(95);

  const bookmarkedIds = storage.getStats().bookmarkedPlaceIds;

  const categories = [
    'All',
    'Zen Temple',
    'Mountain Sanctuary',
    'Sacred Water',
    'Sound Dome',
    'Ancient Forest',
    'Bookmarked',
  ];

  const filteredPlaces = places.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Bookmarked'
        ? bookmarkedIds.includes(p.id)
        : p.category === selectedCategory;

    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    storage.toggleBookmarkPlace(id);
    // Force re-render
    setPlaces([...places]);
  };

  const handleAddCustomPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName) return;

    const custom: SpiritualPlace = {
      id: `custom-${Date.now()}`,
      name: newPlaceName,
      location: newPlaceLocation || 'Local Haven',
      country: 'Personal Sanctuary',
      lat: 37.7749 + (Math.random() * 2 - 1),
      lng: -122.4194 + (Math.random() * 2 - 1),
      category: newPlaceCategory,
      description: newPlaceDesc || 'A cherished personal sanctuary for silent contemplation.',
      acousticProfile: {
        silenceRating: newPlaceSilence,
        reverbSeconds: 1.0,
        ambientSound: 'Natural silence and gentle wind rustle',
      },
      bestTime: 'Early morning sunrise',
      image: forestMeditationRetreat,
      history: 'Personal discovery pinned to Elevate-Mindfulness pilgrimage map.',
      meditationGuidance: 'Breathe gently, recognizing sacred ground in everyday nature.',
    };

    storage.addCustomPlace(custom);
    setPlaces([custom, ...places]);
    setSelectedPlace(custom);
    setIsAddingPlace(false);
    setNewPlaceName('');
    setNewPlaceLocation('');
    setNewPlaceDesc('');
  };

  // Convert lat/lng coordinates to SVG map positions (Mercator-like projection)
  const projectCoordinates = (lat: number, lng: number) => {
    // Map width: 1000, height: 500
    // lng: -180 to 180 -> x: 0 to 1000
    // lat: 85 to -85 -> y: 0 to 500
    const x = ((lng + 180) / 360) * 1000;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 250 - (mercN / Math.PI) * 150;
    return {
      x: Math.max(30, Math.min(970, x)),
      y: Math.max(30, Math.min(470, y)),
    };
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
          <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Global Sanctuaries & Acoustic Retreats</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-stone-100">
              Sacred Sanctuaries & Quiet Places
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              Geomantic centers, Zen rock gardens, sound domes, and high-altitude monasteries celebrated for profound acoustic silence and restorative presence.
            </p>
          </div>

          <button
            onClick={() => setIsAddingPlace(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-white transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pin Local Sacred Spot</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        {/* Category Pills (functional buttons with active states) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto p-1 bg-stone-200/60 dark:bg-stone-900 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search sanctuary or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive SVG Projection Map (7 Cols on desktop) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          
          {/* Map Controls */}
          <div className="absolute top-6 right-6 z-20 flex flex-col gap-1.5 bg-stone-950/80 p-1.5 rounded-xl border border-stone-800 backdrop-blur-md">
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 text-[10px] font-mono text-center"
              title="Reset View"
            >
              1x
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 z-10 mb-2">
            <span>Mercator Contemplative Projection</span>
            <span>{filteredPlaces.length} Sanctuaries Mapped</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[380px] overflow-hidden rounded-2xl bg-stone-950/90 border border-stone-800/80 flex items-center justify-center">
            
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              }}
            >
              {/* Subtle Meridian & Latitude Grid Lines */}
              <defs>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="1000" height="500" fill="url(#grid)" />

              {/* Stylized Continents Outlines (Zen minimalist geometry) */}
              {/* North America */}
              <path
                d="M 120 70 Q 200 60 280 80 Q 320 140 260 210 Q 180 250 140 200 Z"
                fill="rgba(41, 37, 36, 0.6)"
                stroke="rgba(87, 83, 78, 0.4)"
                strokeWidth="1.2"
              />
              {/* South America */}
              <path
                d="M 280 240 Q 340 260 330 350 Q 290 440 260 410 Q 240 320 280 240 Z"
                fill="rgba(41, 37, 36, 0.6)"
                stroke="rgba(87, 83, 78, 0.4)"
                strokeWidth="1.2"
              />
              {/* Europe */}
              <path
                d="M 460 80 Q 550 70 540 140 Q 480 160 460 120 Z"
                fill="rgba(41, 37, 36, 0.6)"
                stroke="rgba(87, 83, 78, 0.4)"
                strokeWidth="1.2"
              />
              {/* Africa */}
              <path
                d="M 470 170 Q 560 170 570 270 Q 530 380 490 340 Q 450 250 470 170 Z"
                fill="rgba(41, 37, 36, 0.6)"
                stroke="rgba(87, 83, 78, 0.4)"
                strokeWidth="1.2"
              />
              {/* Asia */}
              <path
                d="M 550 70 Q 750 60 880 130 Q 860 250 720 250 Q 640 200 550 140 Z"
                fill="rgba(41, 37, 36, 0.6)"
                stroke="rgba(87, 83, 78, 0.4)"
                strokeWidth="1.2"
              />
              {/* Australia */}
              <path
                d="M 780 320 Q 860 310 880 370 Q 820 420 770 380 Z"
                fill="rgba(41, 37, 36, 0.6)"
                stroke="rgba(87, 83, 78, 0.4)"
                strokeWidth="1.2"
              />

              {/* Sanctuary Pins */}
              {filteredPlaces.map((place) => {
                const pos = projectCoordinates(place.lat, place.lng);
                const isSelected = selectedPlace.id === place.id;
                const isBookmarked = bookmarkedIds.includes(place.id);

                return (
                  <g
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className="cursor-pointer group"
                    transform={`translate(${pos.x}, ${pos.y})`}
                  >
                    {/* Concentric aura pulse for selected pin */}
                    {isSelected && (
                      <circle
                        r="16"
                        className="fill-emerald-500/20 stroke-emerald-400/50 animate-ping"
                      />
                    )}

                    {/* Outer ring */}
                    <circle
                      r={isSelected ? '9' : '6'}
                      className={`transition-all ${
                        isSelected
                          ? 'fill-emerald-500 stroke-emerald-300 stroke-2'
                          : isBookmarked
                          ? 'fill-amber-500 stroke-amber-300'
                          : 'fill-stone-300 stroke-stone-600 hover:fill-emerald-400'
                      }`}
                    />

                    {/* Pin Label on Hover or Selected */}
                    <text
                      y="-12"
                      textAnchor="middle"
                      className={`text-[10px] font-sans font-medium transition-opacity ${
                        isSelected
                          ? 'fill-white opacity-100 font-semibold'
                          : 'fill-stone-400 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {place.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Sanctuary Bar at Bottom of Map */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 z-10">
            {filteredPlaces.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlace(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedPlace.id === p.id
                    ? 'bg-emerald-800 text-emerald-100'
                    : 'bg-stone-800/60 text-stone-400 hover:text-stone-200'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sanctuary Details Card (5 Cols on desktop) */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
          
          <div>
            {/* Sanctuary Image */}
            <div className="relative h-48 w-full bg-stone-800 overflow-hidden">
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Category & Bookmark Pill */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-mono text-[11px] uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                  {selectedPlace.category}
                </span>

                <button
                  onClick={(e) => handleToggleBookmark(selectedPlace.id, e)}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-amber-400 border border-white/20 transition-colors"
                  title="Save to Sanctuary Wishlist"
                >
                  {bookmarkedIds.includes(selectedPlace.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Title on bottom of photo */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="text-[11px] text-stone-300 flex items-center gap-1.5 font-mono">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{selectedPlace.location}, {selectedPlace.country}</span>
                </div>
                <h3 className="font-serif text-xl font-medium tracking-tight mt-0.5">
                  {selectedPlace.name}
                </h3>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-5 sm:p-6 space-y-4">
              
              {/* Acoustic Profile Metrics */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    Silence Index
                  </div>
                  <div className="text-base font-semibold text-stone-900 dark:text-stone-100 font-mono">
                    {selectedPlace.acousticProfile.silenceRating}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    Reverberation
                  </div>
                  <div className="text-base font-semibold text-stone-900 dark:text-stone-100 font-mono">
                    {selectedPlace.acousticProfile.reverbSeconds}s
                  </div>
                </div>
                <div className="col-span-2 pt-1 border-t border-stone-200/60 dark:border-stone-700/60 text-[11px] text-stone-600 dark:text-stone-300">
                  <span className="font-medium text-stone-900 dark:text-white">Acoustic Nature: </span>
                  {selectedPlace.acousticProfile.ambientSound}
                </div>
              </div>

              {/* Narrative description */}
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {selectedPlace.description}
              </p>

              {/* Meditation Guidance */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/50">
                <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Contemplative Practice</span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 italic">
                  "{selectedPlace.meditationGuidance}"
                </p>
              </div>

              {/* Best time */}
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Best hour: {selectedPlace.bestTime}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/50 dark:bg-stone-900/50">
            <span className="text-[11px] font-mono text-stone-400">
              Coordinates: {selectedPlace.lat.toFixed(3)}, {selectedPlace.lng.toFixed(3)}
            </span>
            <button
              onClick={() => handleToggleBookmark(selectedPlace.id)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-white transition-colors"
            >
              {bookmarkedIds.includes(selectedPlace.id) ? 'Saved in Wishlist' : 'Bookmark Sanctuary'}
            </button>
          </div>

        </div>

      </div>

      {/* Add Custom Sacred Spot Modal */}
      {isAddingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddingPlace(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-2xl font-medium tracking-tight mb-2 text-stone-900 dark:text-stone-100">
              Pin a Quiet Sanctuary
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Add your private meditation grove, quiet riverbank, or sacred spot to your local contemplative map.
            </p>

            <form onSubmit={handleAddCustomPlace} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Sanctuary Name
                </label>
                <input
                  type="text"
                  required
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  placeholder="E.g., Muir Woods Pine Hollow"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  value={newPlaceLocation}
                  onChange={(e) => setNewPlaceLocation(e.target.value)}
                  placeholder="E.g., Marin County, California"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={newPlaceCategory}
                  onChange={(e) => setNewPlaceCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="Ancient Forest">Ancient Forest</option>
                  <option value="Mountain Sanctuary">Mountain Sanctuary</option>
                  <option value="Zen Temple">Zen Temple</option>
                  <option value="Sacred Water">Sacred Water</option>
                  <option value="Sound Dome">Sound Dome</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Why is it special for contemplation?
                </label>
                <textarea
                  rows={2}
                  value={newPlaceDesc}
                  onChange={(e) => setNewPlaceDesc(e.target.value)}
                  placeholder="Quiet canopy, zero cellphone reception, soothing wind..."
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPlace(false)}
                  className="px-3 py-2 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                >
                  Pin Spot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
