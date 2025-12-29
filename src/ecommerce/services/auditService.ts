import { query } from '@/src/ecommerce/db/queries';

export async function logAudit(params: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  diff?: Record<string, unknown> | null;
  ip?: string | null;
}) {
  const { actorId, action, entityType, entityId, diff, ip } = params;
  await query(
    `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, diff, ip)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [actorId || null, action, entityType, entityId, diff ? JSON.stringify(diff) : null, ip || null]
  );
}
