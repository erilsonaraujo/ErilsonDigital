'use client';

import React from 'react';
import { SKILLS, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

const About: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language].about;

  return (
    <section id="about" className="py-24 bg-slate-100 dark:bg-dark-900 border-y border-slate-200 dark:border-dark-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">

          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              {t.title}
            </h2>
            <div className="prose prose-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>{t.text1}</p>
              <p>{t.text2}</p>
              <p className="font-medium text-primary-600 dark:text-primary-400">{t.text3}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-slate-200 dark:border-dark-700 shadow-sm">
                <span className="block text-4xl font-bold text-slate-900 dark:text-white mb-1">10+</span>
                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.stats_projects}</span>
              </div>
              <div className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-slate-200 dark:border-dark-700 shadow-sm">
                <span className="block text-4xl font-bold text-primary-600 mb-1">100%</span>
                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t.stats_commitment}</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Tech Stack & Skills</h3>
            <div className="space-y-6">
              {SKILLS.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-800 dark:text-white font-medium">{skill.name}</span>
                    <span className="text-slate-500 text-xs font-semibold uppercase">{skill.category}</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white dark:bg-dark-800 rounded-xl border border-slate-200 dark:border-dark-700 shadow-sm">
              <h4 className="text-slate-900 dark:text-white font-bold mb-2">{t.methodology_title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t.methodology_text}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;