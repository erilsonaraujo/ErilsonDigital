import { query } from '@/lib/db';

const CONTACT_FORM_SCHEMA = {
  version: 1,
  fields: [
    { id: 'name', type: 'text', label: 'Nome', required: true },
    { id: 'email', type: 'email', label: 'Email', required: true },
    { id: 'phone', type: 'phone', label: 'Telefone' },
    { id: 'company', type: 'text', label: 'Empresa' },
    { id: 'projectType', type: 'select', label: 'Tipo de projeto' },
    { id: 'budget', type: 'select', label: 'Budget' },
    { id: 'timeline', type: 'select', label: 'Timeline' },
    { id: 'message', type: 'textarea', label: 'Mensagem', required: true }
  ]
};

export const ensureDefaultContactForm = async () => {
  const existing = await query('SELECT id FROM forms_v2 WHERE slug = $1', ['contato']);
  if (existing.rows[0]?.id) return existing.rows[0].id as number;

  const created = await query(
    `INSERT INTO forms_v2 (name, slug, schema)
     VALUES ($1, $2, $3)
     RETURNING id`,
    ['Contato', 'contato', JSON.stringify(CONTACT_FORM_SCHEMA)]
  );
  return created.rows[0].id as number;
};

export const createFormEntry = async (formId: number, data: Record<string, any>, meta: { ip?: string; userAgent?: string }) => {
  const result = await query(
    `INSERT INTO form_entries_v2 (form_id, data, ip, user_agent)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [formId, JSON.stringify(data), meta.ip || null, meta.userAgent || null]
  );
  return result.rows[0].id as number;
};
