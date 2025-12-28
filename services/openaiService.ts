// --- CONFIGURAÇÃO OPENAI (CLIENT PROXY) ---

export const sendMessageToOpenAI = async (messages: { role: 'user' | 'assistant' | 'system', content: string }[]): Promise<string> => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro na comunicação com a Sofia');
        }

        const data = await response.json();
        return data.text;
    } catch (error: any) {
        console.error("OpenAI Service Error:", error);
        return `❌ Erro: ${error.message || "Tive um pequeno lapso de memória... Pode repetir sua pergunta?"}`;
    }
};
