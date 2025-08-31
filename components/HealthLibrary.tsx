import React, { useState } from 'react';
import { getHealthTopicInfo } from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import BrainIcon from './icons/BrainIcon';
import LeafIcon from './icons/LeafIcon';
import DumbbellIcon from './icons/DumbbellIcon';
import MoonIcon from './icons/MoonIcon';


interface HealthLibraryState {
    content: string;
    sources: any[];
}

const popularTopics = [
    { name: 'Mental Wellness', icon: <BrainIcon className="w-8 h-8 mx-auto mb-2 text-primary dark:text-dark-primary" />, query: 'The importance of mental wellness and daily practices' },
    { name: 'Nutrition 101', icon: <LeafIcon className="w-8 h-8 mx-auto mb-2 text-primary dark:text-dark-primary" />, query: 'Basic principles of a healthy and balanced diet' },
    { name: 'Fitness Fundamentals', icon: <DumbbellIcon className="w-8 h-8 mx-auto mb-2 text-primary dark:text-dark-primary" />, query: 'Beginner guide to effective exercise and physical activity' },
    { name: 'Sleep Hygiene', icon: <MoonIcon className="w-8 h-8 mx-auto mb-2 text-primary dark:text-dark-primary" />, query: 'Tips and techniques for improving sleep quality' },
];


const HealthLibrary: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState<HealthLibraryState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTopicInfo = async (topicToFetch: string, displayTopic?: string) => {
        if (!topicToFetch.trim()) return;

        setTopic(displayTopic || topicToFetch);
        setIsLoading(true);
        setError(null);
        setResult(null);

        // Scroll to the top to see loading spinner/results
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            const data = await getHealthTopicInfo(topicToFetch);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchTopicInfo(topic);
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-neutral dark:text-dark-neutral">Health & Wellness Library</h1>
                <p className="text-neutral/60 dark:text-dark-neutral/60 mt-2">Explore health topics, get clear explanations, and learn how to improve your well-being.</p>
            </header>

            {(isLoading || result) && (
                <div className="bg-base-200 dark:bg-dark-base-200 p-8 rounded-2xl shadow-md min-h-[200px] flex items-center justify-center animate-fade-in">
                {isLoading && <Spinner />}
                {result && !isLoading && (
                    <div className="prose max-w-none text-neutral dark:text-dark-neutral">
                        <div className="flex items-center gap-2 mb-4">
                            <SparklesIcon className="w-6 h-6 text-primary dark:text-dark-primary"/>
                            <h2 className="font-bold text-2xl m-0 capitalize">{topic}</h2>
                        </div>
                        {result.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="leading-relaxed">{paragraph}</p>
                        ))}

                        {result.sources.length > 0 && (
                            <div className="mt-8">
                                <h3 className="font-semibold text-lg">Sources:</h3>
                                <ul className="list-disc list-inside text-sm">
                                    {result.sources.map((source, index) => (
                                        <li key={index}>
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-dark-primary hover:underline">
                                                {source.web.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md">
                <label htmlFor="search-topic" className="block text-lg font-semibold mb-2 text-neutral dark:text-dark-neutral">Search for a Topic</label>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        id="search-topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Benefits of a balanced diet"
                        className="w-full px-4 py-3 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center bg-primary dark:bg-dark-primary text-primary-content dark:text-dark-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:bg-primary-focus dark:hover:bg-dark-primary-focus disabled:bg-primary/50 dark:disabled:bg-dark-primary/50"
                        disabled={isLoading || !topic.trim()}
                    >
                        {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2"/>}
                        <span>{isLoading ? 'Researching...' : 'Learn'}</span>
                    </button>
                </div>
                {error && <p className="text-error mt-4 text-sm">{error}</p>}
            </form>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-neutral dark:text-dark-neutral mb-4">Explore Popular Topics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {popularTopics.map(p => (
                        <button key={p.name} onClick={() => fetchTopicInfo(p.query, p.name)} disabled={isLoading} className="bg-base-200 dark:bg-dark-base-200 p-6 rounded-2xl shadow-md text-center hover:bg-primary/10 dark:hover:bg-dark-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                            {p.icon}
                            <p className="font-semibold text-neutral dark:text-dark-neutral">{p.name}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HealthLibrary;