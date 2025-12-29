import { NextRequest } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';
import { jsPDF } from 'jspdf';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isEcommerceAdminEnabled()) {
    return new Response('Ecommerce admin disabled', { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const orderRes = await query('SELECT * FROM orders WHERE id = $1', [params.id]);
  if (orderRes.rows.length === 0) return new Response('Not found', { status: 404 });
  const order = orderRes.rows[0];

  const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [params.id]);

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Invoice - Order #${order.order_number}`, 20, 20);
  doc.setFontSize(11);
  doc.text(`Email: ${order.email || ''}`, 20, 30);
  doc.text(`Total: R$ ${(order.total_cents / 100).toFixed(2)}`, 20, 38);

  let y = 50;
  doc.text('Items:', 20, y);
  y += 8;
  itemsRes.rows.forEach((item: any) => {
    doc.text(`${item.title_snapshot} x${item.qty} - R$ ${(item.total_cents / 100).toFixed(2)}`, 20, y);
    y += 7;
  });

  const pdf = doc.output('arraybuffer');
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${order.order_number}.pdf"`,
    },
  });
}
