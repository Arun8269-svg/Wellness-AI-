
import React from 'react';

const FootprintsIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M4 16.85V18a2 2 0 0 0 2 2h2.24" />
    <path d="M8.6 13.3a3 3 0 0 1 4.2-1.2c2 1.2 2.8 3.8 1.6 5.8a3 3 0 0 1-5.8-1.6c-1.2-2-1.2-4.4 0-6.4" />
    <path d="M15.8 4.2a3 3 0 0 1 5.2 2.4 3 3 0 0 1-2.4 5.2c-2.4 1.4-5.2.4-6.6-2-1.4-2.4-.4-5.2 2-6.6" />
    <path d="M20 12.15V13a2 2 0 0 1-2 2h-2.34" />
  </svg>
);

export default FootprintsIcon;
