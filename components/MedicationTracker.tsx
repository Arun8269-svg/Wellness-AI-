import React, { useState, useRef } from 'react';
import { parsePrescription, getMedicationInfo } from '../services/geminiService';
import { Medication } from '../types';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import PillIcon from './icons/PillIcon';
import CameraIcon from './icons/CameraIcon';

interface MedicationTrackerProps {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id'>) => void;
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ medications, addMedication }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<Medication['frequency']>('daily');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const description = await getMedicationInfo(name);
      addMedication({
        name,
        dosage,
        frequency,
        description,
      });
      setName('');
      setDosage('');
      setFrequency('daily');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setError(null);

    try {
        const imageBase64 = await fileToBase64(file);
        const parsedData = await parsePrescription(imageBase64, file.type);
        if (parsedData.name) setName(parsedData.name);
        if (parsedData.dosage) setDosage(parsedData.dosage);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsParsing(false);
        // Reset file input to allow re-uploading the same file
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-neutral">Medication Tracker</h1>
        <p className="text-neutral/60 mt-2">Log your medications manually or by uploading a photo of your prescription.</p>
      </header>

      <div className="bg-base-200 p-6 rounded-2xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <h2 className="text-xl font-bold text-neutral md:col-span-2">Add a New Medication</h2>
             <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsing || isLoading}
                className="w-full flex items-center justify-center bg-secondary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 disabled:bg-secondary/50"
            >
                {isParsing ? <Spinner /> : <CameraIcon className="w-5 h-5 mr-2" />}
                <span>{isParsing ? 'Scanning...' : 'Add from Photo'}</span>
            </button>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             <p className="md:col-span-2 text-center text-neutral/60 text-sm">Or enter manually:</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Medication Name"
                className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary"
                disabled={isLoading || isParsing}
            />
            <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Dosage (e.g., 500mg)"
                className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary"
                disabled={isLoading || isParsing}
            />
            <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Medication['frequency'])}
                className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary"
                disabled={isLoading || isParsing}
            >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as_needed">As Needed</option>
            </select>
            </div>
            <button
            type="submit"
            className="w-full flex items-center justify-center bg-primary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:bg-primary-focus disabled:bg-primary/50"
            disabled={isLoading || isParsing || !name.trim() || !dosage.trim()}
            >
            {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2"/>}
            <span>{isLoading ? 'Saving...' : 'Add Medication'}</span>
            </button>
            {error && <p className="text-error mt-2 text-sm text-center">{error}</p>}
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral mb-4">Your Medications</h2>
        {medications.length > 0 ? (
          <div className="space-y-4">
            {medications.map((med) => (
              <div key={med.id} className="bg-base-200 p-5 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <PillIcon className="w-6 h-6 text-primary mt-1"/>
                    <div>
                        <h3 className="font-bold text-lg text-neutral">{med.name}</h3>
                        <p className="text-sm text-neutral/70 font-semibold">{med.dosage} - <span className="capitalize">{med.frequency.replace('_', ' ')}</span></p>
                        {med.description && <p className="text-sm mt-2 text-neutral/80 italic">"{med.description}"</p>}
                    </div>
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-base-200 rounded-2xl">
            <p className="text-neutral/60">No medications logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;