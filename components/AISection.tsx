'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MessageCircle, UserCheck, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessageToOpenAI } from '@/services/openaiService';
import { ChatMessage } from '@/types';
import { WHATSAPP_NUMBER, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

type BookingData = {
    name?: string;
    email?: string;
    phone?: string;
    service?: string;
    date?: string;
    time?: string;
    message?: string;
    company?: string;
    budget?: string;
    timeline?: string;
};

const parseBookingData = (rawText: string): BookingData | null => {
    const match = rawText.match(/\[BOOKING_DATA\]([\s\S]*?)\[\/BOOKING_DATA\]/i);
    if (!match) return null;

    try {
        const parsed = JSON.parse(match[1].trim());
        if (parsed && typeof parsed === 'object') {
            return parsed as BookingData;
        }
    } catch {
        return null;
    }

    return null;
};

const stripInternalTags = (rawText: string) => {
    return rawText
        .replace(/\[OFFER_WHATSAPP\]|\[OFFER_BOOKING\]/gi, '')
        .replace(/\[BOOKING_DATA\][\s\S]*?\[\/BOOKING_DATA\]/gi, '')
        .trim();
};

const AISection: React.FC = () => {
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language];

    const suggestions = t.ai.suggestions;
    const subtitle = t.ai.subtitle;
    const disclaimer = t.ai.disclaimer;
    const helpLabel = t.ai.helpLabel;

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: subtitle }]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Convert history to OpenAI format
            const openAiMessages = updatedMessages.map(m => ({
                role: (m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
                content: m.text
            }));

            const responseText = await sendMessageToOpenAI(openAiMessages);

            // Trigger detection, booking capture, and text cleaning
            const hasOfferWhatsApp = /\[OFFER_WHATSAPP\]/i.test(responseText);
            const hasOfferBooking = /\[OFFER_BOOKING\]/i.test(responseText);
            const bookingData = parseBookingData(responseText);
            const cleanText = stripInternalTags(responseText);

            const aiMessage: ChatMessage = {
                role: 'assistant',
                text: cleanText,
                isActionable: hasOfferWhatsApp || hasOfferBooking,
                actionType: hasOfferWhatsApp && hasOfferBooking ? 'both' : (hasOfferWhatsApp ? 'whatsapp' : 'booking')
            };

            const finalMessages = [...updatedMessages, aiMessage];
            setMessages(finalMessages);

            // Sync with backend
            await syncConversation(finalMessages, bookingData);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', text: t.ai.errorFallback }]);
        } finally {
            setIsLoading(false);
        }
    };

    const syncConversation = async (currentMessages: ChatMessage[], bookingData?: BookingData | null) => {
        try {
            let visitorId = localStorage.getItem('visitor_id') || 'unknown';

            // Simple heuristic to find name/email/phone in messages
            // In a real app, you might want more robust extraction
            const fullText = currentMessages.map(m => m.text).join(' ');
            const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const phoneMatch = fullText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,3}\)?[-.\s]?\d{4,5}[-.\s]?\d{4}/);
            const nameMatch = fullText.match(/(?:me chamo|meu nome e|sou o|sou a)\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,2})/i);

            const visitorName = bookingData?.name || nameMatch?.[1];
            const visitorEmail = bookingData?.email || emailMatch?.[0];
            const visitorPhone = bookingData?.phone || phoneMatch?.[0];
            const bookingSavedKey = `ai_booking_saved_${visitorId}`;
            const bookingAlreadySaved = localStorage.getItem(bookingSavedKey) === '1';
            const shouldSendBooking = Boolean(bookingData) && !bookingAlreadySaved;

            const response = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitorId,
                    visitorName,
                    transcript: currentMessages,
                    visitorEmail,
                    visitorPhone,
                    isBooking: shouldSendBooking,
                    bookingData: shouldSendBooking ? bookingData : null
                })
            });

            if (response.ok && shouldSendBooking) {
                localStorage.setItem(bookingSavedKey, '1');
            }
        } catch (err) {
            console.debug('Sync failed', err);
        }
    };

    const openWhatsApp = () => {
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.text || 'Info';
        const encodedMsg = encodeURIComponent(`[Via Sofia - Site] Olá Erilson! Estava falando com a Sofia sobre: "${lastUserMsg.substring(0, 100)}..." e gostaria de continuar a conversa.`);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, '_blank');
    };

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ink-950 relative">
            <div className="absolute inset-0 noise-bg opacity-60" />
            <div className="relative max-w-6xl mx-auto">
                <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[560px]">

                    {/* Sidebar / Context - Persona Sofia */}
                    <div className="md:w-1/3 bg-ink-950/70 p-8 border-b md:border-b-0 md:border-r border-graphite-800 flex flex-col justify-between relative overflow-hidden">

                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cobalt-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                        <div>
                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cobalt-400 to-tide-400 p-[2px] shadow-lg">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-dark-800 flex items-center justify-center overflow-hidden">
                                        {/* Avatar sofia representation */}
                                        <UserCheck className="w-8 h-8 text-tide-300" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-lg text-graphite-900 leading-tight">{t.ai.name}</h3>
                                    <p className="text-xs text-tide-300 font-medium">{t.ai.role}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-[10px] text-graphite-400 uppercase tracking-wide">{t.ai.status}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-graphite-300 mb-8 leading-relaxed italic relative z-10">
                                "{disclaimer}"
                            </p>

                            <div className="space-y-3 relative z-10">
                                <p className="text-xs font-bold text-graphite-500 uppercase tracking-wider mb-2">{helpLabel}</p>
                                {suggestions.map((sug, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(sug)}
                                        className="w-full text-left p-3 rounded-xl bg-ink-950/70 border border-graphite-800 text-xs md:text-sm text-graphite-200 hover:border-cobalt-400 hover:text-graphite-900 transition-all shadow-sm hover:shadow-md active:scale-95"
                                    >
                                        {sug}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 md:mt-0 pt-6 border-t border-graphite-800 relative z-10">
                            <p className="text-[10px] text-graphite-500 text-center">Erilson Digital &copy; {new Date().getFullYear()}</p>
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="md:w-2/3 flex flex-col bg-ink-950/60 backdrop-blur-sm">
                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[550px] scroll-smooth">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-graphite-800' : 'bg-gradient-to-br from-cobalt-400 to-tide-400'}`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4 text-graphite-200" /> : <Sparkles className="w-4 h-4 text-graphite-900" />}
                                    </div>
                                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                        <div className={`py-3 px-5 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-graphite-900 text-graphite-100 rounded-tr-none border border-graphite-800'
                                            : 'bg-ink-900/80 text-graphite-100 rounded-tl-none border border-graphite-800'
                                            }`}>
                                            {msg.role === 'user' ? (
                                                msg.text
                                            ) : (
                                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-bold text-tide-300" {...props} />,
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
                                                        className="inline-flex items-center gap-2 bg-cobalt-500 hover:bg-cobalt-400 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        <Calendar className="w-4 h-4" />
                                                        {t.ai.bookingCta}
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
                                                                    const prefix = m.role === 'user'
                                                                        ? `👤 ${t.ai.conversationUserLabel}`
                                                                        : `🤖 ${t.ai.conversationAssistantLabel}`;
                                                                    return `${prefix}:\n${m.text}\n`;
                                                                })
                                                                .join('\n---\n\n');

                                                            const fullMessage = `📋 *${t.ai.conversationTitle}*\n\n${conversationText}`;

                                                            // Open WhatsApp with the conversation
                                                            const waMsg = encodeURIComponent(fullMessage);
                                                            window.open(`https://wa.me/${cleanNumber}?text=${waMsg}`, '_blank');
                                                        }}
                                                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-5 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 animate-bounce"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        {t.ai.whatsappCta}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-graphite-800 flex-shrink-0"></div>
                                    <div className="h-10 bg-graphite-800 rounded-2xl rounded-tl-none w-32"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-ink-950/80 border-t border-graphite-800">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 bg-ink-950/70 border border-graphite-800 rounded-2xl px-2 py-2 focus-within:border-cobalt-400 transition-all shadow-inner"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
              placeholder={t.ai.placeholder}
                                    className="flex-1 bg-transparent px-4 text-sm text-graphite-100 placeholder-graphite-500 focus:outline-none h-10"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 bg-cobalt-500 hover:bg-cobalt-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
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
