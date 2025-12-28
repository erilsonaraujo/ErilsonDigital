'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MessageCircle, UserCheck, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { sendMessageToGemini } from '@/services/geminiService';
import { ChatMessage } from '@/types';
import { WHATSAPP_NUMBER, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

const AISection: React.FC = () => {
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language].ai;

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: 'model', text: t.subtitle }]);
        } else if (messages.length === 1 && messages[0].role === 'model') {
            setMessages([{ role: 'model', text: t.subtitle }]);
        }
    }, [language]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const userMessage: ChatMessage = { role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Check for booking intent
        const lowerInput = textToSend.toLowerCase();
        if (lowerInput.includes('agendar') || lowerInput.includes('reunião') || lowerInput.includes('horário') || lowerInput.includes('book') || lowerInput.includes('meeting') || lowerInput.includes('schedule')) {
            setTimeout(() => {
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
                setMessages(prev => [...prev, {
                    role: 'model',
                    text: language === 'pt' ? 'Claro! Vou te levar para a agenda do Erilson. Lá você pode escolher o melhor horário.' :
                        language === 'es' ? '¡Claro! Te llevaré a la agenda de Erilson. Allí puedes elegir el mejor horario.' :
                            'Sure! I\'ll take you to Erilson\'s calendar. You can choose the best time there.',
                    isActionable: true
                }]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const historyForService = messages.map(m => ({
                role: m.role === 'model' ? 'model' : 'user',
                parts: [{ text: m.text }]
            }));

            const responseText = await sendMessageToGemini(historyForService, textToSend);

            const hasWhatsApp = responseText.includes('[OFFER_WHATSAPP]');
            const hasBooking = responseText.includes('[OFFER_CALENDLY]');
            const hasAction = hasWhatsApp || hasBooking;

            // Clean up markers from text
            let cleanText = responseText
                .replace('[OFFER_WHATSAPP]', '')
                .replace('[OFFER_CALENDLY]', '');

            const aiMessage: ChatMessage = {
                role: 'model',
                text: cleanText,
                isActionable: hasAction,
                actionType: hasWhatsApp && hasBooking ? 'both' : hasWhatsApp ? 'whatsapp' : hasBooking ? 'booking' : undefined
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um erro técnico. Tente novamente.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const openWhatsApp = () => {
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.text || 'Info';
        const encodedMsg = encodeURIComponent(`[Via Sofia - Site] Olá Erilson! Estava falando com a Sofia sobre: "${lastUserMsg.substring(0, 100)}..." e gostaria de continuar a conversa.`);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, '_blank');
    };

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
            <div className="max-w-5xl mx-auto">
                <div className="glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[550px]">

                    {/* Sidebar / Context - Persona Sofia */}
                    <div className="md:w-1/3 bg-slate-50 dark:bg-dark-800 p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-dark-700 flex flex-col justify-between relative overflow-hidden">

                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                        <div>
                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-primary-600 p-[2px] shadow-lg">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-dark-800 flex items-center justify-center overflow-hidden">
                                        {/* Avatar sofia representation */}
                                        <UserCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">Sofia</h3>
                                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">Assistente Pessoal</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">Disponível</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 leading-relaxed italic relative z-10">
                                "{t.disclaimer}"
                            </p>

                            <div className="space-y-3 relative z-10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.help_label || 'Posso ajudar com:'}</p>
                                {[t.suggestion1, t.suggestion2, t.suggestion3].map((sug, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(sug)}
                                        className="w-full text-left p-3 rounded-xl bg-white/50 dark:bg-dark-950/50 backdrop-blur-sm border border-slate-200 dark:border-dark-700 text-xs md:text-sm text-slate-700 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm hover:shadow-md active:scale-95"
                                    >
                                        {sug}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 md:mt-0 pt-6 border-t border-slate-200 dark:border-dark-700 relative z-10">
                            <p className="text-[10px] text-slate-400 text-center">Erilson Digital &copy; {new Date().getFullYear()}</p>
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="md:w-2/3 flex flex-col bg-slate-100/30 dark:bg-dark-900/50 backdrop-blur-sm">
                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[550px] scroll-smooth">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-gradient-to-br from-purple-500 to-primary-600'}`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600 dark:text-slate-300" /> : <Sparkles className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                        <div className={`py-3 px-5 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tr-none border border-slate-100 dark:border-slate-700'
                                            : 'bg-white dark:bg-primary-900/20 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-primary-900/30'
                                            }`}>
                                            {msg.role === 'user' ? (
                                                msg.text
                                            ) : (
                                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-bold text-primary-600 dark:text-primary-400" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                                                            li: ({ node, ...props }) => <li className="ml-2" {...props} />
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>

                                            )}
                                        </div>
                                        {/* Action Buttons */}
                                        {msg.isActionable && (
                                            <div className="flex flex-col space-y-2 mt-3">
                                                {/* Agendar Button */}
                                                {(msg.actionType === 'booking' || msg.actionType === 'both') && (
                                                    <a
                                                        href="/agendar"
                                                        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        <Calendar className="w-4 h-4" />
                                                        Agendar Reunião
                                                    </a>
                                                )}
                                                {/* WhatsApp Button - Send conversation summary directly */}
                                                {(msg.actionType === 'whatsapp' || msg.actionType === 'both') && (
                                                    <button
                                                        onClick={() => {
                                                            const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');

                                                            // Create a formatted conversation summary
                                                            const conversationText = messages
                                                                .map((m) => {
                                                                    const prefix = m.role === 'user' ? '👤 Você' : '🤖 Sofia';
                                                                    return `${prefix}:\n${m.text}\n`;
                                                                })
                                                                .join('\n---\n\n');

                                                            const fullMessage = `📋 *Conversa com Sofia - Erilson Digital*\n\n${conversationText}\n\n_Enviado via erilsondigital.com_`;

                                                            // Open WhatsApp with the conversation
                                                            const waMsg = encodeURIComponent(fullMessage);
                                                            window.open(`https://wa.me/${cleanNumber}?text=${waMsg}`, '_blank');
                                                        }}
                                                        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold py-2.5 px-5 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 animate-bounce"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        Falar com Erilson agora
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-dark-800 flex-shrink-0"></div>
                                    <div className="h-10 bg-slate-200 dark:bg-dark-800 rounded-2xl rounded-tl-none w-32"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-dark-700">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 rounded-2xl px-2 py-2 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all shadow-inner"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t.placeholder}
                                    className="flex-1 bg-transparent px-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none h-10"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default AISection;