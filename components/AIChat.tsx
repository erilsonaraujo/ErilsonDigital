import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { sendMessageToOpenAI } from '../services/openaiService';
import { ChatMessage } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Olá! Sou a Sofia, assistente executiva do Erilson. Como posso ajudar sua empresa a escalar com IA hoje? ✨' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Convert to OpenAI format
      const openAiMessages = updatedMessages.map(m => ({
        role: (m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.text
      }));

      const responseText = await sendMessageToOpenAI(openAiMessages);

      // Check for tags to trigger UI actions, then strip them globally for display
      const hasOfferWhatsApp = /\[OFFER_WHATSAPP\]/i.test(responseText);
      const hasOfferBooking = /\[OFFER_BOOKING\]/i.test(responseText);

      // Clean text by removing all internal tags
      const cleanText = responseText.replace(/\[OFFER_WHATSAPP\]|\[OFFER_BOOKING\]/gi, '').trim();

      const aiMessage: ChatMessage = {
        role: 'assistant',
        text: cleanText,
        isActionable: hasOfferWhatsApp || hasOfferBooking,
        actionType: hasOfferWhatsApp && hasOfferBooking ? 'both' : hasOfferWhatsApp ? 'whatsapp' : 'booking'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openWhatsApp = () => {
    // Construct a pre-filled message based on the last user interaction if possible
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.text || 'Interesse em serviços';
    const encodedMsg = encodeURIComponent(`Olá Erilson, vim pelo seu site. Estava conversando com a IA sobre: "${lastUserMsg.substring(0, 50)}..." e gostaria de avançar.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, '_blank');
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} bg-gradient-to-r from-primary-600 to-primary-500 text-white`}
        aria-label="Abrir Chat IA"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] bg-dark-900 rounded-2xl shadow-2xl border border-dark-700 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`} style={{ maxHeight: '600px', height: '70vh' }}>

        {/* Header */}
        <div className="p-4 bg-dark-800 rounded-t-2xl border-b border-dark-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cobalt-400 to-tide-400 flex items-center justify-center text-xs font-bold text-white">
              IA
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Assistente Virtual</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                Online agora
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-dark-900/50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-none'
                  : 'bg-dark-800 text-slate-200 border border-dark-700 rounded-bl-none'
                  }`}
              >
                {msg.text}
              </div>
              {/* Action Button if AI detects intent */}
              {msg.isActionable && (
                <button
                  onClick={openWhatsApp}
                  className="mt-2 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-lg animate-bounce"
                >
                  <MessageCircle className="w-4 h-4" />
                  Conversar no WhatsApp
                </button>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs ml-2">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-dark-800 border-t border-dark-700 rounded-b-2xl">
          <div className="flex items-center gap-2 bg-dark-950 border border-dark-700 rounded-full px-4 py-2 focus-within:border-primary-500 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`text-primary-500 hover:text-primary-400 transition-colors ${(!input.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-600 mt-2">
            A IA pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </>
  );
};

export default AIChat;
