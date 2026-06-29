import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, FileDigit, X, AlertTriangle, CheckCircle, Eye, Loader2, Trash2, Download, Copy, Check, FileSearch, Languages, Clock, Hash } from 'lucide-react';

interface OCRResult { caseId: string; detectedText: string; confidence: number; language: string; lineCount: number; }
interface UploadedFile { id: string; file: File; name: string; size: string; progress: number; status: 'uploading' | 'scanning' | 'complete' | 'error'; result?: OCRResult; }

const languages = [{ code: 'en', name: 'English' }, { code: 'zh', name: 'Chinese' }, { code: 'fr', name: 'French' }, { code: 'de', name: 'German' }, { code: 'es', name: 'Spanish' }];

export default function OCRScanner() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); handleFiles(Array.from(e.dataTransfer.files)); }, []);

  const handleFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      const newFile: UploadedFile = { id: Date.now().toString() + Math.random(), file, name: file.name, size: formatFileSize(file.size), progress: 0, status: 'uploading' };
      setFiles((prev) => [...prev, newFile]);
      simulateOCR(newFile);
    });
  };

  const simulateOCR = (uploadedFile: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) => prev.map((f) => f.id === uploadedFile.id ? { ...f, status: 'complete', progress: 100, result: { caseId: `OCR-${Date.now()}`, detectedText: 'Sample extracted text from document...', confidence: 85, language: selectedLanguage, lineCount: 12 } } : f));
      }
      setFiles((prev) => prev.map((f) => f.id === uploadedFile.id ? { ...f, progress: Math.min(progress, 100) } : f));
    }, 200);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <FileSearch className="w-12 h-12 text-cyber-blue mx-auto mb-4" />
          <h1 className="font-display font-bold text-4xl lg:text-5xl neon-text">OCR Investigation</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Extract text from images and documents using advanced PaddleOCR AI technology.</p>
        </motion.div>
        <div className="flex justify-center mb-8">
          <div className="glass-card p-4 inline-flex items-center gap-4">
            <Languages className="w-5 h-5 text-cyber-blue" />
            <span className="text-gray-400 text-sm">OCR Language:</span>
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none">
              {languages.map((lang) => (<option key={lang.code} value={lang.code} className="bg-gray-900">{lang.name}</option>))}
            </select>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className={`relative glass-card p-8 mb-6 transition-all ${isDragging ? 'border-cyber-blue bg-cyber-blue/10' : 'border-white/10'}`} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf" onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} className="hidden" />
              <div className="text-center">
                <Upload className="w-10 h-10 text-cyber-blue mx-auto mb-4" />
                <h3 className="font-display font-semibold text-xl text-white mb-2">Drop Documents Here</h3>
                <motion.button onClick={() => fileInputRef.current?.click()} className="btn-cyber" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Browse Files</motion.button>
              </div>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div key={file.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 100 }} className={`glass-card p-4 cursor-pointer ${selectedFile?.id === file.id ? 'border-cyber-blue' : ''}`} onClick={() => setSelectedFile(file)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-cyber-blue/10 flex items-center justify-center text-cyber-blue"><Image className="w-6 h-6" /></div>
                      <div className="flex-1"><h4 className="font-semibold text-white truncate">{file.name}</h4><div className="text-sm text-gray-400">{file.size} • {file.status}</div></div>
                      <div className="w-24"><div className="progress-bar"><motion.div className="progress-bar-fill" animate={{ width: `${file.progress}%` }} /></div></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="glass-card p-6 min-h-[500px]">
              {!selectedFile ? (<div className="h-full flex flex-col items-center justify-center"><FileText className="w-16 h-16 text-gray-600 mb-4" /><h3 className="font-display text-xl text-gray-500">No Document Selected</h3></div>) : selectedFile.result ? (
                <div>
                  <h3 className="font-display font-semibold text-xl text-white mb-4">OCR Analysis Complete</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="glass-card p-3"><div className="text-gray-400 text-xs">Confidence</div><div className="font-display font-bold text-lg text-cyber-green">{selectedFile.result.confidence}%</div></div>
                    <div className="glass-card p-3"><div className="text-gray-400 text-xs">Language</div><div className="font-display font-bold text-lg text-cyber-blue">{selectedFile.result.language}</div></div>
                    <div className="glass-card p-3"><div className="text-gray-400 text-xs">Lines</div><div className="font-display font-bold text-lg text-cyber-red">{selectedFile.result.lineCount}</div></div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4"><pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{selectedFile.result.detectedText}</pre></div>
                </div>
              ) : (<div className="h-full flex flex-col items-center justify-center"><div className="animate-spin w-16 h-16 border-2 border-cyber-blue border-t-transparent rounded-full" /><p className="text-cyber-blue mt-4">Processing OCR...</p></div>)}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}