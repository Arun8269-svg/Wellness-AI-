import React, { useState } from 'react';
import { BloodPressureEntry } from '../types';
import BloodPressureChart from './BloodPressureChart';
import HeartPulseIcon from './icons/HeartPulseIcon';

interface BloodPressureTrackerProps {
    entries: BloodPressureEntry[];
    addEntry: (entry: Omit<BloodPressureEntry, 'id' | 'date'>) => void;
}

const BloodPressureTracker: React.FC<BloodPressureTrackerProps> = ({ entries, addEntry }) => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!systolic || !diastolic) return;
        addEntry({
            systolic: Number(systolic),
            diastolic: Number(diastolic),
            pulse: pulse ? Number(pulse) : undefined,
            note
        });
        setSystolic('');
        setDiastolic('');
        setPulse('');
        setNote('');
    };
    
    const sortedEntries = [...entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-4xl font-bold text-neutral dark:text-dark-neutral">Blood Pressure Tracker</h1>
                <p className="text-neutral/60 dark:text-dark-neutral/60 mt-2">Monitor your blood pressure to stay on top of your cardiovascular health.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="lg:col-span-1 bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md space-y-4 h-fit">
                    <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral">Log New Reading</h2>
                    <div>
                        <label htmlFor="systolic" className="block text-sm font-medium">Systolic (mmHg)</label>
                        <input id="systolic" type="number" value={systolic} onChange={e => setSystolic(e.target.value)} required className="w-full mt-1 px-4 py-2 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="diastolic" className="block text-sm font-medium">Diastolic (mmHg)</label>
                        <input id="diastolic" type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)} required className="w-full mt-1 px-4 py-2 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="pulse" className="block text-sm font-medium">Pulse (BPM, optional)</label>
                        <input id="pulse" type="number" value={pulse} onChange={e => setPulse(e.target.value)} className="w-full mt-1 px-4 py-2 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="note" className="block text-sm font-medium">Note (optional)</label>
                        <input id="note" type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full mt-1 px-4 py-2 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg"/>
                    </div>
                    <button type="submit" className="w-full bg-primary dark:bg-dark-primary text-primary-content dark:text-dark-primary-content font-bold py-3 rounded-lg hover:bg-primary-focus dark:hover:bg-dark-primary-focus">Save Reading</button>
                </form>
                
                <div className="lg:col-span-2 bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md space-y-6">
                    <BloodPressureChart entries={entries} />
                    <div>
                        <h2 className="text-xl font-bold text-neutral dark:text-dark-neutral mb-4">Reading History</h2>
                        {sortedEntries.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {sortedEntries.map(entry => (
                                    <div key={entry.id} className="bg-base-100 dark:bg-dark-base-100 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-xs text-neutral/60 dark:text-dark-neutral/60">SYS</p>
                                                    <p className="font-bold text-lg text-error">{entry.systolic}</p>
                                                </div>
                                                <div className="text-center">
                                                     <p className="text-xs text-neutral/60 dark:text-dark-neutral/60">DIA</p>
                                                    <p className="font-bold text-lg text-info">{entry.diastolic}</p>
                                                </div>
                                                {entry.pulse && (
                                                    <div className="text-center">
                                                        <p className="text-xs text-neutral/60 dark:text-dark-neutral/60">BPM</p>
                                                        <p className="font-bold text-lg text-secondary">{entry.pulse}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-sm">{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                                <p className="text-xs text-neutral/60 dark:text-dark-neutral/60">{new Date(entry.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        {entry.note && <p className="text-xs italic text-neutral/70 dark:text-dark-neutral/70 mt-2">"{entry.note}"</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10">
                                <HeartPulseIcon className="w-16 h-16 mx-auto text-neutral/20 dark:text-dark-neutral/20"/>
                                <p className="mt-4 text-neutral/60 dark:text-dark-neutral/60">No readings logged yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BloodPressureTracker;