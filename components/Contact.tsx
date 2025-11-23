import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { WHATSAPP_NUMBER, TRANSLATIONS } from '../constants';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Contact: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language].contact;
  
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Como o site é estático, usamos mailto para garantir a entrega da mensagem
    // simulando uma experiência de formulário real.
    setTimeout(() => {
      const subject = `Contato via Site de ${formState.name}`;
      const body = `Nome: ${formState.name}\nEmail: ${formState.email}\n\nMensagem:\n${formState.message}`;
      
      window.location.href = `mailto:joseerilsonaraujo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-white dark:bg-dark-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Info Side */}
          <div className="lg:w-5/12 bg-slate-900 dark:bg-primary-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 z-0"></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6">{t.title}</h3>
                <p className="text-slate-300 mb-12 leading-relaxed">
                    {t.subtitle}
                </p>

                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <span>+55 (84) 99150-2101</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <span>joseerilsonaraujo@gmail.com</span>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span>Natal, RN - Brasil (Remoto/Híbrido)</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-12">
                <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-900/20"
                >
                    {t.whatsappBtn}
                </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-7/12 p-10 bg-white dark:bg-dark-900">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">{t.nameLabel}</label>
                    <input 
                        type="text" 
                        id="name"
                        required
                        value={formState.name}
                        onChange={e => setFormState({...formState, name: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">{t.emailLabel}</label>
                    <input 
                        type="email" 
                        id="email"
                        required
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                    />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2">{t.msgLabel}</label>
                <textarea 
                    id="message"
                    rows={4}
                    required
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end">
                 <button 
                    type="submit" 
                    disabled={status === 'sending' || status === 'success'}
                    className={`flex items-center px-8 py-3 rounded-lg font-semibold text-white transition-all ${status === 'success' ? 'bg-green-600' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                    {status === 'sending' ? t.btnSending : status === 'success' ? t.btnSent : <>{t.btnSend} <Send className="ml-2 w-4 h-4" /></>}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;