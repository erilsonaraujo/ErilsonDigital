import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_INSTRUCTION } from '@/constants';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error("OpenAI API Key is missing in environment variables.");
            return NextResponse.json(
                { error: "Sofia está em manutenção técnica (API Key missing no servidor)." },
                { status: 500 }
            );
        }

        const openai = new OpenAI({ apiKey });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const aiMessage = response.choices[0]?.message?.content || "Recebi sua mensagem, mas meu cérebro falhou em gerar uma resposta.";

        return NextResponse.json({ text: aiMessage });
    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json(
            { error: "Erro ao processar sua mensagem. Tente novamente." },
            { status: 500 }
        );
    }
}
