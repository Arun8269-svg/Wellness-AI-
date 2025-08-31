import React, { useState } from 'react';
import { generateMindfulnessScript, generateAffirmation } from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

interface StressEntry {
    level: number;
    note: string;
    date: string;
}

const StressJournal: React.FC = () => {
    const [entries, setEntries] = useState<StressEntry[]>([]);
    const [level, setLevel] = useState(3);
    const [note, setNote] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry = { level, note, date: new Date().toLocaleString() };
        setEntries(prev => [newEntry, ...prev]);
        setNote("");
        setLevel(3);
    }
    
    return (
        <div className="bg-base-200 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-neutral mb-4">Stress Journal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral mb-2">Current Stress Level: {level}/5</label>
                    <input type="range" min="1" max="5" value={level} onChange={e => setLevel(Number(e.target.value))} className="w-full" />
                </div>
                <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="What's on your mind? (Optional)"
                    className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                    rows={2}
                />
                <button type="submit" className="w-full bg-primary text-primary-content font-bold py-2 rounded-lg hover:bg-primary-focus transition-colors">Log Entry</button>
            </form>
            {entries.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Recent Entries</h3>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {entries.map(entry => (
                            <li key={entry.date} className="bg-base-100 p-3 rounded-lg text-sm">
                                <p><strong>Level: {entry.level}/5</strong> <span className="text-xs text-neutral/60 ml-2">{entry.date}</span></p>
                                {entry.note && <p className="mt-1 italic">"{entry.note}"</p>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const MindfulnessCorner: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState('');
  const [isAffirmationLoading, setIsAffirmationLoading] = useState(false);


  const moods = ['Stressed', 'Anxious', 'Overwhelmed', 'Need Focus'];

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    setIsLoading(true);
    setError(null);
    setScript('');
    setAffirmation(''); // Clear old affirmation

    try {
      const newScript = await generateMindfulnessScript(selectedMood);
      setScript(newScript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAffirmation = async () => {
      if(!mood) return;
      setIsAffirmationLoading(true);
      setAffirmation('');
      try {
        const newAffirmation = await generateAffirmation(mood);
        setAffirmation(newAffirmation);
      } catch (e) {
        setAffirmation("Could not generate an affirmation at this time.");
      } finally {
        setIsAffirmationLoading(false);
      }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-neutral">Mindfulness Corner</h1>
        <p className="text-neutral/60 mt-2">Take a moment to center yourself. Select how you're feeling for a guided exercise.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-base-200 p-6 rounded-2xl shadow-md space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral mb-4">How are you feeling right now?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMoodSelect(m)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      mood === m ? 'bg-primary text-primary-content' : 'bg-base-100 hover:bg-primary/20'
                    }`}
                    disabled={isLoading}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {mood && (
                <div>
                    <h2 className="text-lg font-semibold text-neutral mb-4">Daily Affirmation</h2>
                     <button onClick={handleGenerateAffirmation} disabled={isAffirmationLoading || isLoading} className="w-full flex items-center justify-center bg-secondary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 disabled:bg-secondary/50 disabled:cursor-not-allowed transition-colors">
                        {isAffirmationLoading ? <Spinner/> : <SparklesIcon className="w-5 h-5 mr-2"/>}
                        <span>Generate Affirmation for "{mood}"</span>
                    </button>
                    {affirmation && (
                        <div className="mt-4 bg-base-100 p-4 rounded-lg text-center italic text-lg">
                           "{affirmation}"
                        </div>
                    )}
                </div>
            )}
        </div>
        <StressJournal />
      </div>

      {(isLoading || error || script) && (
        <div className="bg-base-200 p-8 rounded-2xl shadow-md min-h-[200px] flex items-center justify-center">
          {isLoading && <Spinner />}
          {error && <p className="text-error">{error}</p>}
          {script && !isLoading && (
            <div className="prose max-w-none text-neutral">
              <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="w-5 h-5 text-primary"/>
                  <h3 className="font-bold text-xl m-0">A Moment for "<strong>{mood}</strong>"</h3>
              </div>
              {script.split('\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed">{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MindfulnessCorner;