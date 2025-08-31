import React, { useState } from 'react';
import { SleepEntry } from '../types';
import SleepChart from './SleepChart';

interface SleepLoggerProps {
    sleepEntries: SleepEntry[];
    addSleepEntry: (entry: Omit<SleepEntry, 'id' | 'date'>) => void;
}

const SleepLogger: React.FC<SleepLoggerProps> = ({ sleepEntries, addSleepEntry }) => {
    const [duration, setDuration] = useState(7.5);
    const [quality, setQuality] = useState<'good' | 'poor' | 'fair' | 'excellent'>('good');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        if (sleepEntries.some(entry => entry.date === today)) {
            setError("You've already logged your sleep for today.");
            return;
        }
        setError('');
        addSleepEntry({ duration, quality });
    }

    const qualityOptions: { value: SleepEntry['quality'], label: string, emoji: string }[] = [
        { value: 'poor', label: 'Poor', emoji: '😫' },
        { value: 'fair', label: 'Fair', emoji: '😕' },
        { value: 'good', label: 'Good', emoji: '😊' },
        { value: 'excellent', label: 'Excellent', emoji: '🤩' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-neutral">Sleep Tracker</h1>
                <p className="text-neutral/60 mt-2">Log your nightly sleep to find patterns and improve your rest.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="lg:col-span-1 bg-base-200 p-6 rounded-2xl shadow-md space-y-6 h-fit">
                    <h2 className="text-xl font-bold text-neutral">Log Today's Sleep</h2>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-neutral mb-2">Duration (hours)</label>
                        <input
                            id="duration"
                            type="number"
                            step="0.1"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral mb-2">Quality</label>
                        <div className="grid grid-cols-2 gap-2">
                            {qualityOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setQuality(opt.value)}
                                    className={`p-3 rounded-lg text-center font-semibold transition-colors ${quality === opt.value ? 'bg-primary text-primary-content ring-2 ring-primary-focus' : 'bg-base-100 hover:bg-primary/20'}`}
                                >
                                    {opt.emoji} {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-content font-bold py-3 rounded-lg hover:bg-primary-focus transition-colors">
                        Save Log
                    </button>
                     {error && <p className="text-error text-sm text-center">{error}</p>}
                </form>

                <div className="lg:col-span-2 bg-base-200 p-6 rounded-2xl shadow-md space-y-4">
                    {sleepEntries.length > 0 && <SleepChart entries={sleepEntries} />}
                    <div>
                        <h2 className="text-xl font-bold text-neutral mb-4">Sleep History</h2>
                        {sleepEntries.length > 0 ? (
                            <ul className="space-y-3 max-h-96 overflow-y-auto">
                                {sleepEntries.map(entry => (
                                    <li key={entry.id} className="flex justify-between items-center bg-base-100 p-3 rounded-lg">
                                        <span className="font-medium text-neutral">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-semibold capitalize px-3 py-1 text-sm rounded-full ${entry.quality === 'excellent' || entry.quality === 'good' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{entry.quality}</span>
                                            <span className="font-semibold text-primary w-20 text-right">{entry.duration.toFixed(1)} hours</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-neutral/60 py-4">No sleep logged yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SleepLogger;
