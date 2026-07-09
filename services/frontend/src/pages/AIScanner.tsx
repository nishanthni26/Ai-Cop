import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, Video, FileText } from 'lucide-react';
import Scanner from './Scanner';
import VideoScanner from './VideoScanner';
import OCRScanner from './OCRScanner';

const tabs = [
  { id: 'image', label: 'Image', icon: Scan },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'ocr', label: 'OCR', icon: FileText },
];

export default function AIScanner() {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 px-4 py-2 text-sm text-cyber-blue mb-4">
            <Scan className="h-4 w-4" />
            AI Scanner Hub
          </div>
          <h1 className="text-4xl font-semibold text-white lg:text-5xl">AI Scanner</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
            Run image-based fake content detection, video deepfake screening, and OCR investigation from a single unified scanner page.
          </p>
        </motion.div>

        <div className="mb-10 flex flex-wrap items-center gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${isActive ? 'bg-cyber-blue text-white shadow-neon-blue' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-white/10 bg-cyber-darker/80 p-4 shadow-[0_0_60px_rgba(0,255,255,0.06)]">
          {activeTab === 'image' && <Scanner />}
          {activeTab === 'video' && <VideoScanner />}
          {activeTab === 'ocr' && <OCRScanner />}
        </div>
      </div>
    </div>
  );
}
