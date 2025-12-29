import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, bullets } = await request.json();
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI key not configured' }, { status: 400 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Crie uma descricao premium e SEO para o produto: ${title}.\nBullets: ${Array.isArray(bullets) ? bullets.join(', ') : ''}\nRetorne somente o texto da descricao.`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return NextResponse.json({ description: text });
}
