import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, History, ShieldCheck, Zap, RefreshCw, Heart, Video, Globe } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeConversation } from './services/geminiService';
import { AnalysisResult, AnalysisMode, Relationship } from './types';
import { Users, AlertCircle } from 'lucide-react';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.NORMAL);
  const [relationship, setRelationship] = useState<Relationship>('desconhecidos');
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [simulatorContext, setSimulatorContext] = useState({ 
    name: '', 
    relation: '', 
    style: '',
    personality: '',
    message: ''
  });
  const [profileInfo, setProfileInfo] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const startAnalysis = async (image?: string | null) => {
    setIsProcessing(true);
    setResult(null);
    setError(null);
    try {
      let extraData: any = { relationship };
      
      if (mode === AnalysisMode.NAMES && (names.name1 || names.name2)) {
        extraData.names = `${names.name1} e ${names.name2}`;
      } else if (mode === AnalysisMode.SIMULATOR) {
        extraData.simulatorContext = `Nome: ${simulatorContext.name}, Relação: ${relationship}, Estilo de escrita: ${simulatorContext.style}, Personalidade: ${simulatorContext.personality}${simulatorContext.message ? `, Mensagem enviada pelo usuário: "${simulatorContext.message}"` : ''}`;
      } else if (mode === AnalysisMode.PROFILE_ANALYSIS) {
        extraData.profileInfo = profileInfo;
      }
      
      const analysis = await analyzeConversation(image || selectedImage, mode, extraData);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageSelect = (base64: string) => {
    setSelectedImage(base64);
    startAnalysis(base64);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-purple-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-pink-600/10 blur-[100px]" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12 md:py-24">
        {/* Header Section */}
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">AI-Powered Charisma</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
          >
            Mestre do Flerte
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Transforme prints de conversas em conexões genuínas. 
            Envie um print e deixe a IA analisar os sinais e sugerir as melhores respostas.
          </motion.p>
        </header>

        {/* Feature Grid */}
        {!result && !isProcessing && (
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {/* Feature Cards ... kept same ... */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/[0.08] transition-colors">
                <MessageSquare className="w-6 h-6 text-purple-400 mb-4" />
                <h3 className="font-semibold mb-2 text-white">Análise de Tom</h3>
                <p className="text-sm text-zinc-500 leading-snug">Identificação automática do clima: romântico, frio, ou amigável.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/[0.08] transition-colors">
                <History className="w-6 h-6 text-pink-400 mb-4" />
                <h3 className="font-semibold mb-2 text-white">Resgate</h3>
                <p className="text-sm text-zinc-500 leading-snug">Se o papo esfriou, sugerimos ganchos criativos para reviver o interesse.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/[0.08] transition-colors">
                <ShieldCheck className="w-6 h-6 text-blue-400 mb-4" />
                <h3 className="font-semibold mb-2 text-white">Respeito & Charme</h3>
                <p className="text-sm text-zinc-500 leading-snug">Respostas que priorizam a autenticidade e o conforto de ambos.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-3 items-start"
            >
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/70 leading-relaxed text-left">
                <strong>Aviso:</strong> As sugestões de IA são baseadas em padrões estatísticos e nem sempre garantem o sucesso. Relacionamentos humanos são complexos; use sua intuição e seja autêntico acima de tudo.
              </p>
            </motion.div>
          </div>
        )}

        {/* Interaction Section */}
        <section className="mb-20 space-y-10">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto p-2 bg-white/5 border border-white/10 rounded-3xl">
              <button
                onClick={() => setMode(AnalysisMode.NORMAL)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${mode === AnalysisMode.NORMAL ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Análise</span>
              </button>
              <button
                onClick={() => setMode(AnalysisMode.PICKUP)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${mode === AnalysisMode.PICKUP ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Cantadas</span>
              </button>
              <button
                onClick={() => setMode(AnalysisMode.RESCUE)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${mode === AnalysisMode.RESCUE ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Resgate</span>
              </button>
              <button
                onClick={() => setMode(AnalysisMode.NAMES)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${mode === AnalysisMode.NAMES ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Nomes</span>
              </button>
              <button
                onClick={() => setMode(AnalysisMode.SIMULATOR)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${mode === AnalysisMode.SIMULATOR ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Simulador</span>
              </button>
              <button
                onClick={() => setMode(AnalysisMode.CALL_ADVICE)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${mode === AnalysisMode.CALL_ADVICE ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <Video className="w-4 h-4" />
                <span className="text-sm font-medium">Chamada</span>
              </button>
              <button
                onClick={() => setMode(AnalysisMode.PROFILE_ANALYSIS)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${mode === AnalysisMode.PROFILE_ANALYSIS ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Perfil</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-xl">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Users className="w-3 h-3" /> Sua relação com ela/ele:
              </label>
              <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-full">
                {['desconhecidos', 'amigos', 'namorados', 'casados', 'ex', 'você gosta dela', 'ela gosta de você', 'vocês dois se gostam'].map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setRelationship(rel as Relationship)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${relationship === rel ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === AnalysisMode.NAMES && (
              <motion.div 
                key="names-mode"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl mx-auto flex flex-col gap-4 px-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="Seu nome"
                    value={names.name1}
                    onChange={(e) => setNames({...names, name1: e.target.value})}
                    className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-colors text-white placeholder:text-zinc-600"
                  />
                  <input 
                    type="text" 
                    placeholder="Nome da pessoa"
                    value={names.name2}
                    onChange={(e) => setNames({...names, name2: e.target.value})}
                    className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-colors text-white placeholder:text-zinc-600"
                  />
                </div>
                <button
                  onClick={() => startAnalysis(selectedImage)}
                  disabled={isProcessing || (!names.name1 && !names.name2 && !selectedImage)}
                  className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <Heart className="w-5 h-5" />}
                  Analisar Nomes
                </button>
              </motion.div>
            )}

            {mode === AnalysisMode.PROFILE_ANALYSIS && (
              <motion.div 
                key="profile-analysis-mode"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto flex flex-col gap-4 px-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Info do Perfil (Link ou Bio)</label>
                  <textarea 
                    placeholder="Cole aqui o link do Instagram/Twitter ou a bio da pessoa..."
                    value={profileInfo}
                    onChange={(e) => setProfileInfo(e.target.value)}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-green-500/50 transition-colors text-white placeholder:text-zinc-700 min-h-[100px] resize-none"
                  />
                </div>
                <button
                  onClick={() => startAnalysis(selectedImage)}
                  disabled={isProcessing || !profileInfo}
                  className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : <Globe className="w-5 h-5" />}
                  Analisar Perfil
                </button>
              </motion.div>
            )}

            {mode === AnalysisMode.CALL_ADVICE && (
              <motion.div 
                key="call-advice-mode"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl mx-auto p-8 bg-blue-500/5 border border-blue-500/20 rounded-[32px] text-center"
              >
                <Video className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Preparação para Chamada</h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Mande um print da pessoa ou da conversa para receber dicas personalizadas de voz e postura.
                </p>
                <button
                  onClick={() => startAnalysis(selectedImage)}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                  Gerar Conselhos de Chamada
                </button>
              </motion.div>
            )}

            {mode === AnalysisMode.SIMULATOR && (
              <motion.div 
                key="simulator-mode"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto flex flex-col gap-6 p-8 bg-white/5 border border-white/10 rounded-[32px] shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <MessageSquare className="w-24 h-24 text-red-500" />
                </div>

                <div className="space-y-4 relative z-10">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-red-400" /> 
                    Configurar Simulador
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Nome da Pessoa</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Julia"
                        value={simulatorContext.name}
                        onChange={(e) => setSimulatorContext({...simulatorContext, name: e.target.value})}
                        className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500/50 transition-colors text-white placeholder:text-zinc-700"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Estilo de Escrita</label>
                      <input 
                        type="text" 
                        placeholder="Ex: abrevia tudo, usa emojis"
                        value={simulatorContext.style}
                        onChange={(e) => setSimulatorContext({...simulatorContext, style: e.target.value})}
                        className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500/50 transition-colors text-white placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Personalidade</label>
                    <input 
                      type="text" 
                      placeholder="Ex: sarcástica, tímida, super animada"
                      value={simulatorContext.personality}
                      onChange={(e) => setSimulatorContext({...simulatorContext, personality: e.target.value})}
                      className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500/50 transition-colors text-white placeholder:text-zinc-700"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold ml-1">Sua Mensagem (O que você diria?)</label>
                    <textarea 
                      placeholder="Digite aqui o que você pretende enviar para ver como ela/ele reagiria..."
                      value={simulatorContext.message}
                      onChange={(e) => setSimulatorContext({...simulatorContext, message: e.target.value})}
                      className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500/50 transition-colors text-white placeholder:text-zinc-700 min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                  <button
                    onClick={() => startAnalysis(selectedImage)}
                    disabled={isProcessing || (!simulatorContext.name && !selectedImage)}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Gerar Simulação (Prob. 30%)
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium italic overflow-hidden whitespace-nowrap">
                    A IA tentará mimetizar o comportamento com base nos dados fornecidos
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ImageUploader 
            onImageSelect={handleImageSelect} 
            onClear={() => setSelectedImage(null)}
            isProcessing={isProcessing} 
          />
        </section>

        {/* Error Handling */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AnalysisDisplay result={result} mode={mode} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <footer className="mt-auto py-12 text-center border-t border-white/5">
          <p className="text-zinc-600 text-xs tracking-widest uppercase">
            Privacidade Garantida • Imagens não são armazenadas
          </p>
        </footer>
      </main>
    </div>
  );
}
