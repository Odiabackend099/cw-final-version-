import React from 'react';

interface CallWaitingLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  invertColors?: boolean; // For dark backgrounds
  className?: string;
}

export const CallWaitingLogo: React.FC<CallWaitingLogoProps> = ({
  size = 'md',
  showText = true,
  invertColors = false,
  className = '',
}) => {
  // Size mappings
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Telephone Receiver Icon with Gradient */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 64 64"
        className="flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circuit board pattern background */}
        <defs>
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M8 0L8 16M0 8L16 8"
              stroke={invertColors ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'}
              strokeWidth="1"
            />
            <circle
              cx="8"
              cy="8"
              r="1"
              fill={invertColors ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'}
            />
          </pattern>
          <linearGradient id="phone-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={invertColors ? '#9333ea' : '#9333ea'} />
            <stop offset="50%" stopColor={invertColors ? '#3b82f6' : '#3b82f6'} />
            <stop offset="100%" stopColor={invertColors ? '#84cc16' : '#84cc16'} />
          </linearGradient>
          <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={invertColors ? '#ffffff' : '#1e40af'} />
            <stop offset="50%" stopColor={invertColors ? '#ffffff' : '#3b82f6'} />
            <stop offset="100%" stopColor={invertColors ? '#ffffff' : '#84cc16'} />
          </linearGradient>
        </defs>

        {/* Circuit board overlay */}
        <rect width="64" height="64" fill="url(#circuit-pattern)" opacity="0.4" />

        {/* Telephone receiver - Main body */}
        <path
          d="M32 8C28 8 24 10 22 14L18 20C16 22 16 26 18 28L28 38C30 40 34 40 36 38L42 32C46 30 48 26 48 22C48 18 46 14 42 12L38 10C36 8 34 8 32 8Z"
          fill="url(#phone-gradient)"
          opacity="0.9"
        />

        {/* Earpiece */}
        <ellipse
          cx="26"
          cy="18"
          rx="4"
          ry="6"
          fill="url(#phone-gradient)"
          opacity="0.95"
        />

        {/* Mouthpiece */}
        <ellipse
          cx="44"
          cy="42"
          rx="6"
          ry="4"
          fill="url(#phone-gradient)"
          opacity="0.95"
        />

        {/* Data flow elements */}
        <g opacity="0.6">
          <path
            d="M48 22L56 18M50 26L58 22M46 30L54 26"
            stroke={invertColors ? '#ffffff' : '#3b82f6'}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="56" cy="18" r="1.5" fill={invertColors ? '#ffffff' : '#3b82f6'} />
          <circle cx="58" cy="22" r="1.5" fill={invertColors ? '#ffffff' : '#3b82f6'} />
          <circle cx="54" cy="26" r="1.5" fill={invertColors ? '#ffffff' : '#3b82f6'} />
        </g>
      </svg>

      {/* Text */}
      {showText && (
        <span
          className={`font-bold ${currentSize.text} bg-gradient-to-r ${
            invertColors
              ? 'from-white via-white to-white'
              : 'from-blue-700 via-blue-500 to-green-500'
          } bg-clip-text text-transparent`}
        >
          CallWaiting <span className="text-green-500">AI</span>
        </span>
      )}
    </div>
  );
};

export default CallWaitingLogo;

