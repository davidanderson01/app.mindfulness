import React from 'react';

interface ElevateLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export const ElevateLogo: React.FC<ElevateLogoProps> = ({
  className = 'w-6 h-6',
  size,
  showWordmark = false,
  wordmarkClassName = 'font-sans text-xl font-medium tracking-tight text-stone-900 dark:text-stone-100',
}) => {
  const svgElement = (
    <svg
      viewBox="24 10 112 126"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      <defs>
        {/* Cyan to Teal Gradient */}
        <linearGradient id="elevateCyanTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Violet to Lavender Gradient */}
        <linearGradient id="elevateViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Royal Indigo Gradient */}
        <linearGradient id="elevateIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Crown Peak Gradient */}
        <linearGradient id="elevateCrownTop" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Crown Inner Gradient */}
        <linearGradient id="elevateCrownInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Soft Glow Petal Fill (transparent on any background) */}
        <linearGradient id="elevatePetalLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.06" />
        </linearGradient>

        {/* Subtle Drop Shadow */}
        <filter id="elevateSoftGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0284c7" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter="url(#elevateSoftGlow)">
        {/* ========================================== */}
        {/* 1. LOWER SUPPORTING LOTUS PETALS */}
        {/* ========================================== */}
        
        {/* Bottom central droplet petal */}
        <path
          d="M80 114 C76 122 76 130 80 134 C84 130 84 122 80 114 Z"
          fill="url(#elevateCyanTeal)"
          stroke="#0284c7"
          strokeWidth="1.5"
        />

        {/* Bottom lateral horizontal wings (Left & Right) */}
        <path
          d="M74 124 C56 128 42 124 38 118 C52 116 66 118 74 124 Z"
          fill="url(#elevatePetalLight)"
          stroke="#0284c7"
          strokeWidth="1.8"
        />
        <path
          d="M86 124 C104 128 118 124 122 118 C108 116 94 118 86 124 Z"
          fill="url(#elevatePetalLight)"
          stroke="#0284c7"
          strokeWidth="1.8"
        />

        {/* Bottom diagonal swooping petals */}
        <path
          d="M70 120 C50 122 34 112 30 102 C46 104 60 110 70 120 Z"
          fill="url(#elevatePetalLight)"
          stroke="#3b82f6"
          strokeWidth="1.8"
        />
        <path
          d="M90 120 C110 122 126 112 130 102 C114 104 100 110 90 120 Z"
          fill="url(#elevatePetalLight)"
          stroke="#8b5cf6"
          strokeWidth="1.8"
        />

        {/* Outer lateral pointed petals */}
        <path
          d="M62 108 C44 104 32 94 36 86 C48 94 56 102 62 108 Z"
          fill="url(#elevatePetalLight)"
          stroke="#818cf8"
          strokeWidth="1.8"
        />
        <path
          d="M98 108 C116 104 128 94 124 86 C112 94 104 102 98 108 Z"
          fill="url(#elevatePetalLight)"
          stroke="#818cf8"
          strokeWidth="1.8"
        />

        {/* Middle primary lotus backdrop petals (Light with bold cyan/violet border) */}
        <path
          d="M72 105 C54 98 44 80 50 68 C66 74 72 90 72 105 Z"
          fill="url(#elevatePetalLight)"
          stroke="#06b6d4"
          strokeWidth="2.2"
        />
        <path
          d="M88 105 C106 98 116 80 110 68 C94 74 88 90 88 105 Z"
          fill="url(#elevatePetalLight)"
          stroke="#06b6d4"
          strokeWidth="2.2"
        />

        {/* Inner soft petal translucent core fill behind meditator */}
        <path
          d="M64 92 C58 76 66 64 78 62 C78 78 72 88 64 92 Z"
          fill="url(#elevateCyanTeal)"
          fillOpacity="0.22"
        />
        <path
          d="M96 92 C102 76 94 64 82 62 C82 78 88 88 96 92 Z"
          fill="url(#elevateViolet)"
          fillOpacity="0.22"
        />

        {/* ========================================== */}
        {/* 2. MEDITATING SEATED FIGURE */}
        {/* ========================================== */}
        
        {/* Crossed Lotus Legs (Left & Right folded petals) */}
        {/* Left leg petal */}
        <path
          d="M80 108 C68 114 48 110 46 102 C50 96 68 96 80 108 Z"
          fill="url(#elevateIndigo)"
          stroke="#0284c7"
          strokeWidth="1.6"
        />
        {/* Right leg petal */}
        <path
          d="M80 108 C92 114 112 110 114 102 C110 96 92 96 80 108 Z"
          fill="url(#elevateViolet)"
          stroke="#4f46e5"
          strokeWidth="1.6"
        />

        {/* Torso & Rising Fluid Spine */}
        {/* Left side torso (Turquoise/Cyan curve) */}
        <path
          d="M78 107 C75 92 68 80 68 64 C72 68 76 80 80 92 C79 98 78 103 78 107 Z"
          fill="url(#elevateCyanTeal)"
        />
        {/* Right side torso (Purple/Violet curve) */}
        <path
          d="M82 107 C85 92 92 80 92 64 C88 68 84 80 80 92 C81 98 82 103 82 107 Z"
          fill="url(#elevateViolet)"
        />

        {/* Floating Head Circle */}
        <circle
          cx="80"
          cy="58"
          r="8.5"
          fill="url(#elevateIndigo)"
          stroke="#38bdf8"
          strokeWidth="0.8"
        />

        {/* Upward Arching Arms reaching toward the crown */}
        {/* Left Arching Arm */}
        <path
          d="M68 64 C66 48 72 38 78 30 C76 38 72 48 74 60 Z"
          fill="url(#elevateCyanTeal)"
        />
        {/* Right Arching Arm */}
        <path
          d="M92 64 C94 48 88 38 82 30 C84 38 88 48 86 60 Z"
          fill="url(#elevateViolet)"
        />

        {/* ========================================== */}
        {/* 3. ASCENDING ARROW / BLOSSOM CROWN (ELEVATE) */}
        {/* ========================================== */}
        
        {/* Inner lavender/cyan crown petal */}
        <path
          d="M80 20 C73 28 68 36 72 42 C78 38 80 30 80 20 Z"
          fill="url(#elevateCrownInner)"
        />
        <path
          d="M80 20 C87 28 92 36 88 42 C82 38 80 30 80 20 Z"
          fill="url(#elevateCrownInner)"
        />

        {/* Top pointed triangular arrow roof / chevron */}
        <path
          d="M80 12 L64 30 C72 30 76 26 80 22 C84 26 88 30 96 30 L80 12 Z"
          fill="url(#elevateCrownTop)"
        />
      </g>
    </svg>
  );

  if (showWordmark) {
    return (
      <div className="inline-flex items-center gap-2.5 shrink-0">
        {svgElement}
        <span className={wordmarkClassName}>
          Elevate- Mindfulness
        </span>
      </div>
    );
  }

  return svgElement;
};
