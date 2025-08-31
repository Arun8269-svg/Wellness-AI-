import React from 'react';

const StethoscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M4.8 2.3A.3.3 0 1 0 5.4 2a.3.3 0 0 0-.6.3" />
    <path d="M8 2a.9.9 0 0 1 .9.9v10.2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2.9A.9.9 0 0 1 14 2" />
    <path d="M4.5 2.5h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1" />
    <path d="M15 14.5a2.5 2.5 0 0 1 5 0V17a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2.5" />
    <path d="M8 14v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

export default StethoscopeIcon;
