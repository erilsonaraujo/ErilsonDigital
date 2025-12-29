'use client';

import React, { useEffect, useState } from 'react';
import { FileText, RefreshCcw } from 'lucide-react';

interface FormSummary {
  form: string;
  submits: number;
  focuses: number;
  blurs: number;
}

interface FieldSummary {
  field: string;
  inputs: number;
  avg_time: number;
}

const FormsView: React.FC = () => {
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [fields, setFields] = useState<FieldSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/forms');
    const json = await res.json();
    if (res.ok) {
      setForms(json.forms || []);
      setFields(json.fields || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-tide-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Form Analytics</h2>
              <p className="text-xs text-graphite-400">Conversao e engajamento por formulario.</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        {loading && <p className="text-sm text-graphite-400">Carregando dados...</p>}
        {!loading && forms.length === 0 && <p className="text-sm text-graphite-500">Sem eventos de formulario.</p>}
        <div className="space-y-3">
          {forms.map((form) => (
            <div key={form.form} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
              <p className="text-white font-semibold">{form.form}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-graphite-400">
                <span>Submits: {form.submits}</span>
                <span>Focus: {form.focuses}</span>
                <span>Blur: {form.blurs}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Campos com friccao</h2>
            <p className="text-xs text-graphite-400">Tempo medio e volume de inputs.</p>
          </div>
        </div>

        {fields.length === 0 && !loading && <p className="text-sm text-graphite-500">Sem dados de campo.</p>}
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.field} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
              <p className="text-white font-semibold">{field.field}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-graphite-400">
                <span>Inputs: {field.inputs}</span>
                <span>Tempo medio: {Math.round(field.avg_time || 0)}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormsView;
