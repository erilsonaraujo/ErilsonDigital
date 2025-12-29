import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const experimentsRes = await query('SELECT * FROM analytics_experiments ORDER BY created_at DESC');
    const variantsRes = await query('SELECT * FROM analytics_experiment_variants ORDER BY id ASC');
    const assignmentsRes = await query(
      `SELECT experiment_id, variant_id, COUNT(*) AS total
       FROM analytics_experiment_assignments
       GROUP BY experiment_id, variant_id`
    );
    const conversionsRes = await query(
      `SELECT experiment_id, variant_id, COUNT(*) AS total
       FROM analytics_experiment_conversions
       GROUP BY experiment_id, variant_id`
    );

    const variantsByExperiment = new Map<number, any[]>();
    variantsRes.rows.forEach((variant) => {
      const list = variantsByExperiment.get(variant.experiment_id) || [];
      list.push(variant);
      variantsByExperiment.set(variant.experiment_id, list);
    });

    const assignmentsMap = new Map<string, number>();
    assignmentsRes.rows.forEach((row) => {
      assignmentsMap.set(`${row.experiment_id}:${row.variant_id}`, Number(row.total));
    });

    const conversionsMap = new Map<string, number>();
    conversionsRes.rows.forEach((row) => {
      conversionsMap.set(`${row.experiment_id}:${row.variant_id}`, Number(row.total));
    });

    const experiments = experimentsRes.rows.map((experiment) => {
      const variants = (variantsByExperiment.get(experiment.id) || []).map((variant) => ({
        ...variant,
        assignments: assignmentsMap.get(`${experiment.id}:${variant.id}`) || 0,
        conversions: conversionsMap.get(`${experiment.id}:${variant.id}`) || 0
      }));
      return { ...experiment, variants };
    });

    return NextResponse.json({ experiments });
  } catch (error) {
    console.error('Experiments list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, status, targetPath, trafficPercent, variants } = body || {};
    if (!name || !Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const experimentRes = await query(
      `INSERT INTO analytics_experiments (name, status, target_path, traffic_percent)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, status || 'active', targetPath || null, trafficPercent || 100]
    );
    const experiment = experimentRes.rows[0];

    for (const variant of variants) {
      await query(
        `INSERT INTO analytics_experiment_variants (experiment_id, name, weight)
         VALUES ($1, $2, $3)`,
        [experiment.id, variant.name, variant.weight || 50]
      );
    }

    return NextResponse.json({ experiment });
  } catch (error) {
    console.error('Experiment create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
