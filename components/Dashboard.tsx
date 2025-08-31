
import React, { useState, useEffect, useRef } from 'react';
import { Meal, SleepEntry, Goal, Medication, WorkoutLog, AppTab } from '../types';
import WaterDropIcon from './icons/WaterDropIcon';
import PillIcon from './icons/PillIcon';
import SparklesIcon from './icons/SparklesIcon';
import BrainIcon from './icons/BrainIcon';
import LeafIcon from './icons/LeafIcon';

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

const LogWorkoutModal: React.FC<{onClose: () => void, addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'date'>) => void}> = ({ onClose, addWorkoutLog }) => {
    const [type, setType] = useState('');
    const [duration, setDuration] = useState(30);

    const handleSave = () => {
        if (!type.trim() || duration <= 0) return;
        addWorkoutLog({ type, duration });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-base-200 dark:bg-dark-base-200 rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-neutral dark:text-dark-neutral">Log Workout</h2>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-neutral dark:text-dark-neutral mb-1">Workout Type</label>
                    <input id="type" type="text" value={type} onChange={e => setType(e.target.value)} placeholder="e.g., Upper Body Strength" className="w-full px-4 py-3 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"/>
                </div>
                 <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-neutral dark:text-dark-neutral mb-1">Duration (minutes)</label>
                    <input id="duration" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full px-4 py-3 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"/>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-base-300 dark:bg-dark-base-300 font-semibold hover:bg-base-300/80 dark:hover:bg-dark-base-300/80">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary dark:bg-dark-primary text-primary-content dark:text-dark-primary-content font-semibold hover:bg-primary-focus dark:hover:bg-dark-primary-focus">Save</button>
                </div>
            </div>
        </div>
    )
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
    <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
        <div className="bg-primary/10 dark:bg-dark-primary/10 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-neutral/70 dark:text-dark-neutral/70 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-neutral dark:text-dark-neutral">{value}</p>
        </div>
    </div>
);

