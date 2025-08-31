import React from 'react';
import { MetricEntry } from '../types';

interface MetricChartProps {
    entries: MetricEntry[];
    metricName: string;
}

const MetricChart: React.FC<MetricChartProps> = ({ entries, metricName }) => {
    if (entries.length < 2) {
        return (
             <div className="bg-base-100 p-4 rounded-lg text-center h-56 flex items-center justify-center">
                <p className="text-neutral/60">Log at least two entries for {metricName} to see a trend chart.</p>
            </div>
        )
    };

    const sortedEntries = [...entries].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last30Entries = sortedEntries.slice(-30);

    const maxValue = Math.max(...last30Entries.map(e => e.value));
    const minValue = Math.min(...last30Entries.map(e => e.value));
    
    // Add padding to min/max for better visualization
    const range = maxValue - minValue;
    const padding = range * 0.1 || 1;
    const effectiveMax = maxValue + padding;
    const effectiveMin = Math.max(0, minValue - padding);
    const effectiveRange = effectiveMax - effectiveMin;

    const points = last30Entries.map((entry, index) => {
        const x = (index / (last30Entries.length - 1)) * 100;
        const y = 100 - ((entry.value - effectiveMin) / (effectiveRange || 1)) * 100;
        return { x, y, value: entry.value, date: entry.date };
    });

    const pathData = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

    return (
        <div className="bg-base-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4 text-neutral">Trend for {metricName}</h3>
            <div className="h-48 w-full" aria-label={`Chart of ${metricName} over the last 30 entries.`}>
                 <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                    <path d={pathData} fill="none" strokeWidth="1" className="stroke-primary" />
                    {points.map(p => (
                         <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r="1.5" className="fill-primary-focus">
                             <title>{`${new Date(p.date).toLocaleDateString()}: ${p.value}`}</title>
                         </circle>
                    ))}
                 </svg>
            </div>
        </div>
    );
}

export default MetricChart;