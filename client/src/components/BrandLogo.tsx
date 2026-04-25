import React from 'react';

interface BrandLogoProps {
  variant?: 'horizontal' | 'symbol';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const symbolSizes = {
  sm: 30,
  md: 38,
  lg: 46,
} as const;

const horizontalHeights = {
  sm: 28,
  md: 34,
  lg: 40,
} as const;

export function BrandLogo({ variant = 'horizontal', size = 'md', className }: BrandLogoProps) {
  if (variant === 'symbol') {
    const dimension = symbolSizes[size];
    return (
      <img
        src="/images/muun-mark.svg"
        alt="무운 로고"
        width={dimension}
        height={dimension}
        className={className}
        style={{ width: dimension, height: dimension, display: 'block' }}
      />
    );
  }

  const height = horizontalHeights[size];
  const width = Math.round(height * 3.85);

  return (
    <img
      src="/images/muun-horizontal.svg"
      alt="무운"
      width={width}
      height={height}
      className={className}
      style={{ width: 'auto', height, display: 'block' }}
    />
  );
}

export default BrandLogo;
