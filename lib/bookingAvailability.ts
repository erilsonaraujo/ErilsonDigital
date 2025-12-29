import { query } from '@/lib/db';

export const getSeasonForDate = async (date: Date) => {
  const result = await query(
    `SELECT * FROM booking_seasons_v2
     WHERE status = 'active'
       AND start_date <= $1 AND end_date >= $1
     ORDER BY start_date ASC
     LIMIT 1`,
    [date.toISOString().slice(0, 10)]
  );
  return result.rows[0] || null;
};

export const getPricingForResource = async (resourceId: number, seasonId?: number | null) => {
  if (seasonId) {
    const result = await query(
      `SELECT * FROM booking_pricing_v2
       WHERE resource_id = $1 AND season_id = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [resourceId, seasonId]
    );
    if (result.rows[0]) return result.rows[0];
  }

  const fallback = await query(
    `SELECT * FROM booking_pricing_v2
     WHERE resource_id = $1 AND season_id IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [resourceId]
  );
  return fallback.rows[0] || null;
};

export const calculateBookingTotal = async (resourceId: number, startAt: Date, endAt: Date) => {
  const dayMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.max(1, Math.ceil((endAt.getTime() - startAt.getTime()) / dayMs));
  const season = await getSeasonForDate(startAt);
  const pricing = await getPricingForResource(resourceId, season?.id || null);
  const pricePerDay = Number(pricing?.price_per_day || 0);
  const total = totalDays * pricePerDay;
  return { total, season, pricing, totalDays };
};

export const isAvailable = async (resourceId: number, startAt: Date, endAt: Date) => {
  const conflict = await query(
    `SELECT 1 FROM bookings_v2
     WHERE resource_id = $1
       AND status NOT IN ('canceled', 'declined')
       AND tsrange(start_at, end_at, '[)') && tsrange($2, $3, '[)')
     LIMIT 1`,
    [resourceId, startAt, endAt]
  );
  return conflict.rows.length === 0;
};
