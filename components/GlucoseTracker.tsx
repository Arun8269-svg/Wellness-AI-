import React, { useState } from 'react';
import { GlucoseEntry } from '../types';
import GlucoseChart from './GlucoseChart';
import BloodDropIcon from './icons/BloodDropIcon';

interface GlucoseTrackerProps {
    entries: GlucoseEntry[];
    addEntry: (entry: Omit<GlucoseEntry, 'id' | 'date'>) => void;
}

const GlucoseTracker: React.FC<GlucoseTrackerProps> = ({ entries, addEntry }) => {
    const [level, setLevel] = useState('');
    const [context, setContext] = useState<GlucoseEntry['context']>('fasting');
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!level) return;
        addEntry({
            level: Number(level),
            context,
            note
        });
        setLevel('');
        setContext('fasting');
        setNote('');
    };

    const sortedEntries = [...entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const getLevelClass = (level: number, context: GlucoseEntry['context']) => {
        if (context === 'fasting') {
            if (level < 70) return 'bg-info/20 text-info'; // Low
            if (level > 100) return 'bg-error/20 text-error'; // High
        }
        if (context === 'post_meal') {
            if (level > 140) return 'bg-error/20 text-error'; // High
        }
        return 'bg-success/20 text-success'; // Normal
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-4xl font-bold text-neutral dark:text-dark-neutral">Glucose Tracker</h1>
                <p className="text-neutral/60 dark:text-dark-neutral/60 mt-2">Log and monitor your blood glucose levels.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="lg:col-span-1 bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md space-y-4 h-fit">
                    <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral">Log New Reading</h2>
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium">Glucose Level (mg/dL)</label>
                        <input id="level" type="number" value={level} onChange={e => setLevel(e.target.value)} required className="w-full mt-1 px-4 py-2 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Context</label>
                        <select value={context} onChange={e => setContext(e.target.value as GlucoseEntry['context'])} className="w-full mt-1 px-4 py-2 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg">
                            <option value="fasting">Fasting</option>
                            <option value="post_meal">After Meal</option>
                            <option value="random">Random</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="note-glucose" className="block text-sm font-medium">Note (optional)</label>
                        <input id="note-glucose" type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full mt-1 px-4 py-2 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg"/>
                    </div>
                    <button type="submit" className="w-full bg-primary dark:bg-dark-primary text-primary-content dark:text-dark-primary-content font-bold py-3 rounded-lg hover:bg-primary-focus dark:hover:bg-dark-primary-focus">Save Reading</button>
                </form>
                
                <div className="lg:col-span-2 bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md space-y-6">
                    <GlucoseChart entries={entries} />
                    <div>
                        <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral mb-4">Reading History</h2>
                        {sortedEntries.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {sortedEntries.map(entry => (
                                    <div key={entry.id} className="bg-base-100 dark:bg-dark-base-100 p-3 rounded-lg flex justify-between items-center">
                                       <div>
                                            <p className="font-semibold text-sm">{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="text-xs capitalize text-neutral/60 dark:text-dark-neutral/60">{entry.context.replace('_', ' ')}</p>
                                       </div>
                                       <span className={`font-bold text-lg px-3 py-1 rounded-full ${getLevelClass(entry.level, entry.context)}`}>{entry.level}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <BloodDropIcon className="w-16 h-16 mx-auto text-neutral/20 dark:text-dark-neutral/20"/>
                                <p className="mt-4 text-neutral/60 dark:text-dark-neutral/60">No readings logged yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlucoseTracker;