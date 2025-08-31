import React, { useState, useMemo } from 'react';
import { HealthMetric, MetricEntry } from '../types';
import MetricChart from './MetricChart';
import ChartBarIcon from './icons/ChartBarIcon';

interface HealthMetricsTrackerProps {
    metrics: HealthMetric[];
    entries: MetricEntry[];
    addMetric: (metric: Omit<HealthMetric, 'id'>) => void;
    addEntry: (entry: Omit<MetricEntry, 'id' | 'date'>) => void;
}

const AddEntryModal: React.FC<{ metric: HealthMetric, onClose: () => void, onSave: (entry: Omit<MetricEntry, 'id' | 'date'>) => void }> = ({ metric, onClose, onSave }) => {
    const [value, setValue] = useState('');
    const [note, setNote] = useState('');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value) return;
        onSave({ metricId: metric.id, value: Number(value), note });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <form className="bg-base-200 rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
                <h2 className="text-2xl font-bold text-neutral">Log for {metric.name}</h2>
                <div>
                    <label htmlFor="value" className="block text-sm font-medium text-neutral mb-1">Value ({metric.unit})</label>
                    <input id="value" type="number" step="any" value={value} onChange={e => setValue(e.target.value)} required className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary"/>
                </div>
                 <div>
                    <label htmlFor="note" className="block text-sm font-medium text-neutral mb-1">Note (Optional)</label>
                    <input id="note" type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary"/>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-base-300 font-semibold hover:bg-base-300/80">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-primary-content font-semibold hover:bg-primary-focus">Save</button>
                </div>
            </form>
        </div>
    )
}

const HealthMetricsTracker: React.FC<HealthMetricsTrackerProps> = ({ metrics, entries, addMetric, addEntry }) => {
    const [newMetricName, setNewMetricName] = useState('');
    const [newMetricUnit, setNewMetricUnit] = useState('');
    const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
    const [modalMetric, setModalMetric] = useState<HealthMetric | null>(null);
    
    React.useEffect(() => {
        if (!selectedMetricId && metrics.length > 0) {
            setSelectedMetricId(metrics[0].id);
        }
         if(selectedMetricId && !metrics.find(m => m.id === selectedMetricId)){
            setSelectedMetricId(metrics[0]?.id || null);
        }
    }, [metrics, selectedMetricId]);

    const handleAddMetric = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMetricName.trim() || !newMetricUnit.trim()) return;
        addMetric({ name: newMetricName, unit: newMetricUnit });
        setNewMetricName('');
        setNewMetricUnit('');
    };
    
    const entriesByMetric = useMemo(() => {
        return entries.reduce((acc, entry) => {
            if (!acc[entry.metricId]) acc[entry.metricId] = [];
            acc[entry.metricId].push(entry);
            return acc;
        }, {} as Record<string, MetricEntry[]>);
    }, [entries]);

    const selectedMetric = metrics.find(m => m.id === selectedMetricId);
    const selectedMetricEntries = (entriesByMetric[selectedMetricId || ''] || []).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
      <div className="space-y-8">
        <header>
            <h1 className="text-4xl font-bold text-neutral">Health Metrics</h1>
            <p className="text-neutral/60 mt-2">Track custom health data like blood pressure, weight, or glucose levels.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                 <form onSubmit={handleAddMetric} className="bg-base-200 p-6 rounded-2xl shadow-md space-y-4">
                    <h2 className="text-xl font-bold text-neutral">Add a New Metric</h2>
                    <input type="text" value={newMetricName} onChange={e => setNewMetricName(e.target.value)} placeholder="Metric Name (e.g., Weight)" required className="w-full px-4 py-2 bg-base-100 border-base-300 rounded-lg"/>
                    <input type="text" value={newMetricUnit} onChange={e => setNewMetricUnit(e.target.value)} placeholder="Unit (e.g., kg)" required className="w-full px-4 py-2 bg-base-100 border-base-300 rounded-lg"/>
                    <button type="submit" className="w-full bg-primary text-primary-content font-bold py-2 rounded-lg hover:bg-primary-focus">Add Metric</button>
                 </form>

                 <div className="bg-base-200 p-6 rounded-2xl shadow-md">
                     <h2 className="text-xl font-bold text-neutral mb-4">Tracked Metrics</h2>
                     {metrics.length > 0 ? (
                         <ul className="space-y-2">
                             {metrics.map(metric => (
                                 <li key={metric.id}>
                                     <button onClick={() => setSelectedMetricId(metric.id)} className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-colors ${selectedMetricId === metric.id ? 'bg-primary/20' : 'hover:bg-base-100'}`}>
                                         <div>
                                            <p className="font-semibold">{metric.name}</p>
                                            <p className="text-xs text-neutral/60">
                                                Last: {(entriesByMetric[metric.id]?.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.value) || 'N/A'} {metric.unit}
                                            </p>
                                         </div>
                                         <span onClick={(e) => { e.stopPropagation(); setModalMetric(metric); }} className="px-3 py-1 text-sm rounded-md bg-secondary text-primary-content hover:opacity-80">Log +</span>
                                     </button>
                                 </li>
                             ))}
                         </ul>
                     ) : <p className="text-neutral/60 text-center py-4">No metrics added yet.</p>}
                 </div>
            </div>
            <div className="lg:col-span-2 bg-base-200 p-6 rounded-2xl shadow-md min-h-[400px]">
                {selectedMetric ? (
                    <div className="space-y-4">
                        <MetricChart metricName={selectedMetric.name} entries={selectedMetricEntries}/>
                        <h3 className="text-lg font-bold">History for {selectedMetric.name}</h3>
                        <div className="max-h-48 overflow-y-auto mt-2 space-y-1 pr-2">
                            {selectedMetricEntries.length > 0 ? selectedMetricEntries.slice().reverse().map(entry => (
                                <div key={entry.id} className="text-sm flex justify-between bg-base-100 p-2 rounded items-center">
                                    <div>
                                        <span className="font-semibold">{new Date(entry.date).toLocaleDateString()}</span>
                                        {entry.note && <p className="text-xs text-neutral/60 italic">"{entry.note}"</p>}
                                    </div>
                                    <span className="font-bold text-primary">{entry.value} {selectedMetric.unit}</span>
                                </div>
                            )) : <p className="text-sm text-neutral/60">No entries yet for this metric.</p>}
                        </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <ChartBarIcon className="w-16 h-16 text-neutral/20"/>
                        <p className="mt-4 text-neutral/60">Add a metric and log some data to see your trends here.</p>
                    </div>
                 )}
            </div>
        </div>
        {modalMetric && (
            <AddEntryModal metric={modalMetric} onClose={() => setModalMetric(null)} onSave={addEntry}/>
        )}
      </div>
    );
};

export default HealthMetricsTracker;