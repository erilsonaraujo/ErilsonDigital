import React, { useState, useEffect } from 'react';
import { PROJECTS, TRANSLATIONS } from '../constants';
import { Code, ExternalLink, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Projects: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language].projects;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const prevProject = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextProject();
        if (e.key === 'ArrowLeft') prevProject();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const project = PROJECTS[currentIndex];

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-dark-950 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
              {t.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
            
            {/* Nav Button Left */}
            <button 
                onClick={prevProject}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 p-3 rounded-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-white shadow-lg hover:scale-110 transition-all focus:outline-none"
                aria-label="Anterior"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Nav Button Right */}
            <button 
                onClick={nextProject}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 p-3 rounded-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-white shadow-lg hover:scale-110 transition-all focus:outline-none"
                 aria-label="Próximo"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Project Card */}
            <div className={`transition-opacity duration-500 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <div className="bg-slate-50 dark:bg-dark-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-dark-800 flex flex-col lg:flex-row min-h-[600px]">
                    
                    {/* Image Section */}
                    <div className="lg:w-3/5 relative group h-64 lg:h-auto">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 lg:hidden"></div>
                         <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                         <div className="absolute bottom-4 left-4 z-20 lg:hidden">
                            <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">{project.category}</span>
                            <h3 className="text-xl font-bold text-white">{project.title}</h3>
                         </div>
                    </div>

                    {/* Info Section */}
                    <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-between">
                        <div>
                            <span className="hidden lg:inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
                                {project.category}
                            </span>
                            <h3 className="hidden lg:block text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                {project.title}
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t.problem}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-red-400 pl-4">
                                        {project.problem}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t.solution}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-green-500 pl-4">
                                        {project.solution}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                             <div className="flex flex-wrap gap-2 mb-8">
                                {project.technologies.map(tech => (
                                    <span key={tech} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-400">
                                        {tech}
                                    </span>
                                ))}
                             </div>

                             <div className="flex flex-col sm:flex-row gap-4">
                                {project.liveLink && (
                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex justify-center items-center px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all font-bold text-sm shadow-xl">
                                        {t.viewProject} <Globe className="w-4 h-4 ml-2" />
                                    </a>
                                )}
                                {project.repoLink && (
                                    <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex justify-center items-center px-6 py-3.5 rounded-xl border-2 border-slate-200 dark:border-dark-700 text-slate-700 dark:text-white hover:border-primary-500 dark:hover:border-primary-500 transition-colors font-bold text-sm">
                                        {t.viewCode} <Code className="w-4 h-4 ml-2" />
                                    </a>
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-3 mt-10">
                {PROJECTS.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 h-2 bg-primary-600' : 'w-2 h-2 bg-slate-300 dark:bg-dark-700 hover:bg-primary-400'}`}
                        aria-label={`Ir para projeto ${idx + 1}`}
                    />
                ))}
            </div>

            <div className="text-center mt-4 text-xs text-slate-400">
                Projeto {currentIndex + 1} de {PROJECTS.length}
            </div>

        </div>
      </div>
    </section>
  );
};

export default Projects;