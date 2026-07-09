import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, FileSearch, Languages, Copy, Download, CheckCircle, Search, ShieldCheck, Clock } from 'lucide-react';

interface OCRResult {
  caseId: string;
  detectedText: string;
  confidence: number;
  language: string;
  lineCount: number;
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  previewUrl: string;
  progress: number;
  status: 'uploading' | 'scanning' | 'complete' | 'error';
  result?: OCRResult;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
];

const features = [
  { icon: Search, title: 'Text Extraction', text: 'Reads printed text from images, screenshots, scanned pages, and PDFs.' },
  { icon: Languages, title: 'Language Selection', text: 'Choose the expected document language before processing.' },
  { icon: ShieldCheck, title: 'Case Output', text: 'Creates a case ID, confidence score, line count, and extracted text block.' },
  { icon: Clock, title: 'Fast Review', text: 'Keeps recent uploads on the left so investigators can switch between results.' },
];

export default function OCRScanner() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const simulateOCR = (uploadedFile: UploadedFile) => {
    let progress = 0;
    const interval = window.setInterval(() => {
      progress += Math.random() * 16;

      if (progress >= 100) {
        window.clearInterval(interval);
        const result: OCRResult = {
          caseId: `OCR-${Date.now()}`,
          detectedText: 'Sample extracted text from document. Connect this screen to the Python OCR endpoint to return real PaddleOCR text.',
          confidence: 85,
          language: selectedLanguage.toUpperCase(),
          lineCount: 12,
        };

        setFiles((prev) => prev.map((file) => file.id === uploadedFile.id ? { ...file, status: 'complete', progress: 100, result } : file));
        setSelectedFile((current) => current?.id === uploadedFile.id ? { ...current, status: 'complete', progress: 100, result } : current);
        return;
      }

      setFiles((prev) => prev.map((file) => file.id === uploadedFile.id ? { ...file, progress: Math.min(progress, 100), status: 'scanning' } : file));
      setSelectedFile((current) => current?.id === uploadedFile.id ? { ...current, progress: Math.min(progress, 100), status: 'scanning' } : current);
    }, 200);
  };

  const handleFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: formatFileSize(file.size),
        previewUrl,
        progress: 0,
        status: 'uploading',
      };

      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(newFile);
      simulateOCR(newFile);
    });
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(event.dataTransfer.files));
  }, [selectedLanguage]);

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <FileSearch className="h-9 w-9 text-cyber-blue" />
              <h1 className="text-3xl font-semibold text-white lg:text-4xl">OCR Investigation</h1>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-gray-400">
              Extract readable text from evidence images, screenshots, scanned documents, and PDFs.
            </p>
          </div>

          <div className="glass-card flex items-center gap-3 p-3">
            <Languages className="h-5 w-5 text-cyber-blue" />
            <span className="text-sm text-gray-400">Language</span>
            <select
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value)}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-cyber-blue"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code} className="bg-gray-900">{language.name}</option>
              ))}
            </select>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.15fr_0.8fr]">
          <motion.section initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div
              className={`glass-card p-6 transition-colors ${isDragging ? 'border-cyber-blue bg-cyber-blue/10' : 'border-white/10'}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                onChange={(event) => event.target.files && handleFiles(Array.from(event.target.files))}
                className="hidden"
              />
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <Upload className="mb-4 h-10 w-10 text-cyber-blue" />
                <h2 className="text-xl font-semibold text-white">Upload Evidence</h2>
                <p className="mt-2 text-sm text-gray-400">Drop a document image or PDF here.</p>
                <motion.button onClick={() => fileInputRef.current?.click()} className="btn-cyber mt-5" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  Browse Files
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-300">Uploaded files</div>
              <AnimatePresence>
                {files.map((file) => (
                  <motion.button
                    key={file.id}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 80 }}
                    className={`glass-card w-full p-4 text-left transition-colors ${selectedFile?.id === file.id ? 'border-cyber-blue bg-cyber-blue/10' : 'hover:border-white/20'}`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyber-blue/10 text-cyber-blue">
                        {file.previewUrl ? <Image className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-white">{file.name}</div>
                        <div className="mt-1 text-xs text-gray-400">{file.size} / {file.status}</div>
                      </div>
                      <div className="w-20">
                        <div className="progress-bar">
                          <motion.div className="progress-bar-fill" animate={{ width: `${file.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            {!selectedFile ? (
              <div className="flex min-h-[540px] flex-col items-center justify-center text-center">
                <FileText className="mb-4 h-16 w-16 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-300">No document selected</h2>
                <p className="mt-2 max-w-sm text-sm text-gray-500">Upload a file to preview it and review extracted text.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold text-white">OCR Result</h2>
                  <p className="mt-1 truncate text-sm text-gray-400">{selectedFile.name}</p>
                </div>

                <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
                  {selectedFile.previewUrl ? (
                    <img src={selectedFile.previewUrl} alt={selectedFile.name} className="max-h-72 w-full object-contain" />
                  ) : (
                    <div className="flex h-56 flex-col items-center justify-center">
                      <FileText className="mb-3 h-12 w-12 text-gray-600" />
                      <p className="text-sm text-gray-400">PDF preview unavailable</p>
                    </div>
                  )}
                </div>

                {selectedFile.result ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs text-gray-400">Confidence</div>
                        <div className="mt-1 text-2xl font-semibold text-cyber-green">{selectedFile.result.confidence}%</div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs text-gray-400">Language</div>
                        <div className="mt-1 text-2xl font-semibold text-cyber-blue">{selectedFile.result.language}</div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs text-gray-400">Lines</div>
                        <div className="mt-1 text-2xl font-semibold text-white">{selectedFile.result.lineCount}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">Extracted Text</div>
                          <div className="text-xs text-gray-500">{selectedFile.result.caseId}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-300 hover:text-cyber-blue" title="Copy text">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-300 hover:text-cyber-blue" title="Download text">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <pre className="max-h-56 overflow-auto whitespace-pre-wrap text-sm leading-6 text-gray-300">{selectedFile.result.detectedText}</pre>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyber-blue border-t-transparent" />
                    <p className="mt-4 text-sm text-cyber-blue">Processing OCR...</p>
                  </div>
                )}
              </div>
            )}
          </motion.section>

          <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="glass-card p-5">
              <h2 className="text-lg font-semibold text-white">What This Tool Provides</h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">OCR helps convert visual evidence into searchable, copyable investigation text.</p>
            </div>

            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-blue/10 text-cyber-blue">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-gray-400">{feature.text}</p>
                </div>
              );
            })}

            <div className="rounded-lg border border-cyber-green/30 bg-cyber-green/10 p-5">
              <div className="mb-2 flex items-center gap-2 text-cyber-green">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-semibold">Supported files</span>
              </div>
              <p className="text-sm leading-6 text-gray-300">JPG, PNG, WebP, and PDF uploads.</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
