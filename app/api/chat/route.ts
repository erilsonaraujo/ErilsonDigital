import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_INSTRUCTION } from '@/constants';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            console.error("GOOGLE_GENERATIVE_AI_API_KEY is missing in environment variables.");
            return NextResponse.json(
                {
                    error: "Erro de Configuração: A chave de API do Gemini não foi encontrada no servidor.",
                    details: "Certifique-se de configurar GOOGLE_GENERATIVE_AI_API_KEY no painel da sua hospedagem."
                },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Using gemini-2.0-flash-exp for superior performance and speed
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Convert message format to Gemini format
        // Gemini expects history in { role: 'user' | 'model', parts: [{ text: string }] }[]
        // CRITICAL: The first message in history MUST be from the 'user'.
        let history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        // Remove any initial messages that are not from the 'user'
        while (history.length > 0 && history[0].role !== 'user') {
            history.shift();
        }

        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: history,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const aiMessage = response.text();

        return NextResponse.json({ text: aiMessage });
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            {
                error: `Erro no Gemini: ${error.message || "Erro desconhecido"}`,
                status: error.status || 500
            },
            { status: error.status || 500 }
        );
    }
}
