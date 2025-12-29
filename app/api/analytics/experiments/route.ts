import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = (searchParams.get('path') || '').toLowerCase();

    const experimentsRes = await query(
      `SELECT * FROM analytics_experiments
       WHERE status = 'active'
       ORDER BY created_at DESC`
    );
    const variantsRes = await query('SELECT * FROM analytics_experiment_variants');

    const variantsByExperiment = new Map<number, any[]>();
    variantsRes.rows.forEach((variant) => {
      const list = variantsByExperiment.get(variant.experiment_id) || [];
      list.push(variant);
      variantsByExperiment.set(variant.experiment_id, list);
    });

    const experiments = experimentsRes.rows
      .filter((experiment) => {
        if (!experiment.target_path) return true;
        if (!path) return false;
        return path.includes(String(experiment.target_path).toLowerCase());
      })
      .map((experiment) => ({
        ...experiment,
        variants: (variantsByExperiment.get(experiment.id) || []).sort((a, b) => b.weight - a.weight)
      }));

    return NextResponse.json({ experiments });
  } catch (error) {
    console.error('Experiments fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiments' }, { status: 500 });
  }
}
