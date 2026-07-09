import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Eye, CheckCircle, AlertTriangle, Loader2, Zap, Shield, TrendingUp } from 'lucide-react';
import { addHistoryItem, getCurrentUser } from '../lib/localStore';

type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

interface ScanResult {
  aiScore: number;
  humanAuthenticity: number;
  threatLevel: ThreatLevel;
  detectionDetails: {
    frames_analyzed?: number;
    face_consistency?: number;
    color_consistency?: number;
    video_deepfake_score?: number;
    processing_time_ms: number;
    detection_method?: string;
    techniques?: string[];
  };
}

interface UploadedFile {
  id: string;
  name: string;
  type: 'video';
  size: string;
  progress: number;
  status: 'uploading' | 'scanning' | 'complete' | 'error';
  result?: ScanResult;
}

const threatStyles: Record<ThreatLevel, { text: string; border: string; bg: string }> = {
  low: { text: 'text-cyber-green', border: 'border-cyber-green/40', bg: 'bg-cyber-green/10' },
  medium: { text: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400/10' },
  high: { text: 'text-orange-400', border: 'border-orange-400/40', bg: 'bg-orange-400/10' },
  critical: { text: 'text-cyber-red', border: 'border-cyber-red/40', bg: 'bg-cyber-red/10' },
};

export default function VideoScanner() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || '/api/v1/scan-video';

  const formatFileSize = (bytes: number): string =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const formatPercent = (value: number): number => Number(value.toFixed(2));

  const buildVideoInsight = (score: number) => {
    if (score >= 80) {
      return {
        title: `${formatPercent(score)}% Deepfake Signal - CRITICAL`,
        text: `This video shows very strong deepfake indicators. Multiple frames exhibited unnatural facial patterns, inconsistent lighting, or frame blending artifacts typical of deepfake creation.`,
        tone: 'CRITICAL - Manual investigation required immediately.',
      };
    }

    if (score >= 60) {
      return {
        title: `${formatPercent(score)}% Deepfake Signal - HIGH`,
        text: `This video has significant deepfake indicators. Detected inconsistencies in face recognition, optical flow anomalies, or color channel artifacts across analyzed frames.`,
        tone: 'HIGH risk - Recommend immediate review by forensics team.',
      };
    }

    if (score >= 40) {
      return {
        title: `${formatPercent(score)}% Deepfake Signal - MEDIUM`,
        text: `This video has moderate deepfake indicators. Some frames showed potential artifacts, but results are inconclusive. Further analysis recommended.`,
        tone: 'MEDIUM - Additional verification needed.',
      };
    }

    return {
      title: `${formatPercent(score)}% Deepfake Signal - LOW`,
      text: `This video shows minimal deepfake indicators. Analyzed frames appear to have natural facial patterns and consistent temporal coherence typical of authentic video.`,
      tone: 'LOW risk - Video appears authentic.',
    };
  };

  const createScanResult = (data: any): ScanResult => {
    const score = formatPercent(Number(data.aiGeneratedScore ?? 0));
    const authenticity = formatPercent(100 - score);

    return {
      aiScore: score,
      humanAuthenticity: authenticity,
      threatLevel: (data.threatLevel ?? 'low') as ThreatLevel,
      detectionDetails: data.detectionDetails ?? {},
    };
  };

  const startProgress = (fileId: string) => {
    let progress = 0;
    const interval = window.setInterval(() => {
      progress = Math.min(90, progress + 8);
      setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)));
    }, 300);
    return interval;
  };

  const uploadAndScan = async (file: File, fileId: string) => {
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
        addHistoryItem(currentUser.email, {
          id: fileId,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          imageUrl: '',
          aiScore: result.aiScore,
          humanAuthenticity: result.humanAuthenticity,
          threatLevel: result.threatLevel,
          insightTitle: buildVideoInsight(result.aiScore).title,
          insightText: buildVideoInsight(result.aiScore).text,
          imageDescription: `Video file: ${file.name}`,
          reasons: [
            `Analyzed ${result.detectionDetails.frames_analyzed ?? 0} frames from video`,
            `Face consistency score: ${result.detectionDetails.face_consistency ?? 'N/A'}`,
            `Color consistency: ${result.detectionDetails.color_consistency ?? 'N/A'}`,
            `Detection method: ${result.detectionDetails.detection_method ?? 'Multi-Frame Analysis'}`,
          ],
          createdAt: new Date().toISOString(),
        });
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
      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type: 'video',
        size: formatFileSize(file.size),
        progress: 0,
        status: 'uploading',
      };

      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(newFile);
      uploadAndScan(file, newFile.id);
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
    <div className="relative min-h-screen overflow-hidden px-4 py-16 sm:py-20">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-red/5 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center lg:mb-16"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyber-red/30 bg-cyber-red/10 px-4 py-2">
            <Video className="h-4 w-4 text-cyber-red" />
            <span className="text-sm font-medium text-cyber-red">Advanced Video Deepfake Detector</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Video <span className="text-cyber-red">Deepfake</span> Scanner
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Upload videos and detect deepfakes using multi-frame analysis. Real-time optical flow, face consistency, and temporal coherence detection.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* Left Panel - Upload */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div
              className={`group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                isDragging
                  ? 'border-cyber-red bg-cyber-red/20'
                  : 'border-white/20 bg-white/[0.02] hover:border-cyber-red/50 hover:bg-white/[0.04]'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/0 via-transparent to-cyber-red/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                multiple
                accept="video/*"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              />

              <div className="relative flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
                <motion.div
                  animate={{ y: isDragging ? -10 : 0 }}
                  className="mb-4"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-red/30 to-red-500/30">
                    <Video className="h-8 w-8 text-cyber-red" />
                  </div>
                </motion.div>

                <h2 className="text-xl font-bold text-white">Drop your video</h2>
                <p className="mt-2 text-sm text-gray-400">or click to browse</p>

                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 rounded-lg bg-gradient-to-r from-cyber-red to-red-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-cyber-red/30 hover:shadow-cyber-red/50"
                >
                  Browse Files
                </motion.button>

                <p className="mt-4 text-xs text-gray-500">MP4, WebM, AVI • Max 500MB</p>
              </div>
            </div>

            {/* File Queue */}
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm max-h-[500px] overflow-y-auto"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Upload Queue</h3>
                  <span className="rounded-full bg-cyber-red/20 px-3 py-1 text-xs font-medium text-cyber-red">
                    {files.length} {files.length === 1 ? 'file' : 'files'}
                  </span>
                </div>

                <AnimatePresence>
                  {files.map((file) => {
                    const isSelected = selectedFile?.id === file.id;
                    const isComplete = file.status === 'complete';
                    const isError = file.status === 'error';

                    return (
                      <motion.button
                        key={file.id}
                        type="button"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`group relative w-full rounded-lg border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-cyber-red bg-cyber-red/15'
                            : 'border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-cyber-red">
                            <Video className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>

                          {isError && <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />}
                          {isComplete && <CheckCircle className="h-4 w-4 text-cyber-green shrink-0" />}
                          {!isComplete && !isError && <Loader2 className="h-4 w-4 text-cyber-red animate-spin shrink-0" />}
                        </div>

                        {!isComplete && !isError && (
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="h-full bg-gradient-to-r from-cyber-red to-red-600"
                              animate={{ width: `${file.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-xl sm:p-8"
          >
            {!selectedFile ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-xl bg-gradient-to-br from-red-500/10 to-cyber-red/10 p-4">
                  <Eye className="h-12 w-12 text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-300">No video selected</h2>
                <p className="mt-2 max-w-xs text-sm text-gray-500">Upload a video to begin deepfake detection analysis</p>
              </div>
            ) : selectedFile.status === 'complete' && selectedResult ? (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
                      <p className="mt-1 text-sm text-gray-400">{selectedFile.name}</p>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`rounded-xl border px-4 py-2 font-semibold ${currentThreat.bg} ${currentThreat.border} ${currentThreat.text}`}
                    >
                      {selectedResult.threatLevel.toUpperCase()}
                    </motion.div>
                  </div>
                </div>

                {/* Score Metrics */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Zap className="h-4 w-4 text-cyber-red" />
                      Deepfake Score
                    </div>
                    <div className="text-4xl font-bold text-cyber-red mb-3">
                      {selectedResult.aiScore}<span className="text-2xl text-gray-400">%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyber-red to-red-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedResult.aiScore}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-cyber-green/30 bg-cyber-green/10 p-5 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Shield className="h-4 w-4 text-cyber-green" />
                      Authenticity Score
                    </div>
                    <div className="text-4xl font-bold text-cyber-green mb-3">
                      {selectedResult.humanAuthenticity}<span className="text-2xl text-gray-400">%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyber-green to-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedResult.humanAuthenticity}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    {selectedResult.aiScore >= 50 ? (
                      <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-1" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-cyber-green flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <h3 className="font-semibold text-white mb-2">{buildVideoInsight(selectedResult.aiScore).title}</h3>
                      <p className="text-sm text-gray-300 mb-3 leading-relaxed">{buildVideoInsight(selectedResult.aiScore).text}</p>
                      <p className="text-xs text-gray-400 italic">{buildVideoInsight(selectedResult.aiScore).tone}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm"
                >
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyber-red" />
                    Analysis Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    {selectedResult.detectionDetails.frames_analyzed && (
                      <div className="flex justify-between items-center p-2 rounded bg-white/5">
                        <span>Frames Analyzed:</span>
                        <span className="font-semibold text-cyber-blue">{selectedResult.detectionDetails.frames_analyzed}</span>
                      </div>
                    )}
                    {selectedResult.detectionDetails.face_consistency !== undefined && (
                      <div className="flex justify-between items-center p-2 rounded bg-white/5">
                        <span>Face Consistency:</span>
                        <span className="font-semibold text-cyber-blue">{selectedResult.detectionDetails.face_consistency}%</span>
                      </div>
                    )}
                    {selectedResult.detectionDetails.color_consistency !== undefined && (
                      <div className="flex justify-between items-center p-2 rounded bg-white/5">
                        <span>Color Consistency:</span>
                        <span className="font-semibold text-cyber-blue">{selectedResult.detectionDetails.color_consistency}%</span>
                      </div>
                    )}
                    {selectedResult.detectionDetails.processing_time_ms && (
                      <div className="flex justify-between items-center p-2 rounded bg-white/5">
                        <span>Processing Time:</span>
                        <span className="font-semibold text-cyber-blue">{selectedResult.detectionDetails.processing_time_ms}ms</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="flex min-h-[500px] flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mb-6"
                >
                  <div className="h-16 w-16 rounded-full border-4 border-cyber-red/30 border-t-cyber-red" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white">Analyzing Video</h3>
                <p className="mt-2 text-sm text-gray-400">Running deepfake detection on video frames...</p>
                <div className="mt-6 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                      className="h-1 w-1 rounded-full bg-cyber-red"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
