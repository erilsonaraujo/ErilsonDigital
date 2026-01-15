import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

const updates = [
  {
    slug: 'consultoria-produto-ia',
    description:
      'Diagnostico executivo, arquitetura de alto nivel e automacoes com IA para reduzir risco e acelerar resultados. Entrega consultiva com governanca e foco em ROI.',
    priceCents: 2500000,
  },
  {
    slug: 'backends-enterprise',
    description:
      'Plataforma backend resiliente, APIs seguras e observabilidade completa para operacoes criticas. Escalabilidade e confiabilidade de nivel global.',
    priceCents: 3200000,
  },
  {
    slug: 'produto-digital-premium',
    description:
      'UX premium, narrativa de alto valor e implementacao integrada para produtos digitais e SaaS high-ticket. Conversao sem parecer agressivo.',
    priceCents: 2800000,
  },
  {
    slug: 'analytics-observabilidade',
    description:
      'Dashboards executivos, funis e atribuicao para decisao rapida. Dados confiaveis, acionaveis e prontos para receita.',
    priceCents: 1800000,
  },
  {
    slug: 'seguranca-lgpd',
    description:
      'Hardening, compliance e governanca de acesso para reduzir risco e garantir privacidade. Controles modernos para operacoes criticas.',
    priceCents: 1600000,
  },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const item of updates) {
      await client.query(
        'UPDATE products SET description = $1, seo_title = $2, seo_desc = $1 WHERE slug = $3',
        [item.description, item.slug.replace(/-/g, ' '), item.slug]
      );
      await client.query(
        'UPDATE product_variants SET price_cents = $1 WHERE product_id = (SELECT id FROM products WHERE slug = $2)',
        [item.priceCents, item.slug]
      );
    }
    await client.query('COMMIT');
    console.log('Products updated');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Pricing update error:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
