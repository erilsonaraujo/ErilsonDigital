import { query } from '@/lib/db';

export const ensureDefaultResource = async () => {
  const existing = await query('SELECT id FROM booking_resources_v2 WHERE slug = $1', ['diagnostico']);
  if (existing.rows[0]?.id) return existing.rows[0].id as number;

  const created = await query(
    `INSERT INTO booking_resources_v2 (name, slug, timezone)
     VALUES ($1, $2, $3)
     RETURNING id`,
    ['Diagnostico', 'diagnostico', 'America/Sao_Paulo']
  );
  return created.rows[0].id as number;
};

export const createBooking = async (payload: {
  resourceId: number;
  formEntryId?: number | null;
  startAt: Date;
  endAt: Date;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
}) => {
  const result = await query(
    `INSERT INTO bookings_v2
      (resource_id, form_entry_id, start_at, end_at, customer_name, customer_email, customer_phone, notes)
     SELECT $1, $2, $3, $4, $5, $6, $7, $8
     WHERE NOT EXISTS (
       SELECT 1 FROM bookings_v2
       WHERE resource_id = $1
         AND status NOT IN ('canceled', 'declined')
         AND tsrange(start_at, end_at, '[)') && tsrange($3, $4, '[)')
     )
     RETURNING id`,
    [
      payload.resourceId,
      payload.formEntryId || null,
      payload.startAt,
      payload.endAt,
      payload.customerName || null,
      payload.customerEmail || null,
      payload.customerPhone || null,
      payload.notes || null
    ]
  );
  if (!result.rows[0]) {
    throw new Error('Conflict');
  }
  return result.rows[0].id as number;
};
