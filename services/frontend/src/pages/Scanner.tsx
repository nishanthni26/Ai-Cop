import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, Video, Mic, FileDigit, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { addHistoryItem, createImageThumbnail, getCurrentUser } from '../lib/localStore';

type FileType = 'image' | 'video' | 'audio' | 'document' | 'text';
type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

interface ScanResult {
  aiScore: number;
  humanAuthenticity: number;
  threatLevel: ThreatLevel;
  insightTitle: string;
  insightText: string;
  imageDescription: string;
  resultTone: string;
  reasons: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  progress: number;
  status: 'uploading' | 'scanning' | 'complete' | 'error';
  imageUrl: string;
  result?: ScanResult;
}

const fileTypeConfig: Record<FileType, { icon: React.ElementType; color: string }> = {
  image: { icon: Image, color: 'text-cyber-blue' },
  video: { icon: Video, color: 'text-cyber-red' },
  audio: { icon: Mic, color: 'text-cyber-green' },
  document: { icon: FileDigit, color: 'text-yellow-400' },
  text: { icon: FileText, color: 'text-purple-400' },
};

const threatStyles: Record<ThreatLevel, { text: string; border: string; bg: string }> = {
  low: { text: 'text-cyber-green', border: 'border-cyber-green/40', bg: 'bg-cyber-green/10' },
  medium: { text: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400/10' },
  high: { text: 'text-orange-400', border: 'border-orange-400/40', bg: 'bg-orange-400/10' },
  critical: { text: 'text-cyber-red', border: 'border-cyber-red/40', bg: 'bg-cyber-red/10' },
};

export default function Scanner() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || '/api/v1/scan';

  const getFileType = (file: File): FileType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.includes('pdf') || file.type.includes('document')) return 'document';
    return 'text';
  };

  const formatFileSize = (bytes: number): string =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const formatPercent = (value: number): number => Number(value.toFixed(2));

  const buildImageInsight = (score: number, isInconclusive: boolean) => {
    if (isInconclusive) {
      return {
        title: 'Scan inconclusive',
        text: 'The image could not be checked by the ML detector right now. Start the Python ML backend and scan again for a real AI-image percentage.',
        tone: 'No final AI-image verdict was made.',
      };
    }

    if (score >= 80) {
      return {
        title: `${formatPercent(score)}% AI-generation signal`,
        text: `This image shows a strong AI-generation signal. This is a screening result, not final proof that the image is AI-created.`,
        tone: 'High signal. Manual review is recommended.',
      };
    }

    if (score >= 50) {
      return {
        title: `${formatPercent(score)}% AI-generation signal`,
        text: `This image has a noticeable AI-generation signal, but it should be treated as uncertain unless other checks support it.`,
        tone: 'Moderate signal. Do not treat as confirmed.',
      };
    }

    if (score >= 20) {
      return {
        title: `${formatPercent(score)}% AI-generation signal`,
        text: `This image has a low AI-generation signal. The scan found weak indicators, but most of the image still appears human/authentic.`,
        tone: 'Low AI-image signal.',
      };
    }

    return {
      title: `${formatPercent(score)}% AI-generation signal`,
      text: `This image shows very little sign of AI generation. The scan estimates that only ${formatPercent(score)}% of the image signal looks AI-made.`,
      tone: 'Image appears mostly authentic.',
    };
  };

  const buildScanReasons = (score: number, authenticity: number, isInconclusive: boolean): string[] => {
    if (isInconclusive) {
      return [
        'The ML detector was not available, so the scan could not produce a reliable reason.',
        'Start the Python backend and scan again for model-backed analysis.',
      ];
    }

    if (score >= 80) {
      return [
        `AI-generation signal is high at ${formatPercent(score)}%.`,
        `Human authenticity is low at ${formatPercent(authenticity)}%.`,
        'The visual pattern is closer to AI-generated examples than real-photo examples in the detector.',
        'This should still be reviewed manually before making a final decision.',
      ];
    }

    if (score >= 50) {
      return [
        `AI-generation signal is moderate at ${formatPercent(score)}%.`,
        `Human authenticity is ${formatPercent(authenticity)}%, so the result is not fully certain.`,
        'Some visual features matched AI-generated examples, but not strongly enough for a final verdict.',
      ];
    }

    if (score >= 20) {
      return [
        `AI-generation signal is low at ${formatPercent(score)}%.`,
        `Human authenticity is higher at ${formatPercent(authenticity)}%.`,
        'The detector found only weak AI-like indicators.',
      ];
    }

    return [
      `AI-generation signal is very low at ${formatPercent(score)}%.`,
      `Human authenticity is high at ${formatPercent(authenticity)}%.`,
      'The image pattern is closer to real/authentic examples than AI-generated examples.',
    ];
  };

  const createScanResult = (data: any): ScanResult => {
    const details = data.detectionDetails ?? {};
    const isInconclusive = details.analysis_status === 'inconclusive';
    const score = formatPercent(Number(details.hf_model_score ?? data.aiGeneratedScore ?? 0));
    const authenticity = formatPercent(100 - score);
    const insight = buildImageInsight(score, isInconclusive);
    const imageDescription = details.image_caption
      ?? (details.image_width && details.image_height
        ? `Uploaded ${details.image_orientation ?? 'image'} image, ${details.image_width} by ${details.image_height} pixels. Visual captioning was unavailable for this scan.`
        : 'Uploaded image selected for AI-generation review. Visual captioning was unavailable for this scan.');

    return {
      aiScore: score,
      humanAuthenticity: authenticity,
      threatLevel: (data.threatLevel ?? 'low') as ThreatLevel,
      insightTitle: insight.title,
      insightText: insight.text,
      imageDescription,
      resultTone: insight.tone,
      reasons: buildScanReasons(score, authenticity, isInconclusive),
    };
  };

  const startProgress = (fileId: string) => {
    let progress = 0;
    const interval = window.setInterval(() => {
      progress = Math.min(90, progress + 10);
      setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)));
    }, 200);
    return interval;
  };

  const uploadAndScan = async (file: File, fileId: string, historyImageUrl: string) => {
    setFiles((prev) => prev.map((item) => (item.id === fileId ? { ...item, status: 'scanning', progress: 10 } : item)));
    const progressInterval = startProgress(fileId);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Scan failed with status ${response.status}`);
      }

      const result = createScanResult(await response.json());
      const currentUser = getCurrentUser();

      if (currentUser) {
        const saved = addHistoryItem(currentUser.email, {
          id: fileId,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          imageUrl: historyImageUrl,
          aiScore: result.aiScore,
          humanAuthenticity: result.humanAuthenticity,
          threatLevel: result.threatLevel,
          insightTitle: result.insightTitle,
          insightText: result.insightText,
          imageDescription: result.imageDescription,
          reasons: result.reasons,
          createdAt: new Date().toISOString(),
        });

        if (!saved) {
          console.warn('Scan completed, but browser storage is full so history was not saved.');
        }
      }

      window.clearInterval(progressInterval);
      setFiles((prev) => prev.map((item) => (item.id === fileId ? { ...item, progress: 100, status: 'complete', result } : item)));
      setSelectedFile((current) => (current?.id === fileId ? { ...current, progress: 100, status: 'complete', result } : current));
    } catch (error) {
      window.clearInterval(progressInterval);
      setFiles((prev) => prev.map((item) => (item.id === fileId ? { ...item, status: 'error', progress: 100 } : item)));
      console.error('Scan upload error:', error);
    }
  };

  const handleFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type: getFileType(file),
        size: formatFileSize(file.size),
        progress: 0,
        status: 'uploading',
        imageUrl,
      };

      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(newFile);
      createImageThumbnail(file)
        .then((thumbnail) => uploadAndScan(file, newFile.id, thumbnail))
        .catch(() => uploadAndScan(file, newFile.id, ''));
    });
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(event.dataTransfer.files));
  }, []);

  const selectedResult = selectedFile?.result;
  const currentThreat = selectedResult ? threatStyles[selectedResult.threatLevel] : threatStyles.low;

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white lg:text-4xl">AI Image Scanner</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              Upload an image, review the AI-generation signal, and save the result to your history.
            </p>
          </div>
          <div className="rounded-lg border border-cyber-blue/30 bg-cyber-blue/10 px-4 py-3 text-sm text-cyber-blue">
            Screening result only. Manual review is recommended.
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div
              className={`glass-card p-5 transition-colors ${isDragging ? 'border-cyber-blue bg-cyber-blue/10' : 'border-white/10'}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => event.target.files && handleFiles(Array.from(event.target.files))}
              />
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <Upload className="mb-4 h-10 w-10 text-cyber-blue" />
                <h2 className="text-xl font-semibold text-white">Upload Image</h2>
                <p className="mt-2 text-sm text-gray-400">Drop an image here or choose one from your device.</p>
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-cyber mt-5"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Browse Files
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-300">Recent scans</div>
                <div className="text-xs text-gray-500">{files.length} file{files.length === 1 ? '' : 's'}</div>
              </div>
              <AnimatePresence>
                {files.map((file) => {
                  const Icon = fileTypeConfig[file.type].icon;
                  const isSelected = selectedFile?.id === file.id;

                  return (
                    <motion.button
                      key={file.id}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 80 }}
                      className={`glass-card w-full p-4 text-left transition-colors ${isSelected ? 'border-cyber-blue bg-cyber-blue/10' : 'hover:border-white/20'}`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5 ${fileTypeConfig[file.type].color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-white">{file.name}</div>
                          <div className="mt-1 text-xs text-gray-400">{file.type} / {file.size}</div>
                        </div>
                        <div className="w-24">
                          <div className="progress-bar">
                            <motion.div className="progress-bar-fill" initial={{ width: '0%' }} animate={{ width: `${file.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-5 lg:p-6">
            {!selectedFile ? (
              <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
                <Eye className="mb-4 h-14 w-14 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-300">No image selected</h2>
                <p className="mt-2 max-w-sm text-sm text-gray-500">Upload an image to see the AI-image estimate.</p>
              </div>
            ) : selectedResult ? (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-white">Scan Result</h2>
                        <p className="mt-1 max-w-md truncate text-sm text-gray-400">{selectedFile.name}</p>
                      </div>
                      <div className={`rounded-lg border px-3 py-2 text-sm font-semibold ${currentThreat.bg} ${currentThreat.border} ${currentThreat.text}`}>
                        {selectedResult.threatLevel.toUpperCase()}
                      </div>
                    </div>

                    {selectedFile.imageUrl && (
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
                        <img src={selectedFile.imageUrl} alt={selectedFile.name} className="max-h-[460px] w-full object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-sm text-gray-400">AI Image Probability</div>
                      <div className="mt-2 text-5xl font-semibold text-white">{selectedResult.aiScore}%</div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-cyber-blue transition-all duration-500" style={{ width: `${selectedResult.aiScore}%` }} />
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-sm text-gray-400">Human Authenticity</div>
                      <div className="mt-2 text-4xl font-semibold text-cyber-green">{selectedResult.humanAuthenticity}%</div>
                    </div>

                    <div className={`rounded-lg border p-5 ${currentThreat.bg} ${currentThreat.border}`}>
                      <div className="text-sm text-gray-400">Review Level</div>
                      <div className={`mt-2 text-2xl font-semibold uppercase ${currentThreat.text}`}>{selectedResult.threatLevel}</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-3 flex items-center gap-2">
                      {selectedResult.aiScore >= 50 ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-cyber-green" />
                      )}
                      <h3 className="text-base font-semibold text-white">Image Insight</h3>
                    </div>
                    <p className="text-base font-medium text-white">{selectedResult.insightTitle}</p>
                    <p className="mt-3 text-sm leading-6 text-gray-300">{selectedResult.insightText}</p>
                    <p className="mt-4 text-sm text-gray-400">{selectedResult.resultTone}</p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="text-base font-semibold text-white">Image Understanding</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-300">{selectedResult.imageDescription}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-base font-semibold text-white">Why This Result?</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {selectedResult.reasons.map((reason) => (
                      <div key={reason} className="flex gap-3 rounded-lg bg-white/[0.03] p-3 text-sm leading-6 text-gray-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyber-blue" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
                <div className="h-14 w-14 animate-spin rounded-full border-2 border-cyber-blue border-t-transparent" />
                <p className="mt-4 text-sm text-cyber-blue">Scanning image...</p>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
