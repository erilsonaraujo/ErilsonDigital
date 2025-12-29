import { withTransaction, query } from '@/src/ecommerce/db/queries';
import type { PoolClient } from 'pg';

export async function ensureDefaultLocation(client?: PoolClient) {
  const executor = client ? client : { query };
  const result = await executor.query("SELECT * FROM inventory_locations ORDER BY name ASC LIMIT 1");
  if (result.rows.length > 0) return result.rows[0];
  const created = await executor.query(
    "INSERT INTO inventory_locations (name, address) VALUES ($1, $2) RETURNING *",
    ['Default', JSON.stringify({})]
  );
  return created.rows[0];
}

export async function getInventoryLevel(variantId: string, client?: PoolClient) {
  const executor = client ? client : { query };
  const location = await ensureDefaultLocation(client);
  const result = await executor.query(
    'SELECT * FROM inventory_levels WHERE variant_id = $1 AND location_id = $2',
    [variantId, location.id]
  );
  if (result.rows.length > 0) return { level: result.rows[0], location };

  const created = await executor.query(
    'INSERT INTO inventory_levels (variant_id, location_id, available, reserved) VALUES ($1, $2, 0, 0) RETURNING *',
    [variantId, location.id]
  );
  return { level: created.rows[0], location };
}

export async function adjustInventory(variantId: string, delta: number, reason: string, refType?: string, refId?: string) {
  return withTransaction(async (client) => {
    const { level, location } = await getInventoryLevel(variantId, client);
    const nextAvailable = Math.max(0, Number(level.available) + delta);
    await client.query(
      'UPDATE inventory_levels SET available = $1 WHERE variant_id = $2 AND location_id = $3',
      [nextAvailable, variantId, location.id]
    );
    await client.query(
      `INSERT INTO inventory_movements (variant_id, location_id, delta, reason, ref_type, ref_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [variantId, location.id, delta, reason, refType || null, refId || null]
    );
    return { available: nextAvailable };
  });
}

export async function reserveInventory(params: {
  variantId: string;
  qty: number;
  refType: string;
  refId: string;
  expiresAt: Date;
}) {
  const { variantId, qty, refType, refId, expiresAt } = params;
  return withTransaction(async (client) => {
    const { level, location } = await getInventoryLevel(variantId, client);
    const available = Number(level.available);
    if (available - qty < 0) {
      throw new Error('Insufficient inventory');
    }
    await client.query(
      'UPDATE inventory_levels SET available = available - $1, reserved = reserved + $1 WHERE variant_id = $2 AND location_id = $3',
      [qty, variantId, location.id]
    );
    await client.query(
      `INSERT INTO inventory_reservations (variant_id, location_id, qty, ref_type, ref_id, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [variantId, location.id, qty, refType, refId, expiresAt]
    );
    await client.query(
      `INSERT INTO inventory_movements (variant_id, location_id, delta, reason, ref_type, ref_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [variantId, location.id, -qty, 'reserve', refType, refId]
    );
  });
}

export async function consumeReservation(refType: string, refId: string) {
  return withTransaction(async (client) => {
    const reservations = await client.query(
      'SELECT * FROM inventory_reservations WHERE ref_type = $1 AND ref_id = $2',
      [refType, refId]
    );

    for (const reservation of reservations.rows) {
      await client.query(
        'UPDATE inventory_levels SET reserved = reserved - $1 WHERE variant_id = $2 AND location_id = $3',
        [reservation.qty, reservation.variant_id, reservation.location_id]
      );
      await client.query(
        `INSERT INTO inventory_movements (variant_id, location_id, delta, reason, ref_type, ref_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [reservation.variant_id, reservation.location_id, -reservation.qty, 'consume_reservation', refType, refId]
      );
    }

    await client.query('DELETE FROM inventory_reservations WHERE ref_type = $1 AND ref_id = $2', [refType, refId]);
  });
}

export async function releaseReservation(refType: string, refId: string) {
  return withTransaction(async (client) => {
    const reservations = await client.query(
      'SELECT * FROM inventory_reservations WHERE ref_type = $1 AND ref_id = $2',
      [refType, refId]
    );

    for (const reservation of reservations.rows) {
      await client.query(
        'UPDATE inventory_levels SET available = available + $1, reserved = reserved - $1 WHERE variant_id = $2 AND location_id = $3',
        [reservation.qty, reservation.variant_id, reservation.location_id]
      );
      await client.query(
        `INSERT INTO inventory_movements (variant_id, location_id, delta, reason, ref_type, ref_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [reservation.variant_id, reservation.location_id, reservation.qty, 'release_reservation', refType, refId]
      );
    }

    await client.query('DELETE FROM inventory_reservations WHERE ref_type = $1 AND ref_id = $2', [refType, refId]);
  });
}

export async function releaseExpiredReservations() {
  return withTransaction(async (client) => {
    const expired = await client.query(
      'SELECT * FROM inventory_reservations WHERE expires_at < NOW()'
    );

    for (const reservation of expired.rows) {
      await client.query(
        'UPDATE inventory_levels SET available = available + $1, reserved = reserved - $1 WHERE variant_id = $2 AND location_id = $3',
        [reservation.qty, reservation.variant_id, reservation.location_id]
      );
      await client.query(
        `INSERT INTO inventory_movements (variant_id, location_id, delta, reason, ref_type, ref_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [reservation.variant_id, reservation.location_id, reservation.qty, 'release_expired', reservation.ref_type, reservation.ref_id]
      );
    }

    if (expired.rows.length > 0) {
      await client.query('DELETE FROM inventory_reservations WHERE expires_at < NOW()');
    }

    return expired.rows.length;
  });
}
