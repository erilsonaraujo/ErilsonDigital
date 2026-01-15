import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

const products = [
  {
    title: 'Consultoria em Produto Digital & IA',
    slug: 'consultoria-produto-ia',
    description: 'Diagnostico executivo, arquitetura de alto nivel e automacoes com IA para reduzir risco e acelerar resultados. Entrega consultiva com governanca e foco em ROI.',
    sku: 'SERV-ENG-IA-001',
    priceCents: 2500000,
    media: '/uploads/ecommerce/seed/consultoria-ia.svg',
  },
  {
    title: 'Backends Enterprise',
    slug: 'backends-enterprise',
    description: 'Plataforma backend resiliente, APIs seguras e observabilidade completa para operacoes criticas. Escalabilidade e confiabilidade de nivel global.',
    sku: 'SERV-BE-002',
    priceCents: 3200000,
    media: '/uploads/ecommerce/seed/backends-enterprise.svg',
  },
  {
    title: 'Produto Digital Premium',
    slug: 'produto-digital-premium',
    description: 'UX premium, narrativa de alto valor e implementacao integrada para produtos digitais e SaaS high-ticket. Conversao sem parecer agressivo.',
    sku: 'SERV-PROD-003',
    priceCents: 2800000,
    media: '/uploads/ecommerce/seed/produto-digital.svg',
  },
  {
    title: 'Analytics & Observabilidade',
    slug: 'analytics-observabilidade',
    description: 'Dashboards executivos, funis e atribuicao para decisao rapida. Dados confiaveis, acionaveis e prontos para receita.',
    sku: 'SERV-ANL-004',
    priceCents: 1800000,
    media: '/uploads/ecommerce/seed/analytics-observabilidade.svg',
  },
  {
    title: 'Seguranca & LGPD',
    slug: 'seguranca-lgpd',
    description: 'Hardening, compliance e governanca de acesso para reduzir risco e garantir privacidade. Controles modernos para operacoes criticas.',
    sku: 'SERV-SEC-005',
    priceCents: 1600000,
    media: '/uploads/ecommerce/seed/seguranca-lgpd.svg',
  },
];

async function ensureDefaultLocation(client) {
  const existing = await client.query('SELECT * FROM inventory_locations ORDER BY name ASC LIMIT 1');
  if (existing.rows.length > 0) return existing.rows[0];
  const created = await client.query(
    'INSERT INTO inventory_locations (name, address) VALUES ($1, $2) RETURNING *',
    ['Default', JSON.stringify({})]
  );
  return created.rows[0];
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const location = await ensureDefaultLocation(client);

    for (const product of products) {
      const existing = await client.query('SELECT id FROM products WHERE slug = $1', [product.slug]);
      if (existing.rows.length > 0) {
        continue;
      }

      const productRes = await client.query(
        `INSERT INTO products (status, title, slug, description, brand, seo_title, seo_desc)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          'active',
          product.title,
          product.slug,
          product.description,
          'Erilson Digital',
          product.title,
          product.description,
        ]
      );

      const createdProduct = productRes.rows[0];
      const variantRes = await client.query(
        `INSERT INTO product_variants (product_id, sku, attrs, price_cents, currency, status, weight_grams)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          createdProduct.id,
          product.sku,
          JSON.stringify({ tipo: 'servico' }),
          product.priceCents,
          'BRL',
          'active',
          0,
        ]
      );

      const createdVariant = variantRes.rows[0];

      await client.query(
        'INSERT INTO inventory_items (variant_id, tracked) VALUES ($1, $2) ON CONFLICT (variant_id) DO NOTHING',
        [createdVariant.id, false]
      );

      await client.query(
        `INSERT INTO inventory_levels (variant_id, location_id, available, reserved)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (variant_id, location_id)
         DO UPDATE SET available = EXCLUDED.available`,
        [createdVariant.id, location.id, 999, 0]
      );

      await client.query(
        `INSERT INTO product_media (product_id, url, alt, sort)
         VALUES ($1, $2, $3, $4)`,
        [createdProduct.id, product.media, product.title, 0]
      );
    }

    await client.query('COMMIT');
    console.log('Seed completed');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed error:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
