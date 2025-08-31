
import React from 'react';
import { StepEntry } from '../types';

interface StepChartProps {
    entries: StepEntry[];
}

const StepChart: React.FC<StepChartProps> = ({ entries }) => {
    const last7Days = entries.slice(-7);
    if (last7Days.length === 0) return null;

    const maxSteps = Math.max(...last7Days.map(e => e.count), 10000); // 10k goal as baseline

    return (
        <div className="bg-base-100 dark:bg-dark-base-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4 text-neutral dark:text-dark-neutral">Steps Last 7 Days</h3>
            <div className="flex justify-around items-end h-48 gap-2" aria-label="Step count chart for the last 7 days">
                {last7Days.map(entry => {
                    const barHeight = (entry.count / maxSteps) * 100;
                    const date = new Date(entry.date);
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
                    
                    return (
                        <div key={entry.id} className="flex flex-col items-center flex-1 h-full justify-end">
                            <div className="text-sm font-semibold text-primary dark:text-dark-primary">{entry.count.toLocaleString()}</div>
                            <div 
                                className={`w-full rounded-t-md ${entry.count >= 10000 ? 'bg-success' : 'bg-info'}`}
                                style={{ height: `${barHeight}%` }}
                                role="presentation"
                                aria-label={`Steps on ${day}: ${entry.count.toLocaleString()}`}
                            ></div>
                            <div className="text-xs mt-1 text-neutral/60 dark:text-dark-neutral/60">{day}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default StepChart;
