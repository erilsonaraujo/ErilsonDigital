'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Play } from 'lucide-react';

interface Report {
  id: number;
  name: string;
  description?: string;
  dimensions: string[];
  metrics: string[];
  filters?: any[];
}

const DIMENSIONS = [
  { value: 'path', label: 'Pagina' },
  { value: 'referrer', label: 'Origem' },
  { value: 'utm_source', label: 'UTM Source' },
  { value: 'utm_medium', label: 'UTM Medium' },
  { value: 'utm_campaign', label: 'UTM Campaign' },
  { value: 'device', label: 'Dispositivo' },
  { value: 'browser', label: 'Browser' },
  { value: 'os', label: 'Sistema' },
  { value: 'country', label: 'Pais' },
  { value: 'region', label: 'Regiao' },
  { value: 'city', label: 'Cidade' },
  { value: 'event_name', label: 'Evento' }
];

const METRICS_BY_DIMENSION: Record<string, { value: string; label: string }[]> = {
  event_name: [
    { value: 'events', label: 'Eventos' },
    { value: 'visitors', label: 'Visitantes' },
    { value: 'sessions', label: 'Sessoes' }
  ],
  default: [
    { value: 'pageviews', label: 'Pageviews' },
    { value: 'visitors', label: 'Visitantes' },
    { value: 'sessions', label: 'Sessoes' }
  ]
};

const ReportsView: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    dimension: 'path',
    metrics: ['pageviews'],
    filterField: '',
    filterOperator: 'contains',
    filterValue: ''
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportData, setReportData] = useState<{ dimensions: string[]; metrics: number[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState('30d');

  const loadReports = async () => {
    const res = await fetch('/api/admin/reports');
    const json = await res.json();
    if (res.ok) setReports(json.reports || []);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const createReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const filters = form.filterField && form.filterValue
      ? [{ field: form.filterField, operator: form.filterOperator, value: form.filterValue }]
      : [];

    await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        dimensions: [form.dimension],
        metrics: form.metrics,
        filters
      })
    });
    setForm({ ...form, name: '', description: '' });
    loadReports();
  };

  const deleteReport = async (id: number) => {
    await fetch(`/api/admin/reports/${id}`, { method: 'DELETE' });
    if (selectedReport?.id === id) {
      setSelectedReport(null);
      setReportData([]);
    }
    loadReports();
  };

  const runReport = async (report: Report) => {
    setLoading(true);
    setSelectedReport(report);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}?range=${range}`);
      const json = await res.json();
      if (res.ok) setReportData(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const metricOptions = METRICS_BY_DIMENSION[form.dimension] || METRICS_BY_DIMENSION.default;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Relatorios customizados</h2>
            <p className="text-xs text-graphite-400">Monte relatorios por dimensao e metricas.</p>
          </div>
        </div>

        <form onSubmit={createReport} className="space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome do relatorio"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descricao (opcional)"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.dimension}
              onChange={(e) => setForm({ ...form, dimension: e.target.value, metrics: [METRICS_BY_DIMENSION[e.target.value]?.[0]?.value || 'pageviews'] })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            >
              {DIMENSIONS.map((dimension) => (
                <option key={dimension.value} value={dimension.value}>{dimension.label}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {metricOptions.map((metric) => (
                <label key={metric.value} className="flex items-center gap-2 text-xs text-graphite-300">
                  <input
                    type="checkbox"
                    checked={form.metrics.includes(metric.value)}
                    onChange={(e) => {
                      const metrics = e.target.checked
                        ? [...form.metrics, metric.value]
                        : form.metrics.filter((item) => item !== metric.value);
                      setForm({ ...form, metrics: metrics.length ? metrics : [metric.value] });
                    }}
                  />
                  {metric.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={form.filterField}
              onChange={(e) => setForm({ ...form, filterField: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            >
              <option value="">Sem filtro</option>
              {DIMENSIONS.filter((dim) => dim.value !== 'event_name').map((dimension) => (
                <option key={dimension.value} value={dimension.value}>{dimension.label}</option>
              ))}
            </select>
            <select
              value={form.filterOperator}
              onChange={(e) => setForm({ ...form, filterOperator: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              disabled={!form.filterField}
            >
              <option value="contains">Contem</option>
              <option value="equals">Igual</option>
            </select>
            <input
              value={form.filterValue}
              onChange={(e) => setForm({ ...form, filterValue: e.target.value })}
              placeholder="Valor do filtro"
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              disabled={!form.filterField}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Criar relatorio
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
              <div>
                <p className="text-sm text-white font-semibold">{report.name}</p>
                <p className="text-xs text-graphite-400">{report.description || 'Sem descricao'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => runReport(report)} className="text-graphite-300 hover:text-white">
                  <Play size={16} />
                </button>
                <button onClick={() => deleteReport(report.id)} className="text-graphite-400 hover:text-ember-300">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {reports.length === 0 && <p className="text-xs text-graphite-500">Nenhum relatorio salvo.</p>}
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Resultado</p>
            <h3 className="text-lg font-semibold text-white">{selectedReport?.name || 'Selecione um relatorio'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="rounded-full border border-graphite-800 bg-ink-900/70 px-3 py-2 text-xs text-white"
            >
              <option value="7d">7d</option>
              <option value="30d">30d</option>
              <option value="90d">90d</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          {loading && <p className="text-sm text-graphite-400">Carregando relatorio...</p>}
          {!loading && selectedReport && reportData.length === 0 && (
            <p className="text-sm text-graphite-500">Sem dados para este periodo.</p>
          )}
          {!loading && reportData.length > 0 && (
            <div className="space-y-3">
              {reportData.slice(0, 12).map((row, index) => (
                <div key={index} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
                  <div className="flex flex-col">
                    {row.dimensions.map((dim, idx) => (
                      <span key={idx} className="text-white font-semibold">{dim}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {row.metrics.map((metric, idx) => (
                      <span key={idx} className="text-graphite-100">{metric}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!selectedReport && (
            <p className="text-sm text-graphite-500">Crie ou selecione um relatorio para visualizar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
