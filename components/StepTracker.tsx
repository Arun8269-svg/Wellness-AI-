
import React, { useState, useMemo } from 'react';
import { StepEntry } from '../types';
import StepChart from './StepChart';
import FootprintsIcon from './icons/FootprintsIcon';

interface StepTrackerProps {
    entries: StepEntry[];
    goal: number;
    logSteps: (count: number) => void;
}

const StepTracker: React.FC<StepTrackerProps> = ({ entries, goal, logSteps }) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(e => e.date === today);
    const [steps, setSteps] = useState(todayEntry ? String(todayEntry.count) : '');

    React.useEffect(() => {
        const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0]);
        setSteps(todayEntry ? String(todayEntry.count) : '');
    }, [entries]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (steps === '' || Number(steps) < 0) return;
        logSteps(Number(steps));
    };
    
    const sortedEntries = useMemo(() => [...entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [entries]);

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-4xl font-bold text-neutral dark:text-dark-neutral">Step Tracker</h1>
                <p className="text-neutral/60 dark:text-dark-neutral/60 mt-2">Monitor your daily steps and activity levels.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="lg:col-span-1 bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md space-y-4 h-fit">
                    <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral">Log Today's Steps</h2>
                    <div>
                        <label htmlFor="steps" className="block text-sm font-medium">Number of steps</label>
                        <input id="steps" type="number" value={steps} onChange={e => setSteps(e.target.value)} required className="w-full mt-1 px-4 py-2 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg"/>
                    </div>
                    <button type="submit" className="w-full bg-primary dark:bg-dark-primary text-primary-content dark:text-dark-primary-content font-bold py-3 rounded-lg hover:bg-primary-focus dark:hover:bg-dark-primary-focus">Update Steps</button>
                </form>
                
                <div className="lg:col-span-2 bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md space-y-6">
                    <StepChart entries={sortedEntries} />
                    <div>
                        <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral mb-4">Step History</h2>
                        {sortedEntries.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {sortedEntries.map(entry => (
                                    <div key={entry.id} className={`bg-base-100 dark:bg-dark-base-100 p-3 rounded-lg flex justify-between items-center border-l-4 ${entry.count >= goal ? 'border-success' : 'border-transparent'}`}>
                                       <p className="font-semibold text-sm">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                       <p className="font-bold text-lg text-primary dark:text-dark-primary">{entry.count.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <FootprintsIcon className="w-16 h-16 mx-auto text-neutral/20 dark:text-dark-neutral/20"/>
                                <p className="mt-4 text-neutral/60 dark:text-dark-neutral/60">No step data logged yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <footer className="text-center mt-8">
                <p className="text-neutral/60 dark:text-dark-neutral/60 font-semibold">Thank You For Visit</p>
            </footer>
        </div>
    );
};

export default StepTracker;
