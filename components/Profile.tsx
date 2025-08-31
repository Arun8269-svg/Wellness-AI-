import React from 'react';
import { Achievement } from '../types';
import TrophyIcon from './icons/TrophyIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ProfileProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  achievements: Achievement[];
}

const ThemeToggle: React.FC<{ theme: string; setTheme: (theme: string) => void }> = ({ theme, setTheme }) => (
    <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral dark:text-dark-neutral">Appearance</span>
        <div className="bg-base-300 dark:bg-dark-base-300 p-1 rounded-full flex items-center">
            <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1 text-sm rounded-full ${theme === 'light' ? 'bg-base-100 dark:bg-dark-base-100 shadow' : ''}`}
            >
                Light
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 text-sm rounded-full ${theme === 'dark' ? 'bg-base-100 dark:bg-dark-base-100 shadow' : ''}`}
            >
                Dark
            </button>
        </div>
    </div>
);


const Profile: React.FC<ProfileProps> = ({ theme, setTheme, achievements }) => {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-bold text-neutral dark:text-dark-neutral">Profile & Settings</h1>
        <p className="text-neutral/60 dark:text-dark-neutral/60 mt-2">Customize your app experience and view your accomplishments.</p>
      </header>

      <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral mb-4">Settings</h2>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-neutral dark:text-dark-neutral mb-4">Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {unlockedAchievements.map(ach => (
            <div key={ach.id} className="bg-accent/50 dark:bg-dark-accent/20 border-l-4 border-accent dark:border-dark-accent p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <TrophyIcon className="w-8 h-8 text-accent dark:text-dark-accent" />
                <div>
                  <h3 className="font-bold text-neutral dark:text-dark-neutral">{ach.title}</h3>
                  <p className="text-sm text-neutral/80 dark:text-dark-neutral/80">{ach.description}</p>
                </div>
              </div>
            </div>
          ))}
          {lockedAchievements.map(ach => (
            <div key={ach.id} className="bg-base-300/50 dark:bg-dark-base-300/50 p-4 rounded-lg opacity-60">
               <div className="flex items-center gap-3">
                <TrophyIcon className="w-8 h-8 text-neutral/50 dark:text-dark-neutral/50" />
                <div>
                  <h3 className="font-bold text-neutral dark:text-dark-neutral">{ach.title}</h3>
                  <p className="text-sm text-neutral/80 dark:text-dark-neutral/80">{ach.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
