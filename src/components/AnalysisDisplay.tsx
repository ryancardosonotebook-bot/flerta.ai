import React from 'react';
import { motion } from 'motion/react';
import { AnalysisResult, FlirtLevel, AnalysisMode } from '../types';
import { Heart, MessageCircle, AlertTriangle, Star, CheckCircle2, Search, Zap, Video, Globe } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  mode?: AnalysisMode;
}

const levelConfig: Record<string, { color: string, icon: any }> = {
  [FlirtLevel.LIGHT]: { color: 'text-blue-400 border-blue-500/30 bg-blue-500/5', icon: MessageCircle },
  [FlirtLevel.MEDIUM]: { color: 'text-purple-400 border-purple-500/30 bg-purple-500/5', icon: Heart },
  [FlirtLevel.BOLD]: { color: 'text-pink-400 border-pink-500/30 bg-pink-500/5', icon: Star },
};

export default function AnalysisDisplay({ result, mode }: Props) {
  const isSimulator = mode === AnalysisMode.SIMULATOR;
  const isCallAdvice = mode === AnalysisMode.CALL_ADVICE;
  const isProfile = mode === AnalysisMode.PROFILE_ANALYSIS;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-20">
      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            {isCallAdvice ? <Video className="w-6 h-6 text-blue-400" /> : isProfile ? <Globe className="w-6 h-6 text-green-400" /> : <Search className="w-6 h-6 text-purple-400" />}
            <h3 className="text-xl font-semibold text-white">
              {isSimulator ? 'Vibe da Simulação' : isCallAdvice ? 'Vibe da Chamada' : isProfile ? 'Análise do Perfil' : 'Análise do Interesse'}
            </h3>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            {isSimulator ? 'Personalidade Detectada' : isProfile ? 'O Arquétipo' : result.interestLevel}
          </p>
          <p className="text-zinc-400 leading-relaxed">
            {result.tone}
          </p>
          {!isSimulator && !isCallAdvice && !isProfile && (
            <div className="mt-6 flex flex-wrap gap-2">
              {result.signs.map((sign, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-zinc-300 text-xs border border-white/5">
                  • {sign}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-3xl bg-pink-500/5 border border-pink-500/20 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            {isSimulator ? <Zap className="w-6 h-6 text-red-400" /> : isCallAdvice ? <Star className="w-6 h-6 text-yellow-400" /> : <CheckCircle2 className="w-6 h-6 text-pink-400" />}
            <h3 className="text-xl font-semibold text-white">
              {isSimulator ? "O 'Talvez' dela/dele" : isCallAdvice ? 'Seu Mantra' : isProfile ? 'Observação' : 'Melhor Opção'}
            </h3>
          </div>
          <p className="text-zinc-300 italic mb-6 leading-relaxed">
            "{result.bestOption}"
          </p>
          
          {!isSimulator && !isCallAdvice && !isProfile ? (
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Evite Mandar</h3>
              </div>
              <ul className="space-y-2">
                {result.thingsToAvoid.map((item, i) => (
                  <li key={i} className="text-sm text-zinc-500 flex items-start gap-2">
                    <span className="text-red-900">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic mt-4">
              {isSimulator ? "* Esta é uma simulação baseada em dados limitados. 30% de precisão estimada." : "Foco na autenticidade e conexão genuína."}
            </p>
          )}
        </motion.div>
      </div>

      {/* Suggestions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-white">
          {isSimulator ? 'Sua Mensagem Melhorada' : isCallAdvice ? 'Dicas de Expressão' : isProfile ? 'Quebra-gelos Sugeridos' : 'Sugestões de Resposta'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.suggestions.map((suggestion, index) => {
            const config = levelConfig[suggestion.level] || levelConfig[FlirtLevel.LIGHT];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col h-full p-6 rounded-3xl border ${config.color} shadow-lg hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {isCallAdvice ? `Dica #${index + 1}` : suggestion.level}
                  </span>
                  <Icon className="w-5 h-5 opacity-60" />
                </div>
                
                <div className="flex-grow mb-8 flex items-center justify-center text-center">
                  <p className="text-lg font-medium text-white group-hover:text-purple-300">
                    "{suggestion.text}"
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <p className="text-xs text-zinc-400 leading-tight">
                    {suggestion.explanation}
                  </p>
                  
                  {suggestion.simulatedResponse && (
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-red-500" /> Talvez ela/ele diga:
                      </p>
                      <p className="text-sm italic text-zinc-300">
                        "{suggestion.simulatedResponse}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-zinc-500 hover:text-white text-sm transition-colors"
        >
          Analisar outro print
        </button>
      </div>
    </div>
  );
}
