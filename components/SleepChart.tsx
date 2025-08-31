import React from 'react';
import { SleepEntry } from '../types';

interface SleepChartProps {
    entries: SleepEntry[];
}

const SleepChart: React.FC<SleepChartProps> = ({ entries }) => {
    const last7Days = entries.slice(0, 7).reverse();
    if (last7Days.length === 0) return null;

    const maxDuration = Math.max(...last7Days.map(e => e.duration), 8); 

    return (
        <div className="bg-base-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4 text-neutral">Sleep Last 7 Days (hours)</h3>
            <div className="flex justify-around items-end h-48 gap-2" aria-label="Sleep duration chart for the last 7 days">
                {last7Days.map(entry => {
                    const barHeight = (entry.duration / maxDuration) * 100;
                    const date = new Date(entry.date);
                    // Adjust for timezone to get the correct day
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
                    
                    return (
                        <div key={entry.id} className="flex flex-col items-center flex-1 h-full justify-end">
                            <div className="text-sm font-semibold text-primary">{entry.duration.toFixed(1)}</div>
                            <div 
                                className="w-full bg-info rounded-t-md"
                                style={{ height: `${barHeight}%` }}
                                role="presentation"
                                aria-label={`Sleep on ${day}: ${entry.duration.toFixed(1)} hours, quality was ${entry.quality}`}
                            ></div>
                            <div className="text-xs mt-1 text-neutral/60">{day}</div>
                        </div>
                    );
                })}
                 {Array.from({ length: Math.max(0, 7 - last7Days.length) }).map((_, i) => (
                    <div key={`placeholder-${i}`} className="flex-1"></div>
                ))}
            </div>
        </div>
    );
}

export default SleepChart;