const GoalsTracker: React.FC<{goals: Goal[], updateGoalProgress: (id: string, amount: number) => void}> = ({ goals, updateGoalProgress }) => {
    const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());
    // FIX: Explicitly initialize useRef with `undefined` to satisfy the linter/compiler rule that expects one argument for `useRef`.
    const prevGoalsRef = useRef<Goal[] | undefined>(undefined);

    useEffect(() => {
        const prevGoals = prevGoalsRef.current;
        if (prevGoals) {
            goals.forEach(goal => {
                const prevGoal = prevGoals.find(p => p.id === goal.id);
                // Check if goal was just completed
                if (prevGoal && goal.current >= goal.target && prevGoal.current < goal.target) {
                    setCompletedGoals(prev => new Set(prev).add(goal.id));
                    
                    setTimeout(() => {
                        setCompletedGoals(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(goal.id);
                            return newSet;
                        });
                    }, 2000);
                }
            });
        }
        prevGoalsRef.current = goals;
    }, [goals]);

    return (
        <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral mb-4">Weekly Goals</h2>
            <div className="space-y-4">
                {goals.map(goal => {
                    const percentage = Math.min((goal.current / goal.target) * 100, 100);
                    const isCompleted = completedGoals.has(goal.id);
                    const incrementAmount = goal.id === 'steps' ? 1000 : 1;
                    
                    const goalContainerClasses = `p-4 rounded-lg transition-all duration-500 ${isCompleted ? 'bg-success/10 ring-2 ring-success shadow-lg shadow-success/20' : 'bg-base-100 dark:bg-dark-base-100'}`;
                    
                    return (
                        <div key={goal.id} className={goalContainerClasses}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-neutral dark:text-dark-neutral">{goal.title}</span>
                                <button onClick={() => updateGoalProgress(goal.id, incrementAmount)} className="px-3 py-1 text-xs bg-primary/20 dark:bg-dark-primary/20 rounded-full font-semibold hover:bg-primary/40 dark:hover:bg-dark-primary/40 transition-colors">
                                    +{incrementAmount.toLocaleString()}
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-base-300 dark:bg-dark-base-300 rounded-full h-3 flex-1 overflow-hidden relative">
                                    <div 
                                        className="bg-gradient-to-r from-secondary to-success rounded-full h-full transition-all duration-500 ease-out" 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                    {isCompleted && <SparklesIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white/90 animate-sparkle" />}
                                </div>
                                <span className="text-sm font-bold text-primary dark:text-dark-primary w-24 text-right">
                                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const TodaysMedications: React.FC<{medications: Medication[]}> = ({ medications }) => {
    const dailyMeds = medications.filter(m => m.frequency === 'daily');
    
    return (
        <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral mb-4">Today's Medications</h2>
            {dailyMeds.length > 0 ? (
                <ul className="space-y-3">
                    {dailyMeds.map(med => (
                        <li key={med.id} className="flex items-center gap-3 bg-base-100 dark:bg-dark-base-100 p-3 rounded-lg">
                            <PillIcon className="w-5 h-5 text-info shrink-0" />
                            <div>
                                <p className="font-semibold text-neutral dark:text-dark-neutral">{med.name}</p>
                                <p className="text-xs text-neutral/60 dark:text-dark-neutral/60">{med.dosage}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-neutral/60 dark:text-dark-neutral/60 py-4">No daily medications logged.</p>
            )}
        </div>
    )
}

const NutritionalJournal: React.FC<{ meals: Meal[], setActiveTab: (tab: AppTab) => void }> = ({ meals, setActiveTab }) => (
    <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-3">
                <LeafIcon className="w-6 h-6 text-primary dark:text-dark-primary" />
                <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral">Nutritional Journal</h2>
            </div>
            <button 
                onClick={() => setActiveTab(AppTab.Nutrition)}
                className="px-4 py-2 text-sm bg-primary/20 dark:bg-dark-primary/20 rounded-lg font-semibold hover:bg-primary/40 dark:hover:bg-dark-primary/40 transition-colors"
            >
                Log Meal
            </button>
        </div>
        {meals.length > 0 ? (
            <ul className="space-y-3">
                {meals.map(meal => (
                    <li key={meal.id} className="flex justify-between items-center bg-base-100 dark:bg-dark-base-100 p-3 rounded-lg">
                        <span className="font-medium text-neutral dark:text-dark-neutral capitalize">{meal.description}</span>
                        <span className="font-semibold text-primary dark:text-dark-primary">{meal.calories} kcal</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-center text-neutral/60 dark:text-dark-neutral/60 py-4">No meals logged yet today.</p>
        )}
    </div>
);

const MindfulnessMoment: React.FC<{ setActiveTab: (tab: AppTab) => void }> = ({ setActiveTab }) => (
    <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center">
        <BrainIcon className="w-10 h-10 text-secondary dark:text-dark-secondary mb-3"/>
        <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral mb-2">Mindfulness Moment</h2>
        <p className="text-neutral/60 dark:text-dark-neutral/60 mb-4 text-sm">Take a short break to recenter and find your calm.</p>
        <button 
            onClick={() => setActiveTab(AppTab.Mindfulness)}
            className="w-full bg-secondary dark:bg-dark-secondary text-primary-content dark:text-dark-primary-content font-bold py-3 rounded-lg hover:opacity-90 transition-colors"
        >
            Start a Session
        </button>
    </div>
);


interface DashboardProps {
    meals: Meal[];
    sleepEntries: SleepEntry[];
    medications: Medication[];
    goals: Goal[];
    updateGoalProgress: (goalId: string, amount: number) => void;
    workoutLogs: WorkoutLog[];
    addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'date'>) => void;
    setActiveTab: (tab: AppTab) => void;
    streak: number;
}

const Dashboard: React.FC<DashboardProps> = ({ meals, sleepEntries, medications, goals, updateGoalProgress, workoutLogs, addWorkoutLog, setActiveTab, streak }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const today = new Date().toISOString().split('T')[0];
    const todaySleep = sleepEntries.find(e => e.date === today);
    const stepsGoal = goals.find(g => g.id === 'steps');
    
    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-4xl font-bold text-neutral dark:text-dark-neutral">Welcome Back!</h1>
                <p className="text-neutral/60 dark:text-dark-neutral/60 mt-2">Here's a snapshot of your wellness journey today.</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Calories Eaten" value={`${totalCalories.toLocaleString()} kcal`} icon={<span className="text-2xl">🍽️</span>} />
                <StatCard label="Steps Today" value={stepsGoal ? `${stepsGoal.current.toLocaleString()}` : 'N/A'} icon={<span className="text-2xl">👣</span>} />
                <StatCard label="Daily Streak" value={`${streak} Day${streak === 1 ? '' : 's'}`} icon={<span className="text-2xl">🔥</span>} />
                <StatCard label="Sleep" value={todaySleep ? `${todaySleep.duration.toFixed(1)} hrs` : 'N/A'} icon={<span className="text-2xl">😴</span>} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <GoalsTracker goals={goals} updateGoalProgress={updateGoalProgress} />
                    <TodaysMedications medications={medications} />
                </div>
                <div className="space-y-6">
                    <NutritionalJournal meals={meals} setActiveTab={setActiveTab} />
                    <MindfulnessMoment setActiveTab={setActiveTab} />
                    <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral mb-4 text-center">Log Activity</h2>
                        <button onClick={() => setIsModalOpen(true)} className="w-full bg-secondary dark:bg-dark-secondary text-primary-content dark:text-dark-primary-content font-bold py-3 rounded-lg hover:opacity-90 transition-colors">
                            Log a Workout Session
                        </button>
                    </div>
                </div>
            </div>
            
            <footer className="text-center mt-8">
                <p className="text-neutral/60 dark:text-dark-neutral/60 font-semibold">POWERED BY - ARUN SINGH YADAV</p>
            </footer>
            {isModalOpen && <LogWorkoutModal onClose={() => setIsModalOpen(false)} addWorkoutLog={addWorkoutLog} />}
        </div>
    )
}

export default Dashboard;
