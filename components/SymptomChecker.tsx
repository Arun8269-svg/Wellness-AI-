import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';
import Spinner from './Spinner';
import StethoscopeIcon from './icons/StethoscopeIcon';

const SYSTEM_PROMPT = 'You are an AI Symptom Checker. Your primary goal is to help a user understand their symptoms and structure them in a way that is helpful for a real medical professional. You must not provide a diagnosis or medical advice. Start your very first message with a clear disclaimer in bold: "**Disclaimer: I am an AI assistant, not a medical professional. This information is not a diagnosis. Please consult a qualified healthcare provider for any medical advice.**" After the disclaimer, guide the user by asking clarifying questions about their symptoms. Ask one question at a time. For example: "To start, please describe your main symptom.", then "How long have you been experiencing this?", "On a scale of 1-10, how severe is the discomfort?", "Are there any other symptoms you\'ve noticed?". After gathering sufficient information, provide a concise, bulleted summary of the user\'s reported symptoms, duration, and severity. End the summary by strongly recommending they share this information with a doctor.';

const WELCOME_MESSAGE: ChatMessage = {
    role: 'model',
    text: '**Disclaimer: I am an AI assistant, not a medical professional. This information is not a diagnosis. Please consult a qualified healthcare provider for any medical advice.**\n\nTo start, please describe your main symptom.'
};

const SymptomChecker: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!process.env.API_KEY) {
            console.error("API_KEY is not set");
            return;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: SYSTEM_PROMPT },
        });
        setChat(chatInstance);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: messageText });
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
        setInput('');
    };
    
    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-4xl font-bold text-neutral dark:text-dark-neutral">AI Symptom Checker</h1>
                <p className="text-neutral/60 dark:text-dark-neutral/60 mt-2">
                    Describe your symptoms to get a structured summary for your doctor.
                    <br/><strong className="text-error">This tool does not provide medical advice or diagnosis.</strong>
                </p>
            </header>
            <div className="bg-base-200 dark:bg-dark-base-200 shadow-md rounded-2xl flex flex-col h-[65vh]">
                <div className="p-4 border-b border-base-300 dark:border-dark-base-300 flex items-center gap-2">
                    <StethoscopeIcon className="w-6 h-6 text-primary dark:text-dark-primary"/>
                    <h2 className="font-bold text-lg text-neutral dark:text-dark-neutral">Symptom Analysis Session</h2>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-content dark:bg-dark-primary dark:text-dark-primary-content' : 'bg-base-100 dark:bg-dark-base-100'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                        <div className="max-w-lg p-3 rounded-2xl bg-base-100 dark:bg-dark-base-100 flex items-center">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-base-300 dark:border-dark-base-300 bg-base-200/50 dark:bg-dark-base-200/50 rounded-b-2xl">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe your symptom..."
                            className="w-full px-4 py-3 bg-base-100 dark:bg-dark-base-100 border border-base-300 dark:border-dark-base-300 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:outline-none transition"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary dark:bg-dark-primary text-primary-content dark:text-dark-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:bg-primary-focus dark:hover:bg-dark-primary-focus disabled:bg-primary/50 dark:disabled:bg-dark-primary/50 disabled:cursor-not-allowed transition-colors">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SymptomChecker;
