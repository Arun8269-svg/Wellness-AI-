import React from 'react';
import { BloodPressureEntry } from '../types';

interface BloodPressureChartProps {
    entries: BloodPressureEntry[];
}

const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ entries }) => {
    if (entries.length < 2) {
        return (
             <div className="bg-base-100 dark:bg-dark-base-100 p-4 rounded-lg text-center h-64 flex items-center justify-center">
                <p className="text-neutral/60 dark:text-dark-neutral/60">Log at least two entries to see a trend chart.</p>
            </div>
        )
    };

    const sortedEntries = [...entries].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last30Entries = sortedEntries.slice(-30);

    const allValues = last30Entries.flatMap(e => [e.systolic, e.diastolic]);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    
    const range = maxValue - minValue;
    const padding = range * 0.1 || 10;
    const effectiveMax = maxValue + padding;
    const effectiveMin = Math.max(0, minValue - padding);
    const effectiveRange = effectiveMax - effectiveMin;

    const getPoints = (key: 'systolic' | 'diastolic') => last30Entries.map((entry, index) => {
        const x = (index / (last30Entries.length - 1)) * 100;
        const y = 100 - ((entry[key] - effectiveMin) / (effectiveRange || 1)) * 100;
        return { x, y, value: entry[key], date: entry.date };
    });
    
    const systolicPoints = getPoints('systolic');
    const diastolicPoints = getPoints('diastolic');
    
    const createPath = (points: {x: number, y: number}[]) => points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

    const systolicPath = createPath(systolicPoints);
    const diastolicPath = createPath(diastolicPoints);

    return (
        <div className="bg-base-100 dark:bg-dark-base-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-neutral dark:text-dark-neutral">Blood Pressure Trend (mmHg)</h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-error"></div>Systolic</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-info"></div>Diastolic</div>
                </div>
            </div>
            <div className="h-56 w-full" aria-label={`Chart of Blood Pressure over the last 30 entries.`}>
                 <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                    {/* BP zones */}
                    <rect x="0" y={100 - ((140 - effectiveMin) / effectiveRange) * 100} width="100" height={((181-140)/effectiveRange)*100} className="fill-error/10" />
                    <rect x="0" y={100 - ((120 - effectiveMin) / effectiveRange) * 100} width="100" height={((140-120)/effectiveRange)*100} className="fill-warning/10" />
                    
                    <path d={systolicPath} fill="none" strokeWidth="1" className="stroke-error" />
                    <path d={diastolicPath} fill="none" strokeWidth="1" className="stroke-info" />
                    
                    {systolicPoints.map((p, i) => (
                         <circle key={`sys-${i}`} cx={p.x} cy={p.y} r="1.5" className="fill-error">
                             <title>{`${new Date(p.date).toLocaleDateString()}: ${p.value} / ${diastolicPoints[i].value}`}</title>
                         </circle>
                    ))}
                    {diastolicPoints.map((p, i) => (
                         <circle key={`dia-${i}`} cx={p.x} cy={p.y} r="1.5" className="fill-info">
                              <title>{`${new Date(p.date).toLocaleDateString()}: ${systolicPoints[i].value} / ${p.value}`}</title>
                         </circle>
                    ))}
                 </svg>
            </div>
        </div>
    );
}

export default BloodPressureChart;