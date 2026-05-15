import React from 'react';

export const TigerLogo = ({ width = 40, height = 40 }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke="#d4af37" strokeWidth="2" fill="rgba(212,175,55,0.1)" />
    <path d="M35 35 Q40 25 50 28 Q60 25 65 35 Q70 30 72 38 Q75 45 68 50 Q72 55 68 62 Q65 70 55 68 Q50 72 45 68 Q35 70 32 62 Q28 55 32 50 Q25 45 28 38 Q30 30 35 35Z" fill="#d4af37" opacity="0.9" />
    <circle cx="42" cy="42" r="3" fill="#0a0e27" />
    <circle cx="58" cy="42" r="3" fill="#0a0e27" />
    <path d="M48 50 L50 55 L52 50" stroke="#0a0e27" strokeWidth="2" fill="none" />
    <path d="M45 58 Q50 62 55 58" stroke="#0a0e27" strokeWidth="2" fill="none" />
  </svg>
);
