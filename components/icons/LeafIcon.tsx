
import React from 'react';

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M11 20A7 7 0 0 1 4 13V8a5 5 0 0 1 5-5h1" />
    <path d="M11 20v-1a2 2 0 0 0-2-2H6" />
    <path d="M11 20A7 7 0 0 0 18 13V8a5 5 0 0 0-5-5h-1" />
    <path d="M11 20v-1a2 2 0 0 1 2-2h3" />
  </svg>
);

export default LeafIcon;
