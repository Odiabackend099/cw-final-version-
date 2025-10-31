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
  // Size mappings for logo image (height-based, maintaining aspect ratio)
  const sizes = {
    sm: { image: 24, text: 'text-lg' },
    md: { image: 32, text: 'text-xl' },
    lg: { image: 48, text: 'text-2xl' },
    xl: { image: 64, text: 'text-3xl' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image */}
      <img
        src="/images/logo.jpeg"
        alt="CallWaiting AI Logo"
        height={currentSize.image}
        className="flex-shrink-0 object-contain"
        style={{ 
          height: `${currentSize.image}px`,
          width: 'auto',
          filter: invertColors ? 'brightness(0) invert(1)' : 'none'
        }}
      />

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

