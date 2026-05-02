import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalysisMode, Relationship } from "../types";

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

const MODE_INSTRUCTIONS: Record<AnalysisMode, string> = {
  [AnalysisMode.NORMAL]: 'Analise o interesse e sugira respostas estratégicas normais.',
  [AnalysisMode.PICKUP]: 'Gere cantadas criativas e personalizadas baseadas no contexto e nos interesses percebidos da pessoa no print.',
  [AnalysisMode.RESCUE]: 'O papo está esfriando. Sugira mensagens envolventes para reacender o interesse e mudar o rumo da conversa.',
  [AnalysisMode.NAMES]: 'Análise de compatibilidade de nomes. Faça uma análise lúdica, criativa e carismática. Use referências de cultura pop (casais famosos, filmes, músicas) e crie arquétipos de personalidade engraçados para os nomes (ex: "O casal vibe Golden Retriever", "Energia de filme Indie"). Se houver print, use-o para reforçar a análise.',
  [AnalysisMode.SIMULATOR]: 'Você é um SIMULADOR DE PERSONALIDADE. Com base no nome, relação, estilo de escrita e personalidade fornecidos (e opcionalmente um print), tente responder como essa pessoa responderia. IMPORTANTE: Suas respostas devem vir com uma ressalva de que são previsões de probabilidade (~30%). Tente capturar gírias, pontuação e o "vibe" da pessoa.',
  [AnalysisMode.CALL_ADVICE]: 'Você é um COACH DE LINGUAGEM CORPORAL E TOM DE VOZ. Forneça conselhos para chamadas de vídeo ou áudio. Foque em: contato visual, gesticulação, modulação de voz, confiança e como transmitir calor humano. Se houver um print da pessoa ou da conversa, use para dar dicas específicas.',
  [AnalysisMode.PROFILE_ANALYSIS]: 'Você é um ANALISTA DE PERFIL DE REDES SOCIAIS. Com base nos links, bio ou informações fornecidas, identifique interesses, traços de personalidade e estilo de comunicação. Sugira 3 quebra-gelos (icebreakers) ou perguntas magnéticas baseadas nessas descobertas.',
};

export async function analyzeConversation(
  imageBase64?: string | null, 
  mode: AnalysisMode = AnalysisMode.NORMAL,
  extraData?: { names?: string, simulatorContext?: string, relationship?: Relationship, profileInfo?: string }
): Promise<AnalysisResult> {
  try {
    let promptText = "";
    const relText = extraData?.relationship ? `A RELAÇÃO entre vocês é: ${extraData.relationship}.` : "";
    
    if (mode === AnalysisMode.SIMULATOR) {
      promptText = `MODO SIMULADOR DE IMPACTO. 
      ${relText}
      DADOS E CONTEXTO: ${extraData?.simulatorContext}. 
      
      TAREFAS:
      1. Pegue a mensagem que o usuário deseja enviar (está no final de DADOS E CONTEXTO) e crie 3 versões MELHORES e MAIS EFICAZES para ELE enviar, baseadas no perfil da pessoa (coloque em 'suggestions').
      2. Para CADA uma dessas 3 versions, simule qual seria o 'TALVEZ' (a provável resposta DELA/DELE) com 30% de precisão e coloque no campo 'simulatedResponse' dentro de cada sugestão.
      3. No campo 'bestOption', faça um resumo de qual abordagem tem mais chance de sucesso geral.
      4. No campo 'tone', descreva brevemente a vibe/personalidade da pessoa simulada.
      
      ${imageBase64 ? "Use o print para capturar gírias e o estilo de escrita exato dela na simulação." : ""}
      `;
    } else if (mode === AnalysisMode.CALL_ADVICE) {
      promptText = `MODO CONSELHO DE CHAMADA (AUDIO/VÍDEO). 
      ${relText}
      Forneça dicas práticas de linguagem corporal e voz. 
      Nas suggestions, coloque 3 dicas principais sobre: 1. Presença visual (se vídeo), 2. Tom de voz, 3. Atitude.
      Na 'bestOption', dê um "Mantra" de confiança para o usuário repetir.
      No 'tone', descreva a energia ideal para a chamada.`;
    } else if (mode === AnalysisMode.PROFILE_ANALYSIS) {
      promptText = `MODO ANÁLISE DE PERFIL. 
      INFO DO PERFIL: ${extraData?.profileInfo}.
      Identifique interesses e estilo. 
      Nas suggestions, crie 3 abridores de conversa baseados no perfil.
      Na 'bestOption', defina o "Arquétipo" da pessoa (ex: "A Aventureira Intelectual").
      No 'tone', descreva como deve ser a abordagem ideal.`;
    } else if (extraData?.names) {
      promptText = `MODO ATUAL: ${MODE_INSTRUCTIONS[mode]}. ${relText} NOMES FORNECIDOS: ${extraData.names}. Analise como esses nomes combinam${imageBase64 ? ' e também a conversa no print' : ''}.`;
    } else {
      promptText = `MODO ATUAL: ${MODE_INSTRUCTIONS[mode]}. ${relText} Analise esta conversa e forneça uma análise detalhada e sugestões de resposta seguindo o formato JSON especificado.`;
    }
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
                  explanation: { type: Type.STRING },
                  simulatedResponse: { type: Type.STRING, description: "Uma provável resposta da pessoa a esta sugestão específica (usar apenas no modo simulador)" }
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
