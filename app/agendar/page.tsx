'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Mock timeslots for now (Real implementation would fetch availability)
const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

export default function BookingPage() {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        objective: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        setSelectedTime('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        // Simulate API call to save appointment
        // In real implementation: await supabase.from('appointments').insert(...)
        try {
            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success
            setFeedback({ type: 'success', message: 'Agendamento confirmado! Enviamos um email com os detalhes.' });
            setStep(3);
        } catch (error) {
            setFeedback({ type: 'error', message: 'Erro ao agendar. Tente novamente ou chame no WhatsApp.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-dark-950">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        Agende uma Consultoria
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Vamos conversar sobre seu projeto e como posso ajudar a escalar seu negócio.
                    </p>
                </div>

                <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-dark-800 flex flex-col md:flex-row min-h-[500px]">

                    {/* Sidebar Summary */}
                    <div className="md:w-1/3 bg-slate-900 dark:bg-primary-950 p-8 text-white">
                        <h3 className="font-bold text-lg mb-6 uppercase tracking-wider text-slate-400">Resumo</h3>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary-500" />
                                <div>
                                    <p className="text-sm text-slate-400">Duração</p>
                                    <p className="font-semibold">30 Minutos</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-5 h-5 text-primary-500" />
                                <div>
                                    <p className="text-sm text-slate-400">Data & Hora</p>
                                    <p className="font-semibold">
                                        {selectedDate ? new Date(selectedDate).toLocaleDateString('pt-BR') : 'Selecione...'}
                                        {selectedTime && ` às ${selectedTime}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {step === 3 && (
                            <div className="mt-12 bg-green-500/20 p-4 rounded-xl border border-green-500/50">
                                <p className="flex items-center gap-2 text-green-400 font-bold mb-2">
                                    <CheckCircle className="w-5 h-5" /> Confirmado
                                </p>
                                <p className="text-xs text-green-200">
                                    Um convite do Google Calendar foi enviado para seu email.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 p-8 relative">

                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right duration-300">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Escolha um Horário</h3>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Selecione o Dia</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl"
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={handleDateSelect}
                                    />
                                </div>

                                {selectedDate && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">Horários Disponíveis</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {TIME_SLOTS.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedTime === time
                                                            ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                                                            : 'bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 hover:bg-white hover:shadow-md'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-end">
                                    <button
                                        disabled={!selectedDate || !selectedTime}
                                        onClick={() => setStep(2)}
                                        className="bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right duration-300">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Seus Dados</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">Nome Completo</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Email Profissional</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Telefone / WhatsApp</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Objetivo da Consultoria</label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={formData.objective}
                                            onChange={e => setFormData({ ...formData, objective: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-transparent"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                                    >
                                        {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="text-center py-12 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Agendamento Realizado!</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                    Sua reunião foi agendada para <strong>{new Date(selectedDate).toLocaleDateString()} às {selectedTime}</strong>.
                                </p>

                                <div className="flex justify-center gap-4">
                                    <button className="px-6 py-3 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-all">
                                        Adicionar ao Google Calendar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
