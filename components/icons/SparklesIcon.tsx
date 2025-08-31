
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6-11A2 2 0 0 0 3.937 1.5l11 6A2 2 0 0 0 16.4 9.937l4.125 4.125-1.406 1.406-4.125-4.125Z" />
    <path d="m14.5 14.5 1-1" />
    <path d="M13 10 7.5 4.5" />
    <path d="M14.063 8.5A2 2 0 0 0 15.5 9.937l4.125 4.125-1.406 1.406-4.125-4.125Z" />
    <path d="M19.5 15.5 21 17" />
    <path d="M21 3.937A2 2 0 0 0 19.563 2.5l-2.125 2.125 1.406 1.406Z" />
  </svg>
);

export default SparklesIcon;
