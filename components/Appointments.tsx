import React, { useState } from 'react';
import { Appointment } from '../types';
import { getAppointmentSlots } from '../services/geminiService';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import CalendarIcon from './icons/CalendarIcon';

interface AppointmentsProps {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
}

type SuggestedSlot = Omit<Appointment, 'id' | 'status' | 'reason'>;

const ScheduleModal: React.FC<{
    onClose: () => void;
    addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
}> = ({ onClose, addAppointment }) => {
    const [reason, setReason] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<SuggestedSlot[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim() || !date) return;
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        try {
            const result = await getAppointmentSlots(reason, date);
            setSuggestions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = (slot: SuggestedSlot) => {
        addAppointment({ ...slot, reason });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-base-200 dark:bg-dark-base-200 rounded-2xl shadow-xl p-6 w-full max-w-lg space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-neutral dark:text-dark-neutral">Schedule Appointment</h2>
                {!suggestions.length ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-neutral dark:text-dark-neutral mb-1">Reason for visit</label>
                            <input id="reason" type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Annual checkup, sore throat" required className="w-full px-4 py-3 bg-base-100 dark:bg-dark-base-100 border-base-300 rounded-lg"/>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-neutral dark:text-dark-neutral mb-1">Preferred Date</label>
                            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-3 bg-base-100 dark:bg-dark-base-100 border-base-300 rounded-lg"/>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-primary text-primary-content font-bold py-3 rounded-lg hover:bg-primary-focus disabled:opacity-50">
                            {isLoading ? <Spinner /> : <><SparklesIcon className="w-5 h-5 mr-2"/>Find Appointments</>}
                        </button>
                        {error && <p className="text-sm text-center text-error">{error}</p>}
                    </form>
                ) : (
                    <div>
                        <h3 className="font-semibold mb-2">Suggested Slots for "{reason}":</h3>
                        <div className="space-y-2">
                            {suggestions.map((slot, i) => (
                                <div key={i} className="bg-base-100 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{slot.doctor} <span className="text-xs font-normal text-neutral/60">({slot.specialty})</span></p>
                                        <p className="text-sm">{new Date(slot.date).toDateString()} at {slot.time}</p>
                                    </div>
                                    <button onClick={() => handleConfirm(slot)} className="px-3 py-1 text-sm bg-secondary text-primary-content rounded-md hover:opacity-80">Confirm</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 <button onClick={onClose} className="w-full mt-2 py-2 rounded-lg bg-base-300/50 hover:bg-base-300">Close</button>
            </div>
        </div>
    );
};


const Appointments: React.FC<AppointmentsProps> = ({ appointments, addAppointment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const upcoming = appointments.filter(a => a.status === 'upcoming');
    const completed = appointments.filter(a => a.status === 'completed');

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-neutral">Appointments</h1>
                    <p className="text-neutral/60 mt-2">Manage your upcoming and past appointments.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-content font-bold px-5 py-3 rounded-lg shadow-sm hover:bg-primary-focus flex items-center justify-center gap-2 whitespace-nowrap">
                    <CalendarIcon className="w-5 h-5"/> Schedule New
                </button>
            </header>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral">Upcoming</h2>
                {upcoming.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcoming.map(app => (
                            <div key={app.id} className="bg-base-200 p-4 rounded-lg shadow">
                                <p className="font-bold text-lg">{app.reason}</p>
                                <p className="text-sm text-neutral/70">With {app.doctor} ({app.specialty})</p>
                                <p className="font-semibold text-primary mt-2">{new Date(app.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {app.time}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-neutral/60">No upcoming appointments.</p>}
            </div>

             <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral">Completed</h2>
                {completed.length > 0 ? (
                    <div className="space-y-2">
                        {completed.map(app => (
                             <div key={app.id} className="bg-base-200/50 p-3 rounded-lg opacity-70">
                                <p className="font-semibold">{app.reason} with {app.doctor}</p>
                                <p className="text-xs text-neutral/60">{new Date(app.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-neutral/60">No completed appointments yet.</p>}
            </div>

            {isModalOpen && <ScheduleModal onClose={() => setIsModalOpen(false)} addAppointment={addAppointment} />}
        </div>
    );
};

export default Appointments;
