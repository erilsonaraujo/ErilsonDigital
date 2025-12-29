import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

const uploadRoot = path.join(process.cwd(), 'public', 'uploads', 'ecommerce');

const sanitizeFilename = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');

export async function POST(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const productId = formData.get('productId')?.toString();
  const file = formData.get('file') as File | null;

  if (!productId || !file) {
    return NextResponse.json({ error: 'productId and file required' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = sanitizeFilename(file.name || 'upload');
  const folder = path.join(uploadRoot, productId);
  await fs.mkdir(folder, { recursive: true });

  const baseName = `${Date.now()}-${filename}`;
  const originalPath = path.join(folder, baseName);
  await fs.writeFile(originalPath, buffer);

  const thumbName = baseName.replace(/(\.[^.]+)$/, '-thumb$1');
  const mediumName = baseName.replace(/(\.[^.]+)$/, '-medium$1');

  await sharp(buffer).resize(300, 300, { fit: 'inside' }).toFile(path.join(folder, thumbName));
  await sharp(buffer).resize(1200, 1200, { fit: 'inside' }).toFile(path.join(folder, mediumName));

  const url = `/uploads/ecommerce/${productId}/${baseName}`;
  const result = await query(
    'INSERT INTO product_media (product_id, url, alt, sort) VALUES ($1, $2, $3, $4) RETURNING *',
    [productId, url, file.name || null, 0]
  );

  return NextResponse.json({ media: result.rows[0] });
}
