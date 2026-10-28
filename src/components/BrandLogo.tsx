import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses} shrink-0 select-none`}
      aria-label="BuildCV Logo"
    >
      <defs>
        <linearGradient id="buildcv_grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={variant === 'light' ? '#FFFFFF' : '#4F46E5'} />
          <stop offset="100%" stopColor={variant === 'light' ? '#E0E7FF' : '#7C3AED'} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#buildcv_grad)" />
      <path
        d="M19 14C16.7909 14 15 15.7909 15 18V46C15 48.2091 16.7909 50 19 50H41C43.2091 50 45 48.2091 45 46V24L35 14H19Z"
        fill={variant === 'light' ? '#4F46E5' : '#FFFFFF'}
        fillOpacity="0.96"
      />
      <path
        d="M35 14V21C35 22.6569 36.3431 24 38 24H45L35 14Z"
        fill={variant === 'light' ? '#A5B4FC' : '#C7D2FE'}
      />
      <circle
        cx="23.5"
        cy="24.5"
        r="3"
        fill={variant === 'light' ? '#FFFFFF' : '#4F46E5'}
      />
      <rect
        x="29"
        y="23"
        width="9"
        height="3"
        rx="1.5"
        fill={variant === 'light' ? '#FFFFFF' : '#4F46E5'}
      />
      <rect
        x="20.5"
        y="32"
        width="19"
        height="2.8"
        rx="1.4"
        fill={variant === 'light' ? '#E0E7FF' : '#6366F1'}
      />
      <rect
        x="20.5"
        y="37.5"
        width="15"
        height="2.8"
        rx="1.4"
        fill={variant === 'light' ? '#C7D2FE' : '#818CF8'}
      />
      <rect
        x="20.5"
        y="43"
        width="11"
        height="2.8"
        rx="1.4"
        fill={variant === 'light' ? '#A5B4FC' : '#A5B4FC'}
      />
      <circle
        cx="46"
        cy="44"
        r="9"
        fill="#10B981"
        stroke={variant === 'light' ? '#FFFFFF' : '#4F46E5'}
        strokeWidth="2"
      />
      <path
        d="M42.5 44.2L44.8 46.5L49.8 41.5"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
