import React from 'react';

export const TigerIcon = ({ width = 32, height = 32 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tiger Head Icon */}
    <path
      d="M12 2C8.5 2 6 4 6 6.5C6 7 6.1 7.4 6.3 7.8L5.5 9L7 8.5C7.3 9.2 7.8 9.8 8.3 10.2L7 13L9.5 12C10.2 12.6 11 13 12 13C13 13 13.8 12.6 14.5 12L17 13L15.7 10.2C16.2 9.8 16.7 9.2 17 8.5L18.5 9L17.7 7.8C17.9 7.4 18 7 18 6.5C18 4 15.5 2 12 2Z"
      stroke="#d4af37"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="rgba(212,175,55,0.15)"
    />
    {/* Eyes */}
    <circle cx="9.5" cy="7" r="0.8" fill="#d4af37" />
    <circle cx="14.5" cy="7" r="0.8" fill="#d4af37" />
    {/* Nose */}
    <path d="M11.5 9L12 10L12.5 9" stroke="#d4af37" strokeWidth="0.8" fill="none" />
    {/* Whiskers */}
    <path d="M8 10L6 10.5" stroke="#d4af37" strokeWidth="0.6" strokeLinecap="round" />
    <path d="M8 11L6 11.5" stroke="#d4af37" strokeWidth="0.6" strokeLinecap="round" />
    <path d="M16 10L18 10.5" stroke="#d4af37" strokeWidth="0.6" strokeLinecap="round" />
    <path d="M16 11L18 11.5" stroke="#d4af37" strokeWidth="0.6" strokeLinecap="round" />
    {/* Mouth */}
    <path d="M10.5 11.5Q12 12.5 13.5 11.5" stroke="#d4af37" strokeWidth="0.8" strokeLinecap="round" fill="none" />
  </svg>
);
