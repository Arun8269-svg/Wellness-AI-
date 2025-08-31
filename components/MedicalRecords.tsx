import React, { useState } from 'react';
import { MedicalRecord } from '../types';
import { summarizeHealthRecords } from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

interface MedicalRecordsProps {
    records: MedicalRecord;
}

const RecordSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-xl font-bold text-primary dark:text-dark-primary border-b-2 border-primary/20 pb-2 mb-3">{title}</h2>
        {children}
    </div>
);

const MedicalRecords: React.FC<MedicalRecordsProps> = ({ records }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setError(null);
        setSummary(null);
        try {
            const result = await summarizeHealthRecords(records);
            setSummary(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not generate summary');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-4xl font-bold text-neutral">Medical Records</h1>
                <p className="text-neutral/60 mt-2">A secure and centralized view of your health history.</p>
            </header>

            <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md">
                <button onClick={handleGenerateSummary} disabled={isLoading} className="w-full sm:w-auto flex items-center justify-center bg-secondary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 disabled:bg-secondary/50">
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                    <span>{isLoading ? 'Generating...' : 'Generate AI Health Summary'}</span>
                </button>
                 {error && <p className="text-sm text-center text-error mt-2">{error}</p>}

                 {summary && (
                     <blockquote className="mt-4 bg-base-100 dark:bg-dark-base-100 p-4 rounded-lg border-l-4 border-info">
                         <p className="italic text-neutral dark:text-dark-neutral">{summary}</p>
                     </blockquote>
                 )}
            </div>

            <div className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md space-y-6">
                <RecordSection title="Allergies">
                    <ul className="list-disc list-inside space-y-1">
                        {records.allergies.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </RecordSection>

                <RecordSection title="Conditions">
                    <ul className="list-disc list-inside space-y-1">
                        {records.conditions.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </RecordSection>

                 <RecordSection title="Lab Results">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="p-2">Test</th>
                                    <th className="p-2">Result</th>
                                    <th className="p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.labResults.map(item => (
                                    <tr key={item.test} className="border-b border-base-300/50">
                                        <td className="p-2 font-semibold">{item.test}</td>
                                        <td className="p-2">{item.result}</td>
                                        <td className="p-2">{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </RecordSection>

                 <RecordSection title="Immunizations">
                     <ul className="list-disc list-inside space-y-1">
                        {records.immunizations.map(item => <li key={item.vaccine}>{item.vaccine} ({item.date})</li>)}
                    </ul>
                </RecordSection>
            </div>
        </div>
    );
};

export default MedicalRecords;
