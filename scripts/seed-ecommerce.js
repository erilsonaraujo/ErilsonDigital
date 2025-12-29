import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

const products = [
  {
    title: 'Consultoria em Engenharia & IA',
    slug: 'consultoria-engenharia-ia',
    description: 'Arquitetura premium, agentes inteligentes e automacoes com governanca. Ideal para empresas que precisam de tecnologia confiavel e ROI real.',
    sku: 'SERV-ENG-IA-001',
    priceCents: 850000,
    media: '/uploads/ecommerce/seed/consultoria-ia.svg',
  },
  {
    title: 'Backends Enterprise',
    slug: 'backends-enterprise',
    description: 'APIs resilientes, observabilidade e performance para operacoes criticas. Entrega orientada a escala e seguranca.',
    sku: 'SERV-BE-002',
    priceCents: 650000,
    media: '/uploads/ecommerce/seed/backends-enterprise.svg',
  },
  {
    title: 'Produto Digital Premium',
    slug: 'produto-digital-premium',
    description: 'UX de alto impacto, narrativa e conversao para produtos digitais e SaaS high-ticket. Design e engenharia integrados.',
    sku: 'SERV-PROD-003',
    priceCents: 720000,
    media: '/uploads/ecommerce/seed/produto-digital.svg',
  },
  {
    title: 'Analytics & Observabilidade',
    slug: 'analytics-observabilidade',
    description: 'Dashboards executivos, funis e indicadores de performance para decisao rapida. Dados acionaveis e confiaveis.',
    sku: 'SERV-ANL-004',
    priceCents: 420000,
    media: '/uploads/ecommerce/seed/analytics-observabilidade.svg',
  },
  {
    title: 'Seguranca & LGPD',
    slug: 'seguranca-lgpd',
    description: 'Hardening, compliance e governanca de acesso com foco em risco e privacidade. Controles modernos para operacoes criticas.',
    sku: 'SERV-SEC-005',
    priceCents: 380000,
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
