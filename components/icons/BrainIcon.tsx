
import React from 'react';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 1 18.5 2h.5a2.5 2.5 0 0 1 2.5 2.5v12A2.5 2.5 0 0 1 19 19.5v1a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 20.5v-1A2.5 2.5 0 0 1 2.5 17V4.5A2.5 2.5 0 0 1 5 2Z" />
    <path d="M12 6.5V11" />
    <path d="M10 9h4" />
    <path d="M16 9.5V14" />
    <path d="M14 12h4" />
    <path d="M8 9.5V14" />
    <path d="M6 12h4" />
    <path d="M12 14v5.5" />
    <path d="M9.5 17h5" />
  </svg>
);

export default BrainIcon;
