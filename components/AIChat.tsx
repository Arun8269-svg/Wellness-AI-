import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

const GENERAL_PROMPT = 'You are a friendly and helpful AI assistant for a wellness app. Provide safe, general, and encouraging advice on health, fitness, and nutrition. You are not a medical professional. Always remind users to consult with a doctor or qualified professional for any personal health concerns. Keep responses concise and easy to read.';

const DOCTOR_PROMPT = 'You are acting as an AI virtual doctor for a preliminary consultation. Your primary goal is to help the user structure their concerns. You MUST start your first response with a clear disclaimer in bold: "**Disclaimer: I am an AI assistant, not a medical professional. This is not a diagnosis. Please consult a qualified healthcare provider for any medical advice.**" After the disclaimer, guide the user by asking clarifying questions about their symptoms (e.g., "What are your main symptoms?", "How long have you been experiencing this?", "On a scale of 1-10, how severe is it?"). Provide general information only and always strongly advise consulting a real doctor for diagnosis and treatment.';


const AIChat: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDoctorMode, setIsDoctorMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initializeChat = (doctorMode: boolean) => {
        if (!process.env.API_KEY) {
            console.error("API_KEY is not set");
            return;
        }
        setIsLoading(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = doctorMode ? DOCTOR_PROMPT : GENERAL_PROMPT;
        // FIX: Explicitly type `welcomeMessage` as `ChatMessage` to ensure the `role` property is not widened to `string`.
        const welcomeMessage: ChatMessage = doctorMode 
            ? { role: 'model', text: '**Disclaimer: I am an AI assistant, not a medical professional. This is not a diagnosis. Please consult a qualified healthcare provider for any medical advice.**\n\nI can help you structure your concerns for a real doctor. To start, please describe your main symptoms.' }
            : { role: 'model', text: 'Hello! How can I help you on your wellness journey today? You can ask me about nutrition, fitness, or general health topics.' };

        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        setChat(chatInstance);
        setMessages([welcomeMessage]);
        setIsLoading(false);
    }

    useEffect(() => {
        initializeChat(isDoctorMode);
    }, [isDoctorMode]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (messageText: string) => {
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
        sendMessage(input);
        setInput('');
    };
    
    const handleSuggestionClick = (prompt: string) => {
        sendMessage(prompt);
    };

    const suggestionPrompts = [
        "How can I get better sleep?",
        "Quick mindfulness exercise",
        "Benefits of hydration"
    ];


    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-neutral">AI Health Chat</h1>
                <p className="text-neutral/60 mt-2">Ask general questions or switch to consultation mode to structure your health concerns.
                    <br/><strong className="text-warning">Not a substitute for professional medical advice.</strong>
                </p>
            </header>
            <div className="bg-base-200 shadow-md rounded-2xl flex flex-col h-[65vh]">
                <div className="p-4 border-b border-base-300 flex justify-between items-center">
                    <h2 className="font-bold text-lg">{isDoctorMode ? 'Doctor Consultation Mode' : 'General Wellness Chat'}</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Consultation Mode</span>
                        <input type="checkbox" className="toggle toggle-primary" checked={isDoctorMode} onChange={() => setIsDoctorMode(!isDoctorMode)} />
                    </div>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-content' : (isDoctorMode ? 'bg-info/10' : 'bg-base-100')}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-start">
                           <div className="max-w-lg p-3 rounded-2xl bg-base-100 flex items-center">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-base-300 bg-base-200/50 rounded-b-2xl">
                    {!isDoctorMode && <div className="mb-2 flex flex-wrap gap-2">
                        {suggestionPrompts.map(prompt => (
                             <button
                                key={prompt}
                                type="button"
                                onClick={() => handleSuggestionClick(prompt)}
                                className="px-3 py-1 text-xs bg-base-100 border border-base-300 rounded-full hover:bg-primary/10 hover:border-primary transition-colors text-neutral/80 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isDoctorMode ? "Describe your symptoms..." : "Type your message..."}
                            className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:bg-primary-focus disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AIChat;