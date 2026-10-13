import React from 'react';

interface LotusIconProps {
  className?: string;
  size?: number;
}

export const LotusIcon: React.FC<LotusIconProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      viewBox="0 0 100 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Central Sacred Circle / Core Bindu */}
      <circle cx="50" cy="50" r="5.5" fill="currentColor" fillOpacity="0.15" />

      {/* Top Center Primary Petal */}
      <path d="M50 8 C43 22 43 36 50 42 C57 36 57 22 50 8 Z" />

      {/* Inner Flanking Petals (Left & Right) */}
      <path d="M50 42 C38 34 32 18 36 12 C44 20 48 32 50 42 Z" />
      <path d="M50 42 C62 34 68 18 64 12 C56 20 52 32 50 42 Z" />

      {/* Middle Radiating Diagonal Petals */}
      <path d="M46 52 C32 46 16 30 20 22 C32 26 40 40 46 52 Z" />
      <path d="M54 52 C68 46 84 30 80 22 C68 26 60 40 54 52 Z" />

      {/* Lateral Outer Petals */}
      <path d="M44 56 C28 56 10 44 14 36 C26 40 38 50 44 56 Z" />
      <path d="M56 56 C72 56 90 44 86 36 C74 40 62 50 56 56 Z" />

      {/* Lower Expanding Base Petals */}
      <path d="M45 58 C32 64 16 58 18 50 C30 52 40 56 45 58 Z" />
      <path d="M55 58 C68 64 84 58 82 50 C70 52 60 56 55 58 Z" />

      {/* Bottom Foundation Cradle Petals */}
      <path d="M50 56 C38 68 24 74 26 68 C34 64 44 60 50 56 Z" />
      <path d="M50 56 C62 68 76 74 74 68 C66 64 56 60 50 56 Z" />

      {/* Bottom Center Calyx Leaf */}
      <path d="M50 56 C44 66 42 78 50 80 C58 78 56 66 50 56 Z" />
    </svg>
  );
};
