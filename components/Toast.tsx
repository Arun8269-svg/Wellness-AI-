import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow fade-out animation to complete before calling onClose
        setTimeout(onClose, 300);
      }, 2700);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-24 md:bottom-5 right-5 bg-neutral dark:bg-dark-neutral text-primary-content dark:text-dark-neutral-focus rounded-lg shadow-lg px-5 py-3 transition-transform duration-300 ease-in-out ${
        isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
      }`}
      style={{ visibility: show ? 'visible' : 'hidden' }}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default Toast;
