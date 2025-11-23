import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// --- CONFIGURAÇÃO PARA HOSTGATOR / HOSPEDAGEM COMPARTILHADA ---
// Chave inserida conforme solicitado.
// SEGURANÇA: Certifique-se de que adicionou 'erilsondigital.com' nas "Client restrictions" 
// do Google AI Studio para evitar uso indevido por terceiros.
const MANUAL_API_KEY = "AIzaSyAIIrhmZcGb1_mm-U-CrcLeu0_E3zXlkHs" as string; 

const getApiKey = () => {
  try {
    // 1. Prioridade: Chave inserida manualmente no código
    // Removemos espaços em branco extras por segurança
    const cleanKey = MANUAL_API_KEY.trim();
    
    if (cleanKey && cleanKey.length > 20 && !cleanKey.includes("COLE_SUA")) {
        return cleanKey;
    }

    // 2. Fallback: Variável de ambiente (útil para desenvolvimento local com .env)
    const envKey = process.env.API_KEY;
    if (envKey && envKey.length > 10 && !envKey.includes('YOUR_API_KEY')) {
      return envKey;
    }

    console.warn("Gemini Service: Nenhuma API Key válida encontrada.");
    return null;
  } catch (e) {
    console.error("Gemini Service: Falha ao ler API Key", e);
    return null;
  }
};

export const sendMessageToGemini = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("ERRO CRÍTICO: API Key inválida ou não encontrada.");
    return "⚠️ Erro de Configuração: A chave de API não foi detectada no código. Por favor, verifique o arquivo services/geminiService.ts.";
  }

  try {
    // Instancia o cliente apenas no momento do envio para evitar erros de inicialização
    const ai = new GoogleGenAI({ apiKey });
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({
        message: newMessage
    });

    return result.text || "Recebi sua mensagem, mas a IA não gerou resposta textual.";
  } catch (error: any) {
    console.error("Detalhes do Erro Gemini:", error);
    const errorMsg = error.toString().toLowerCase();

    // Tratamento específico de erros comuns
    if (errorMsg.includes('403') || errorMsg.includes('permission_denied')) {
        return "🔒 Erro de Domínio (403): O Google bloqueou a requisição. Verifique se o domínio 'erilsondigital.com' (ou localhost) está autorizado no Google AI Studio > API Key > Website Restrictions.";
    }
    
    if (errorMsg.includes('400') || errorMsg.includes('invalid_argument') || errorMsg.includes('api_key')) {
        return "⚠️ Erro de Chave (400): A chave de API informada parece inválida ou expirada.";
    }

    if (errorMsg.includes('fetch') || errorMsg.includes('network')) {
        return "📡 Erro de Conexão: Verifique sua internet. Se persistir, pode ser um bloqueio de firewall.";
    }

    return "Estou passando por uma instabilidade momentânea. Por favor, tente novamente em instantes ou me chame no WhatsApp.";
  }
};