import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, History, ShieldCheck, Zap, RefreshCw, Heart } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeConversation, AnalysisMode } from './services/geminiService';
import { AnalysisResult } from './types';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.NORMAL);
  const [names, setNames] = useState({ name1: '', name2: '' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const startAnalysis = async (image?: string | null) => {
    setIsProcessing(true);
    setResult(null);
    setError(null);
    try {
      const extraData = mode === AnalysisMode.NAMES && (names.name1 || names.name2) 
        ? { names: `${names.name1} e ${names.name2}` } 
        : undefined;
      
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-4xl mx-auto"
          >
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
        )}

        {/* Interaction Section */}
        <section className="mb-20 space-y-10">
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
          </div>

          <AnimatePresence mode="wait">
            {mode === AnalysisMode.NAMES && (
              <motion.div 
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
                <p className="text-center text-xs text-zinc-500 italic">
                  Opcional: Mande um print abaixo para uma análise ainda mais profunda!
                </p>
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
              <AnalysisDisplay result={result} />
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
