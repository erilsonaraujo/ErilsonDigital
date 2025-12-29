'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';

interface TagItem {
  id: number;
  name: string;
  status: string;
  trigger_type: string;
  trigger_match?: string;
  match_type?: string;
  tag_type: string;
  tag_config?: any;
}

const TagManagerView: React.FC = () => {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [form, setForm] = useState({
    name: '',
    status: 'active',
    triggerType: 'pageview',
    triggerMatch: '',
    matchType: 'contains',
    tagType: 'event',
    eventName: '',
    metadata: '',
    scriptSrc: '',
    inlineScript: '',
    asyncScript: true
  });

  const loadTags = async () => {
    const res = await fetch('/api/admin/tags');
    const json = await res.json();
    if (res.ok) setTags(json.tags || []);
  };

  useEffect(() => {
    loadTags();
  }, []);

  const createTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagConfig: Record<string, any> = { once: true };
    if (form.tagType === 'event') {
      tagConfig.eventName = form.eventName || form.name;
      if (form.metadata) {
        try {
          tagConfig.metadata = JSON.parse(form.metadata);
        } catch {
          tagConfig.metadata = { note: form.metadata };
        }
      }
    }
    if (form.tagType === 'script') {
      tagConfig.src = form.scriptSrc || null;
      tagConfig.inline = form.inlineScript || null;
      tagConfig.async = form.asyncScript;
    }

    await fetch('/api/admin/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        status: form.status,
        triggerType: form.triggerType,
        triggerMatch: form.triggerMatch || null,
        matchType: form.matchType,
        tagType: form.tagType,
        tagConfig
      })
    });

    setForm({
      name: '',
      status: 'active',
      triggerType: 'pageview',
      triggerMatch: '',
      matchType: 'contains',
      tagType: 'event',
      eventName: '',
      metadata: '',
      scriptSrc: '',
      inlineScript: '',
      asyncScript: true
    });
    loadTags();
  };

  const deleteTag = async (id: number) => {
    await fetch(`/api/admin/tags?id=${id}`, { method: 'DELETE' });
    loadTags();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Tag size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Tag Manager</h2>
            <p className="text-xs text-graphite-400">Dispare tags por pagina, clique, scroll ou tempo.</p>
          </div>
        </div>

        <form onSubmit={createTag} className="space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome da tag"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            >
              <option value="active">Ativa</option>
              <option value="paused">Pausada</option>
            </select>
            <select
              value={form.tagType}
              onChange={(e) => setForm({ ...form, tagType: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            >
              <option value="event">Evento</option>
              <option value="script">Script</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={form.triggerType}
              onChange={(e) => setForm({ ...form, triggerType: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            >
              <option value="pageview">Pageview</option>
              <option value="click">Clique</option>
              <option value="scroll">Scroll</option>
              <option value="timer">Tempo</option>
            </select>
            <input
              value={form.triggerMatch}
              onChange={(e) => setForm({ ...form, triggerMatch: e.target.value })}
              placeholder="Match (URL, label, % ou ms)"
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            />
            <select
              value={form.matchType}
              onChange={(e) => setForm({ ...form, matchType: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              disabled={form.triggerType === 'scroll' || form.triggerType === 'timer'}
            >
              <option value="contains">Contem</option>
              <option value="equals">Igual</option>
              <option value="regex">Regex</option>
            </select>
          </div>
          {form.tagType === 'event' && (
            <div className="space-y-3">
              <input
                value={form.eventName}
                onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                placeholder="Nome do evento (opcional)"
                className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              />
              <textarea
                value={form.metadata}
                onChange={(e) => setForm({ ...form, metadata: e.target.value })}
                placeholder='Metadata JSON (opcional)'
                rows={4}
                className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              />
            </div>
          )}
          {form.tagType === 'script' && (
            <div className="space-y-3">
              <input
                value={form.scriptSrc}
                onChange={(e) => setForm({ ...form, scriptSrc: e.target.value })}
                placeholder="URL do script (opcional)"
                className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              />
              <textarea
                value={form.inlineScript}
                onChange={(e) => setForm({ ...form, inlineScript: e.target.value })}
                placeholder="Script inline (opcional)"
                rows={4}
                className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              />
              <label className="flex items-center gap-2 text-xs text-graphite-300">
                <input
                  type="checkbox"
                  checked={form.asyncScript}
                  onChange={(e) => setForm({ ...form, asyncScript: e.target.checked })}
                />
                Script async
              </label>
            </div>
          )}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Criar tag
          </button>
        </form>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Tag size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Tags ativas</h2>
            <p className="text-xs text-graphite-400">Gerencie e revise seus disparos.</p>
          </div>
        </div>

        <div className="space-y-3">
          {tags.map((tag) => (
            <div key={tag.id} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white font-semibold">{tag.name}</p>
                <button onClick={() => deleteTag(tag.id)} className="text-graphite-400 hover:text-ember-300">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-xs text-graphite-400 mt-2">
                {tag.tag_type} • {tag.trigger_type} • {tag.trigger_match || 'sem match'}
              </p>
            </div>
          ))}
          {tags.length === 0 && <p className="text-xs text-graphite-500">Nenhuma tag cadastrada.</p>}
        </div>
      </div>
    </div>
  );
};

export default TagManagerView;
