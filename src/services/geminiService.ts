import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const SYSTEM_INSTRUCTION = `
Você é um assistente especialista em flerte, conversa, linguagem social e atração.
Sua tarefa é analisar prints de conversas (WhatsApp, Instagram, etc.) e fornecer insights estratégicos.

OBJETIVOS:
1. Analisar o tom da conversa (romântico, engraçado, frio, interessado, tímido).
2. Detectar sinais de interesse ou falta dele.
3. Gerar 3 respostas estratégicas e naturais (Leve, Médio, Ousado).
4. Explicar por que cada resposta funciona.
5. Indicar a melhor opção e o que evitar.

REGRAS:
- Nunca seja ofensivo, manipulador ou desrespeitoso.
- Foco em conexão genuína e carisma.
- Se o usuário pedir algo tóxico, recuse educadamente e sugira algo autêntico.
- Mantenha um tom encorajador e especialista.
`;

export enum AnalysisMode {
  NORMAL = 'normal',
  PICKUP = 'pickup',
  RESCUE = 'rescue',
  NAMES = 'names'
}

const MODE_INSTRUCTIONS: Record<AnalysisMode, string> = {
  [AnalysisMode.NORMAL]: 'Analise o interesse e sugira respostas estratégicas normais.',
  [AnalysisMode.PICKUP]: 'Gere cantadas criativas e personalizadas baseadas no contexto e nos interesses percebidos da pessoa no print.',
  [AnalysisMode.RESCUE]: 'O papo está esfriando. Sugira mensagens envolventes para reacender o interesse e mudar o rumo da conversa.',
  [AnalysisMode.NAMES]: 'Análise de compatibilidade de nomes. Faça uma análise lúdica, criativa e carismática. Use referências de cultura pop (casais famosos, filmes, músicas) e crie arquétipos de personalidade engraçados para os nomes (ex: "O casal vibe Golden Retriever", "Energia de filme Indie"). Se houver print, use-o para reforçar a análise.',
};

export async function analyzeConversation(
  imageBase64?: string | null, 
  mode: AnalysisMode = AnalysisMode.NORMAL,
  extraData?: { names?: string }
): Promise<AnalysisResult> {
  try {
    const promptText = extraData?.names 
      ? `MODO ATUAL: ${MODE_INSTRUCTIONS[mode]}. NOMES FORNECIDOS: ${extraData.names}. Analise como esses nomes combinam${imageBase64 ? ' e também a conversa no print' : ''}.`
      : `MODO ATUAL: ${MODE_INSTRUCTIONS[mode]}. Analise esta conversa e forneça uma análise detalhada e sugestões de resposta seguindo o formato JSON especificado.`;

    const parts: any[] = [{ text: promptText }];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: imageBase64.split(",")[1],
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: parts,
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interestLevel: { type: Type.STRING, description: "Nível de interesse detectado (ex: Alto, Médio, Baixo)" },
            tone: { type: Type.STRING, description: "Tom da conversa (ex: Engraçado, Formal, etc)" },
            signs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sinais de interesse ou falta dele" },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  level: { type: Type.STRING, enum: ["leve", "médio", "ousado"] },
                  explanation: { type: Type.STRING }
                },
                required: ["text", "level", "explanation"]
              }
            },
            bestOption: { type: Type.STRING, description: "Justificativa de qual resposta é a melhor" },
            thingsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: "O que não responder de jeito nenhum" }
          },
          required: ["interestLevel", "tone", "signs", "suggestions", "bestOption", "thingsToAvoid"]
        },
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Falha ao analisar a conversa. Tente novamente.");
  }
}
