import React, { useState } from 'react';
import { Meal, SleepEntry, WorkoutLog } from '../types';
import { generateWeeklyReport } from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';

interface WeeklyReportProps {
    meals: Meal[];
    sleepEntries: SleepEntry[];
    workoutLogs: WorkoutLog[];
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ meals, sleepEntries, workoutLogs }) => {
    const [report, setReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const weeklyMeals = meals.filter(m => new Date(m.id) >= sevenDaysAgo);
            const weeklySleep = sleepEntries.filter(s => new Date(s.date) >= sevenDaysAgo);
            const weeklyWorkouts = workoutLogs.filter(w => new Date(w.date) >= sevenDaysAgo);
            
            const generatedReport = await generateWeeklyReport({
                meals: weeklyMeals,
                sleep: weeklySleep,
                workouts: weeklyWorkouts,
            });
            setReport(generatedReport);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-neutral">Weekly Health Report</h1>
                <p className="text-neutral/60 mt-2">Generate an AI-powered summary of your week with personalized insights.</p>
            </header>

            <div className="bg-base-200 p-6 rounded-2xl shadow-md text-center">
                 <button onClick={handleGenerate} disabled={isLoading} className="bg-primary text-primary-content font-bold px-6 py-4 rounded-lg shadow-sm hover:bg-primary-focus disabled:bg-primary/50 flex items-center justify-center w-full sm:w-auto sm:mx-auto">
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-6 h-6 mr-2" />}
                    <span>{isLoading ? 'Analyzing Your Week...' : 'Generate This Week\'s Report'}</span>
                 </button>
                 {error && <p className="text-error mt-4">{error}</p>}
            </div>

            {isLoading && (
                <div className="bg-base-200 p-8 rounded-2xl shadow-md min-h-[200px] flex items-center justify-center">
                    <Spinner />
                </div>
            )}

            {report && (
                <div className="bg-base-200 p-8 rounded-2xl shadow-md">
                     <div className="prose max-w-none text-neutral whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: report.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^- /gm, '&bull; ').replace(/\n/g, '<br />') }}>
                    </div>
                </div>
            )}
             {!report && !isLoading && (
                 <div className="text-center py-10 bg-base-200 rounded-2xl">
                    <DocumentTextIcon className="w-20 h-20 mx-auto text-neutral/20"/>
                    <p className="mt-4 text-neutral/60">Your weekly report will appear here once generated.</p>
                 </div>
             )}
        </div>
    );
};

export default WeeklyReport;