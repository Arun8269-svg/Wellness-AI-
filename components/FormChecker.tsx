import React, { useState, useRef } from 'react';
import { analyzeExerciseForm } from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import CameraIcon from './icons/CameraIcon';

const FormChecker: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [exerciseName, setExerciseName] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFeedback(null);
            setError(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !exerciseName.trim()) {
            setError('Please upload a video and enter the exercise name.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setFeedback(null);

        try {
            const videoBase64 = await fileToBase64(file);
            const result = await analyzeExerciseForm(videoBase64, file.type, exerciseName);
            setFeedback(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-neutral">AI Form Checker</h1>
                <p className="text-neutral/60 mt-2">Upload a short video of an exercise to get personalized feedback on your form.</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-2xl shadow-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        id="exerciseName"
                        type="text"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                        placeholder="e.g., Barbell Squat"
                        className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                        disabled={isLoading}
                        aria-label="Exercise Name"
                    />
                     <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center bg-base-100 border border-base-300 px-6 py-3 rounded-lg hover:bg-base-300/50 transition-colors">
                        <CameraIcon className="w-5 h-5 mr-2" />
                        <span>{file ? file.name : 'Choose Video'}</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                </div>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-primary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:bg-primary-focus disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
                    disabled={isLoading || !file || !exerciseName.trim()}
                >
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                    <span>{isLoading ? 'Analyzing...' : 'Analyze Form'}</span>
                </button>
                {error && <p className="text-error text-sm text-center">{error}</p>}
            </form>

            {feedback && (
                <div className="bg-base-200 p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold text-neutral mb-4">Feedback Report</h2>
                    <div className="prose max-w-none text-neutral whitespace-pre-wrap">
                        {feedback.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                         ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormChecker;
