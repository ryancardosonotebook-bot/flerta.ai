import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onImageSelect: (base64: string) => void;
  onClear?: () => void;
  isProcessing: boolean;
}

export default function ImageUploader({ onImageSelect, onClear, isProcessing }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clear = () => {
    setPreview(null);
    onClear?.();
  };

  return (
    <div 
      className="w-full max-w-xl mx-auto"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              relative flex flex-col items-center justify-center w-full h-64 
              border-2 border-dashed rounded-3xl cursor-pointer 
              transition-all duration-300 ease-in-out
              ${isDragging 
                ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <Upload className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-purple-400' : 'text-zinc-400'}`} />
              <p className="mb-2 text-lg font-medium text-white">
                Mande o print aqui
              </p>
              <p className="text-sm text-zinc-400">
                Arraste a imagem ou clique para selecionar
              </p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={onFileChange} disabled={isProcessing} />
          </motion.label>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img 
              src={preview} 
              alt="Preview" 
              className={`w-full h-auto object-contain max-h-[500px] ${isProcessing ? 'opacity-50 grayscale' : ''}`} 
            />
            
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                  <p className="mt-4 text-white font-medium tracking-wide">Analisando o clima...</p>
                </div>
              </div>
            )}

            {!isProcessing && (
              <button
                onClick={clear}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
