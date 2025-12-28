import OpenAI from "openai";
import { SYSTEM_INSTRUCTION } from '../constants';

// --- CONFIGURAÇÃO OPENAI (BRAIN 2.0) ---
const getApiKey = () => {
    return process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || null;
};

export const sendMessageToOpenAI = async (messages: { role: 'user' | 'assistant' | 'system', content: string }[]): Promise<string> => {
    const apiKey = getApiKey();

    if (!apiKey) {
        console.error("OpenAI Service: API Key não encontrada.");
        return "⚠️ Sofia está em manutenção técnica (API Key missing). Por favor, aguarde ou chame no WhatsApp.";
    }

    try {
        const openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true // Enabling for direct client-side call as per existing structure
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Most effective and cheapest
            messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return response.choices[0]?.message?.content || "Recebi sua mensagem, mas meu cérebro falhou em gerar uma resposta. Pode repetir?";
    } catch (error: any) {
        console.error("OpenAI Service Error:", error);

        if (error.status === 401) return "❌ Chave de API inválida ou expirada.";
        if (error.status === 429) return "⏳ Limite de requisições atingido. Tente novamente em alguns segundos.";

        return "Tive um pequeno lapso de memória agora... Pode repetir sua pergunta, por favor?";
    }
};
