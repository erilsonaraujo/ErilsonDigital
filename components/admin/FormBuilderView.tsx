'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2, FileText, RefreshCcw } from 'lucide-react';
import { formatDateTime } from '@/lib/date';

type FormSchemaField = {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
};

type FormSchema = {
  version?: number;
  fields: FormSchemaField[];
};

type FormRow = {
  id: number;
  name: string;
  slug: string;
  status: string;
  version: number;
  schema: FormSchema;
};

const emptySchema: FormSchema = {
  version: 1,
  fields: []
};

const FormBuilderView: React.FC = () => {
  const [forms, setForms] = useState<FormRow[]>([]);
  const [activeForm, setActiveForm] = useState<FormRow | null>(null);
  const [schemaText, setSchemaText] = useState(JSON.stringify(emptySchema, null, 2));
  const [formMeta, setFormMeta] = useState({ name: '', slug: '', status: 'active' });
  const [entries, setEntries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parseSchema = (): FormSchema | null => {
    try {
      return JSON.parse(schemaText || JSON.stringify(emptySchema)) as FormSchema;
    } catch {
      return null;
    }
  };

  const loadForms = async () => {
    const res = await fetch('/api/admin/forms-v2');
    const json = await res.json();
    if (res.ok) setForms(json.forms || []);
  };

  const loadEntries = async (formId: number) => {
    const res = await fetch(`/api/admin/form-entries-v2?formId=${formId}`);
    const json = await res.json();
    if (res.ok) setEntries(json.entries || []);
  };

  useEffect(() => {
    loadForms();
  }, []);

  const selectForm = (form: FormRow) => {
    setActiveForm(form);
    setFormMeta({ name: form.name, slug: form.slug, status: form.status });
    setSchemaText(JSON.stringify(form.schema || emptySchema, null, 2));
    loadEntries(form.id);
  };

  const createForm = async () => {
    const parsedSchema = parseSchema();
    if (!parsedSchema) {
      setError('JSON invalido no schema.');
      return;
    }
    setError(null);
    const payload = {
      name: formMeta.name || 'Novo formulario',
      slug: formMeta.slug || `form-${Date.now()}`,
      status: formMeta.status,
      schema: parsedSchema
    };
    const res = await fetch('/api/admin/forms-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      loadForms();
      selectForm(json.form);
    }
  };

  const updateForm = async () => {
    if (!activeForm) return;
    const parsedSchema = parseSchema();
    if (!parsedSchema) {
      setError('JSON invalido no schema.');
      return;
    }
    setError(null);
    const payload = {
      id: activeForm.id,
      name: formMeta.name,
      slug: formMeta.slug,
      status: formMeta.status,
      schema: parsedSchema
    };
    const res = await fetch('/api/admin/forms-v2', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      setActiveForm(json.form);
      loadForms();
    }
  };

  const deleteForm = async (id: number) => {
    await fetch(`/api/admin/forms-v2/${id}`, { method: 'DELETE' });
    setActiveForm(null);
    setEntries([]);
    loadForms();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-tide-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Forms 2.0</h2>
              <p className="text-xs text-graphite-400">Builder em JSON + preview.</p>
            </div>
          </div>
          <button
            onClick={loadForms}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {forms.map((form) => (
            <button
              key={form.id}
              onClick={() => selectForm(form)}
              className="w-full text-left rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300 hover:border-graphite-500"
            >
              <p className="text-white font-semibold">{form.name}</p>
              <p className="text-xs text-graphite-500">{form.slug} • v{form.version}</p>
            </button>
          ))}
          {forms.length === 0 && <p className="text-xs text-graphite-500">Nenhum formulario criado.</p>}
        </div>

        <div className="border-t border-graphite-800 pt-4 space-y-4">
          {error && <p className="text-xs text-ember-300">{error}</p>}
          <input
            value={formMeta.name}
            onChange={(e) => setFormMeta({ ...formMeta, name: e.target.value })}
            placeholder="Nome do formulario"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <input
            value={formMeta.slug}
            onChange={(e) => setFormMeta({ ...formMeta, slug: e.target.value })}
            placeholder="Slug"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <select
            value={formMeta.status}
            onChange={(e) => setFormMeta({ ...formMeta, status: e.target.value })}
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          >
            <option value="active">Ativo</option>
            <option value="paused">Pausado</option>
          </select>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={activeForm ? updateForm : createForm}
              className="inline-flex items-center gap-2 rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white"
            >
              <Save size={16} /> {activeForm ? 'Salvar' : 'Criar'}
            </button>
            {activeForm && (
              <button
                onClick={() => deleteForm(activeForm.id)}
                className="inline-flex items-center gap-2 rounded-full border border-ember-500/40 bg-ember-500/10 px-5 py-3 text-sm text-ember-200"
              >
                <Trash2 size={16} /> Excluir
              </button>
            )}
            {!activeForm && (
              <button
                onClick={createForm}
                className="inline-flex items-center gap-2 rounded-full border border-graphite-700 px-5 py-3 text-sm text-graphite-200"
              >
                <Plus size={16} /> Novo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Schema JSON</p>
          <textarea
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
            rows={14}
            className="mt-4 w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-xs text-graphite-100 font-mono"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Preview</p>
          <div className="mt-4 space-y-3">
            {(parseSchema()?.fields || []).map((field: FormSchemaField) => (
              <div key={field.id}>
                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{field.label}</label>
                <input
                  type="text"
                  disabled
                  className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-graphite-400"
                />
              </div>
            ))}
            {(() => {
              const parsed = parseSchema();
              return !parsed || !parsed.fields || parsed.fields.length === 0;
            })() && (
              <p className="text-xs text-graphite-500">Sem campos no schema.</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Entries recentes</p>
          <div className="mt-4 space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-xs text-graphite-300">
                <p className="text-white font-semibold">#{entry.id}</p>
                <p className="text-graphite-500">{formatDateTime(entry.created_at)}</p>
              </div>
            ))}
            {entries.length === 0 && <p className="text-xs text-graphite-500">Sem entries.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderView;
