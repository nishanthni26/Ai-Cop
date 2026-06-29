import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, Video, Mic, FileDigit, X, AlertTriangle, CheckCircle, Shield, TrendingUp, Activity, Eye, Loader2, Trash2, Download } from 'lucide-react';

type FileType = 'image' | 'video' | 'audio' | 'document' | 'text';
interface ScanResult { aiScore: number; fakeProbability: number; humanAuthenticity: number; threatLevel: 'low' | 'medium' | 'high' | 'critical'; riskMeter: number; detectedIssues: string[]; recommendations: string[]; }
interface UploadedFile { id: string; name: string; type: FileType; size: string; progress: number; status: 'uploading' | 'scanning' | 'complete' | 'error'; result?: ScanResult; }

const fileTypeConfig: { [key: string]: { icon: React.ElementType; color: string } } = { image: { icon: Image, color: 'text-cyber-blue' }, video: { icon: Video, color: 'text-cyber-red' }, audio: { icon: Mic, color: 'text-cyber-green' }, document: { icon: FileDigit, color: 'text-yellow-400' }, text: { icon: FileText, color: 'text-purple-400' } };

export default function Scanner() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): FileType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.includes('pdf') || file.type.includes('document')) return 'document';
    return 'text';
  };

  const generateScanResult = (): ScanResult => ({
    aiScore: Math.round(Math.random() * 100),
    fakeProbability: Math.round(Math.random() * 100),
    humanAuthenticity: Math.round(Math.random() * 100),
    threatLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
    riskMeter: Math.round(Math.random() * 100),
    detectedIssues: ['Detected GAN fingerprint patterns', 'Inconsistent facial keypoint movements', 'Unnatural lighting gradients detected'],
    recommendations: ['Cross-verify with official sources', 'Check original uploader credibility', 'Use reverse image search', 'Report if confirmed as fake'],
  });

  const formatFileSize = (bytes: number): string => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); handleFiles(Array.from(e.dataTransfer.files)); }, []);

  const handleFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      const newFile: UploadedFile = { id: Date.now().toString() + Math.random(), name: file.name, type: getFileType(file), size: formatFileSize(file.size), progress: 0, status: 'uploading' };
      setFiles((prev) => [...prev, newFile]);
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) { clearInterval(uploadInterval); simulateScan(newFile.id); }
        setFiles((prev) => prev.map((f) => (f.id === newFile.id ? { ...f, progress: Math.min(progress, 100) } : f)));
      }, 200);
    });
  };

  const simulateScan = (fileId: string) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: 'scanning', progress: 0 } : f)));
    let scanProgress = 0;
    const scanInterval = setInterval(() => {
      scanProgress += Math.random() * 10;
      if (scanProgress >= 100) { clearInterval(scanInterval); setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: 'complete', progress: 100, result: generateScanResult() } : f))); }
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: Math.min(scanProgress, 100) } : f)));
    }, 300);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl lg:text-5xl neon-text mb-4">AI Scanner Interface</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Upload any file to analyze for AI-generated content, deepfakes, and manipulation patterns.</p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className={`relative glass-card p-8 mb-6 transition-all ${isDragging ? 'border-cyber-blue bg-cyber-blue/10' : 'border-white/10'}`} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} />
              <div className="text-center">
                <Upload className="w-10 h-10 text-cyber-blue mx-auto mb-4" />
                <h3 className="font-display font-semibold text-xl text-white mb-2">Drop Files Here</h3>
                <p className="text-gray-400 text-sm mb-4">Drag & drop or click to upload</p>
                <motion.button onClick={() => fileInputRef.current?.click()} className="btn-cyber" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Browse Files</motion.button>
              </div>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div key={file.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 100 }} className={`glass-card p-4 cursor-pointer transition-all ${selectedFile?.id === file.id ? 'border-cyber-blue' : ''}`} onClick={() => setSelectedFile(file)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center ${fileTypeConfig[file.type].color}`}>{(() => { const Icon = fileTypeConfig[file.type].icon; return <Icon className="w-6 h-6" />; })()}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">{file.name}</h4>
                        <div className="text-sm text-gray-400">{file.type} • {file.size}</div>
                      </div>
                      <div className="w-24"><div className="progress-bar"><motion.div className="progress-bar-fill" initial={{ width: '0%' }} animate={{ width: `${file.progress}%` }} /></div></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="glass-card p-6 min-h-[400px]">
              {!selectedFile ? (<div className="h-full flex flex-col items-center justify-center text-center"><Eye className="w-16 h-16 text-gray-600 mb-4" /><h3 className="font-display text-xl text-gray-500">No File Selected</h3></div>) : selectedFile.result ? (
                <div>
                  <h3 className="font-display font-semibold text-xl text-white mb-4">Analysis Complete</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="glass-card p-4"><div className="text-xs text-gray-400">AI Generated Score</div><div className="font-display font-bold text-2xl text-cyber-red">{selectedFile.result.aiScore}%</div></div>
                    <div className="glass-card p-4"><div className="text-xs text-gray-400">Human Authenticity</div><div className="font-display font-bold text-2xl text-cyber-green">{selectedFile.result.humanAuthenticity}%</div></div>
                  </div>
                  <div className="glass-card p-4 mb-6"><div className="flex items-center justify-between"><span className="text-gray-400">Threat Level</span><span className={`font-display font-bold text-xl ${selectedFile.result.threatLevel === 'critical' ? 'text-cyber-red' : selectedFile.result.threatLevel === 'high' ? 'text-orange-500' : 'text-cyber-green'}`}>{selectedFile.result.threatLevel.toUpperCase()}</span></div></div>
                </div>
              ) : (<div className="h-full flex flex-col items-center justify-center"><div className="animate-spin w-16 h-16 border-2 border-cyber-blue border-t-transparent rounded-full" /><p className="text-cyber-blue mt-4">Scanning...</p></div>)}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}