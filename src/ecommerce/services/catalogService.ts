import { query } from '@/src/ecommerce/db/queries';

export interface ProductFilters {
  queryText?: string | null;
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  attrs?: Record<string, string> | null;
  status?: string | null;
}

export async function listProducts(filters: ProductFilters) {
  const conditions: string[] = [];
  const params: Array<string | number | boolean> = [];

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`p.status = $${params.length}`);
  }

  if (filters.queryText) {
    params.push(`%${filters.queryText}%`);
    conditions.push(`(p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }

  if (filters.category) {
    params.push(filters.category);
    conditions.push(
      `EXISTS (
        SELECT 1 FROM product_categories pc
        JOIN categories c ON c.id = pc.category_id
        WHERE pc.product_id = p.id AND c.slug = $${params.length}
      )`
    );
  }

  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    params.push(filters.minPrice);
    conditions.push(`v.price_cents >= $${params.length}`);
  }

  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    params.push(filters.maxPrice);
    conditions.push(`v.price_cents <= $${params.length}`);
  }

  if (filters.attrs && Object.keys(filters.attrs).length > 0) {
    params.push(JSON.stringify(filters.attrs));
    conditions.push(`v.attrs @> $${params.length}::jsonb`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT p.*, json_agg(v ORDER BY v.created_at) AS variants
     FROM products p
     JOIN product_variants v ON v.product_id = p.id
     ${where}
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    params
  );

  return result.rows;
}

export async function getProductBySlug(slug: string) {
  const productRes = await query('SELECT * FROM products WHERE slug = $1 LIMIT 1', [slug]);
  if (productRes.rows.length === 0) return null;
  const product = productRes.rows[0];

  const [variantsRes, mediaRes, categoriesRes] = await Promise.all([
    query('SELECT * FROM product_variants WHERE product_id = $1 ORDER BY created_at ASC', [product.id]),
    query('SELECT * FROM product_media WHERE product_id = $1 ORDER BY sort ASC', [product.id]),
    query(
      `SELECT c.* FROM categories c
       JOIN product_categories pc ON pc.category_id = c.id
       WHERE pc.product_id = $1
       ORDER BY c.name ASC`,
      [product.id]
    ),
  ]);

  return {
    ...product,
    variants: variantsRes.rows,
    media: mediaRes.rows,
    categories: categoriesRes.rows,
  };
}

export async function createProduct(payload: {
  title: string;
  slug: string;
  description?: string | null;
  brand?: string | null;
  status?: string;
  seoTitle?: string | null;
  seoDesc?: string | null;
}) {
  const result = await query(
    `INSERT INTO products (status, title, slug, description, brand, seo_title, seo_desc)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      payload.status || 'draft',
      payload.title,
      payload.slug,
      payload.description || null,
      payload.brand || null,
      payload.seoTitle || null,
      payload.seoDesc || null,
    ]
  );
  return result.rows[0];
}

export async function updateProduct(id: string, payload: Partial<{
  status: string;
  title: string;
  slug: string;
  description: string | null;
  brand: string | null;
  seoTitle: string | null;
  seoDesc: string | null;
}>) {
  const fields: string[] = [];
  const params: Array<string | number | null> = [];

  const mapping: Record<string, string> = {
    status: 'status',
    title: 'title',
    slug: 'slug',
    description: 'description',
    brand: 'brand',
    seoTitle: 'seo_title',
    seoDesc: 'seo_desc',
  };

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return;
    const column = mapping[key];
    if (!column) return;
    params.push(value as string | null);
    fields.push(`${column} = $${params.length}`);
  });

  params.push(id);
  const set = fields.length > 0 ? fields.join(', ') + ', updated_at = NOW()' : 'updated_at = NOW()';

  const result = await query(
    `UPDATE products SET ${set} WHERE id = $${params.length} RETURNING *`,
    params
  );
  return result.rows[0];
}

export async function deleteProduct(id: string) {
  await query('DELETE FROM products WHERE id = $1', [id]);
}

export async function upsertCategory(name: string, slug: string, parentId?: string | null) {
  const existing = await query('SELECT * FROM categories WHERE slug = $1 LIMIT 1', [slug]);
  if (existing.rows.length > 0) return existing.rows[0];
  const result = await query(
    'INSERT INTO categories (name, slug, parent_id) VALUES ($1, $2, $3) RETURNING *',
    [name, slug, parentId || null]
  );
  return result.rows[0];
}

export async function setProductCategories(productId: string, categoryIds: string[]) {
  await query('DELETE FROM product_categories WHERE product_id = $1', [productId]);
  for (const categoryId of categoryIds) {
    await query('INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)', [productId, categoryId]);
  }
}

export async function createVariant(payload: {
  productId: string;
  sku: string;
  attrs?: Record<string, string> | null;
  priceCents: number;
  compareAtCents?: number | null;
  currency?: string;
  weightGrams?: number | null;
  dims?: Record<string, string | number> | null;
  status?: string;
  barcode?: string | null;
}) {
  const result = await query(
    `INSERT INTO product_variants
     (product_id, sku, barcode, attrs, price_cents, compare_at_cents, currency, weight_grams, dims, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      payload.productId,
      payload.sku,
      payload.barcode || null,
      JSON.stringify(payload.attrs || {}),
      payload.priceCents,
      payload.compareAtCents || null,
      payload.currency || 'BRL',
      payload.weightGrams || 0,
      JSON.stringify(payload.dims || {}),
      payload.status || 'active',
    ]
  );
  return result.rows[0];
}

export async function updateVariant(id: string, payload: Partial<{
  sku: string;
  barcode: string | null;
  attrs: Record<string, string>;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  weightGrams: number | null;
  dims: Record<string, string | number>;
  status: string;
}>) {
  const fields: string[] = [];
  const params: Array<string | number | null> = [];
  const mapping: Record<string, string> = {
    sku: 'sku',
    barcode: 'barcode',
    attrs: 'attrs',
    priceCents: 'price_cents',
    compareAtCents: 'compare_at_cents',
    currency: 'currency',
    weightGrams: 'weight_grams',
    dims: 'dims',
    status: 'status',
  };

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return;
    const column = mapping[key];
    if (!column) return;
    params.push(typeof value === 'object' ? JSON.stringify(value) : (value as string | number | null));
    fields.push(`${column} = $${params.length}`);
  });

  params.push(id);
  const set = fields.length > 0 ? fields.join(', ') + ', updated_at = NOW()' : 'updated_at = NOW()';

  const result = await query(
    `UPDATE product_variants SET ${set} WHERE id = $${params.length} RETURNING *`,
    params
  );
  return result.rows[0];
}

export async function deleteVariant(id: string) {
  await query('DELETE FROM product_variants WHERE id = $1', [id]);
}
