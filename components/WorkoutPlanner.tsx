import React, { useState } from 'react';
import { generateWorkoutPlan, suggestMusic } from '../services/geminiService';
import { WorkoutPlan } from '../types';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

const WorkoutPlanner: React.FC = () => {
  const [goal, setGoal] = useState('build muscle');
  const [days, setDays] = useState(3);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [musicSuggestions, setMusicSuggestions] = useState<string[]>([]);
  const [isMusicLoading, setIsMusicLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPlan(null);
    setMusicSuggestions([]);

    try {
      const newPlan = await generateWorkoutPlan(goal, days);
      setPlan(newPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMusicSuggest = async () => {
    if(!plan) return;
    setIsMusicLoading(true);
    setMusicSuggestions([]);
    try {
        const focus = plan[0]?.focus || goal;
        const suggestions = await suggestMusic(focus);
        setMusicSuggestions(suggestions);
    } catch (err) {
        // Simple error display for this feature
        setMusicSuggestions(["Could not fetch suggestions."]);
    } finally {
        setIsMusicLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-neutral">AI Workout Planner</h1>
        <p className="text-neutral/60 mt-2">Describe your fitness goal and let AI create a custom workout plan for you.</p>
      </header>
      
      <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-2xl shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="goal" className="block text-sm font-medium text-neutral mb-1">Fitness Goal</label>
                <input
                    id="goal"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Lose weight, improve cardio"
                    className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                    disabled={isLoading}
                />
            </div>
            <div>
                 <label htmlFor="days" className="block text-sm font-medium text-neutral mb-1">Days per week</label>
                <select 
                    id="days"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                    disabled={isLoading}
                >
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={4}>4 days</option>
                    <option value={5}>5 days</option>
                </select>
            </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-primary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:bg-primary-focus disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading || !goal.trim()}
        >
            {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2"/>}
            <span>{isLoading ? 'Generating Plan...' : 'Generate Plan'}</span>
        </button>
        {error && <p className="text-error text-sm text-center">{error}</p>}
      </form>

      {plan && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-neutral">Your Custom Workout Plan</h2>
            <button onClick={handleMusicSuggest} disabled={isMusicLoading} className="flex items-center justify-center bg-secondary text-primary-content font-bold px-4 py-2 rounded-lg shadow-sm hover:opacity-90 disabled:bg-secondary/50 transition-colors whitespace-nowrap">
                {isMusicLoading ? <Spinner/> : '🎵 Suggest Music'}
            </button>
          </div>

          {musicSuggestions.length > 0 && (
              <div className="bg-base-200 p-4 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg">Workout Vibe</h3>
                  <ul className="list-disc list-inside mt-2 text-neutral/80">
                      {musicSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
              </div>
          )}

          {plan.map((day, index) => (
            <div key={index} className="bg-base-200 p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-xl text-primary">{day.day}: <span className="text-neutral">{day.focus}</span></h3>
              <ul className="mt-4 divide-y divide-base-300">
                <li className="py-2 grid grid-cols-3 gap-4 font-semibold text-sm text-neutral/70">
                    <span className="col-span-2 sm:col-span-1">Exercise</span>
                    <span className="text-center">Sets</span>
                    <span className="text-center">Reps</span>
                </li>
                {day.exercises.map((exercise, i) => (
                  <li key={i} className="py-3 grid grid-cols-3 gap-4 items-center">
                    <span className="col-span-2 sm:col-span-1 font-medium">{exercise.name}</span>
                    <span className="text-center text-neutral/80">{exercise.sets}</span>
                    <span className="text-center text-neutral/80">{exercise.reps}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;