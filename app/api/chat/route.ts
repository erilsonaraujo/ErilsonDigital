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

        // Use gemini-flash-latest which is verified to work with this API Key (Maps to 1.5 or 2.5 depending on version)
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Convert message format to Gemini format
        // Gemini expects history in { role: 'user' | 'model', parts: [{ text: string }] }[]
        // We prepend the SYSTEM_INSTRUCTION as the first user message if it's a new chat,
        // or ensure it's contextually present.

        let history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        // CRITICAL: Ensure history starts with user, and prepend system instruction for context
        // This is a more robust way than using the systemInstruction parameter which sometimes triggers v1beta 404s
        const systemPrompt = {
            role: 'user',
            parts: [{ text: `INSTRUÇÃO DE SISTEMA: ${SYSTEM_INSTRUCTION}\n\nPor favor, siga estas instruções rigorosamente em todas as respostas.` }]
        };
        const systemAcknowledge = {
            role: 'model',
            parts: [{ text: "Entendido. Sou Sofia, estrategista de vendas do Erilson. Estou pronta para atuar com persuasão, elegância e foco em fechamento de contratos. Como posso ajudar?" }]
        };

        // Combine system prompt + history
        const fullHistory = [systemPrompt, systemAcknowledge, ...history];

        // Clean history to ensure it starts with USER and alternates correctly
        while (fullHistory.length > 0 && fullHistory[0].role !== 'user') {
            fullHistory.shift();
        }

        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: fullHistory,
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

        if (error.status === 429 || error.message?.includes('429')) {
            return NextResponse.json(
                {
                    error: "Limite de Requisições Atingido no Gemini (Free Tier).",
                    details: "O Google atingiu o limite temporário de mensagens gratuitas. Por favor, aguarde alguns segundos e tente novamente."
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                error: `Erro no Gemini: ${error.message || "Erro desconhecido"}`,
                status: error.status || 500
            },
            { status: error.status || 500 }
        );
    }
}
