import React from 'react';
import { GlucoseEntry } from '../types';

interface GlucoseChartProps {
    entries: GlucoseEntry[];
}

const GlucoseChart: React.FC<GlucoseChartProps> = ({ entries }) => {
    if (entries.length < 2) {
        return (
            <div className="bg-base-100 dark:bg-dark-base-100 p-4 rounded-lg text-center h-64 flex items-center justify-center">
                <p className="text-neutral/60 dark:text-dark-neutral/60">Log at least two entries to see a trend chart.</p>
            </div>
        );
    }

    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last30Entries = sortedEntries.slice(-30);

    const maxValue = Math.max(...last30Entries.map(e => e.level));
    const minValue = Math.min(...last30Entries.map(e => e.level));

    const range = maxValue - minValue;
    const padding = range * 0.1 || 10;
    const effectiveMax = maxValue + padding;
    const effectiveMin = Math.max(0, minValue - padding);
    const effectiveRange = effectiveMax - effectiveMin;

    const points = last30Entries.map((entry, index) => {
        const x = (index / (last30Entries.length - 1)) * 100;
        const y = 100 - ((entry.level - effectiveMin) / (effectiveRange || 1)) * 100;
        return { x, y, value: entry.level, date: entry.date, context: entry.context };
    });

    const pathData = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    
    const contextColors = {
        fasting: 'fill-info',
        post_meal: 'fill-success',
        random: 'fill-warning',
    };

    return (
        <div className="bg-base-100 dark:bg-dark-base-100 p-4 rounded-lg">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-neutral dark:text-dark-neutral">Glucose Trend (mg/dL)</h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-info"></div>Fasting</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-success"></div>Post-Meal</div>
                     <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-warning"></div>Random</div>
                </div>
            </div>
            <div className="h-56 w-full" aria-label={`Chart of Glucose over the last 30 entries.`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                    <path d={pathData} fill="none" strokeWidth="1" className="stroke-primary dark:stroke-dark-primary" />
                    {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="1.5" className={contextColors[p.context]}>
                            <title>{`${new Date(p.date).toLocaleDateString()}: ${p.value} mg/dL (${p.context})`}</title>
                        </circle>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default GlucoseChart;