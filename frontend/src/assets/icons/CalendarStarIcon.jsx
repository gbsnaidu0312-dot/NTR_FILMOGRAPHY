import React from 'react';

export const CalendarStarIcon = ({ width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <polygon points="12 13 13.5 16 17 16.5 14.5 19 15 22.5 12 20.5 9 22.5 9.5 19 7 16.5 10.5 16 12 13" fill="currentColor" stroke="none" opacity="0.8" />
  </svg>
);
