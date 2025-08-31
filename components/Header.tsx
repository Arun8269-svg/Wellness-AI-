import React from 'react';
import { AppTab } from '../types';
import DumbbellIcon from './icons/DumbbellIcon';
import LeafIcon from './icons/LeafIcon';
import BrainIcon from './icons/BrainIcon';
import MoonIcon from './icons/MoonIcon';
import CameraIcon from './icons/CameraIcon';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import PillIcon from './icons/PillIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import UserIcon from './icons/UserIcon';
import CalendarIcon from './icons/CalendarIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import StethoscopeIcon from './icons/StethoscopeIcon';
import HeartPulseIcon from './icons/HeartPulseIcon';
import BloodDropIcon from './icons/BloodDropIcon';
import FootprintsIcon from './icons/FootprintsIcon';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.Dashboard, label: 'Dashboard', icon: <div className="text-2xl">❤️</div> },
    { id: AppTab.Nutrition, label: 'Nutrition', icon: <LeafIcon className="w-6 h-6" /> },
    { id: AppTab.Workouts, label: 'Workouts', icon: <DumbbellIcon className="w-6 h-6" /> },
    { id: AppTab.Metrics, label: 'Metrics', icon: <ChartBarIcon className="w-6 h-6" /> },
    { id: AppTab.Steps, label: 'Steps', icon: <FootprintsIcon className="w-6 h-6" /> },
    { id: AppTab.BP, label: 'BP', icon: <HeartPulseIcon className="w-6 h-6" /> },
    { id: AppTab.Glucose, label: 'Glucose', icon: <BloodDropIcon className="w-6 h-6" /> },
    { id: AppTab.Medications, label: 'Meds', icon: <PillIcon className="w-6 h-6" /> },
    { id: AppTab.Appointments, label: 'Appointments', icon: <CalendarIcon className="w-6 h-6" /> },
    { id: AppTab.Records, label: 'Records', icon: <ClipboardListIcon className="w-6 h-6" /> },
    { id: AppTab.SymptomChecker, label: 'Symptom Check', icon: <StethoscopeIcon className="w-6 h-6" /> },
    { id: AppTab.Mindfulness, label: 'Mindfulness', icon: <BrainIcon className="w-6 h-6" /> },
    { id: AppTab.Sleep, label: 'Sleep', icon: <MoonIcon className="w-6 h-6" /> },
    { id: AppTab.Reports, label: 'Reports', icon: <DocumentTextIcon className="w-6 h-6" /> },
    { id: AppTab.Learn, label: 'Learn', icon: <BookOpenIcon className="w-6 h-6" /> },
    { id: AppTab.FormChecker, label: 'Form Check', icon: <CameraIcon className="w-6 h-6" /> },
    { id: AppTab.AIChat, label: 'AI Chat', icon: <ChatBubbleIcon className="w-6 h-6" /> },
    { id: AppTab.Profile, label: 'Profile', icon: <UserIcon className="w-6 h-6" /> },
  ];
  
  const mobileTabs = [
    { id: AppTab.Dashboard, label: 'Dashboard', icon: <div className="text-2xl">❤️</div> },
    { id: AppTab.Nutrition, label: 'Nutrition', icon: <LeafIcon className="w-6 h-6" /> },
    { id: AppTab.Workouts, label: 'Workouts', icon: <DumbbellIcon className="w-6 h-6" /> },
    { id: AppTab.AIChat, label: 'AI Chat', icon: <ChatBubbleIcon className="w-6 h-6" /> },
    { id: AppTab.Profile, label: 'Profile', icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <>
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-base-200 dark:bg-dark-base-200 shadow-lg shrink-0">
            <div className="px-6 h-20 flex items-center border-b border-base-300 dark:border-dark-base-300">
                <span className="text-2xl font-bold text-primary dark:text-dark-primary">Wellness AI</span>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-3 w-full p-3 rounded-lg text-base font-medium transition-colors duration-300 text-left ${
                            activeTab === tab.id
                                ? 'bg-primary text-primary-content dark:bg-dark-primary dark:text-dark-primary-content shadow'
                                : 'text-neutral dark:text-dark-neutral hover:bg-base-300/50 dark:hover:bg-dark-base-300/50'
                        }`}
                    >
                        <span className="w-6 h-6 flex items-center justify-center">{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </aside>

        {/* Mobile Header and Nav */}
        <div className="md:hidden">
            <header className="bg-base-200 dark:bg-dark-base-200 shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                     <span className="text-2xl font-bold text-primary dark:text-dark-primary">Wellness AI</span>
                </div>
            </header>
            <nav className="fixed bottom-0 left-0 right-0 bg-base-200 dark:bg-dark-base-200 shadow-t border-t border-base-300 dark:border-dark-base-300 grid grid-cols-5 z-20">
              {mobileTabs.map((tab) => ( 
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center w-full py-2 text-xs font-medium transition-colors duration-300 ${
                    activeTab === tab.id ? 'text-primary dark:text-dark-primary' : 'text-neutral/70 dark:text-dark-neutral/70 hover:text-primary dark:hover:text-dark-primary'
                  }`}
                >
                  {tab.icon}
                  <span className="text-center">{tab.label}</span>
                </button>
              ))}
            </nav>
        </div>
    </>
  );
};

export default Header;
