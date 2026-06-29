import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Shield, AlertTriangle, Eye, Video, Image, Mic, Clock, User, CheckCircle } from 'lucide-react';

interface Report { id: string; caseName: string; type: 'deepfake' | 'image' | 'voice' | 'text' | 'document'; status: 'open' | 'investigating' | 'resolved' | 'closed'; threatLevel: 'low' | 'medium' | 'high' | 'critical'; created: string; summary: string; aiGeneratedScore: number; }

const mockReports: Report[] = [
  { id: 'CASE-2026-0842', caseName: 'Political Deepfake Video Analysis', type: 'deepfake', status: 'resolved', threatLevel: 'critical', created: '2026-06-28', summary: 'Detected AI-manipulated video with high confidence.', aiGeneratedScore: 94 },
  { id: 'CASE-2026-0841', caseName: 'Celeb Voice Clone Investigation', type: 'voice', status: 'investigating', threatLevel: 'high', created: '2026-06-28', summary: 'Identified synthetic voice clone used in fraud.', aiGeneratedScore: 87 },
  { id: 'CASE-2026-0840', caseName: 'Fake Social Media Identity', type: 'image', status: 'open', threatLevel: 'medium', created: '2026-06-27', summary: 'Profile pictures contain GAN-generated artifacts.', aiGeneratedScore: 72 },
];

const typeConfig = { deepfake: { icon: Video, color: 'cyber-red' }, image: { icon: Image, color: 'cyber-blue' }, voice: { icon: Mic, color: 'cyber-green' }, text: { icon: FileText, color: 'purple-400' }, document: { icon: FileText, color: 'yellow-400' } };

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = mockReports.filter((report) => report.caseName.toLowerCase().includes(searchQuery.toLowerCase()) || report.id.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-4xl lg:text-5xl neon-text-red mb-2">Investigation Reports</h1>
          <p className="text-gray-400">Forensic analysis documentation and evidence timeline</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by case name or ID..." className="w-full bg-cyber-dark border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50" /></div>
          </div>
        </motion.div>
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-4">
            {filteredReports.map((report, i) => {
              const config = typeConfig[report.type];
              const Icon = config.icon;
              return (
                <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedReport(report)} className={`glass-card p-4 cursor-pointer transition-all ${selectedReport?.id === report.id ? 'border-cyber-blue' : 'hover:border-white/30'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-${config.color}/20 flex items-center justify-center`}><Icon className={`w-5 h-5 text-${config.color}`} /></div>
                    <div className="flex-1"><span className="text-xs font-mono text-cyber-blue">{report.id}</span><h3 className="font-semibold text-white truncate">{report.caseName}</h3></div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            {!selectedReport ? (<div className="glass-card p-8 min-h-[600px] flex flex-col items-center justify-center"><FileText className="w-16 h-16 text-gray-600 mb-4" /><h3 className="font-display text-xl text-gray-500">No Report Selected</h3></div>) : (
              <div className="glass-card p-6">
                <div className="flex items-start justify-between mb-6">
                  <div><span className="text-xs font-mono text-cyber-blue">{selectedReport.id}</span><h2 className="font-display font-semibold text-2xl text-white mt-1">{selectedReport.caseName}</h2></div>
                  <motion.button className="btn-cyber flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Download className="w-4 h-4" />Export PDF</motion.button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center"><div className="text-gray-400 text-xs mb-2">AI Generated Score</div><div className="font-display font-bold text-3xl text-cyber-red">{selectedReport.aiGeneratedScore}%</div></div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center"><div className="text-gray-400 text-xs mb-2">Status</div><div className="font-display font-bold text-xl text-cyber-green uppercase">{selectedReport.status}</div></div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center"><div className="text-gray-400 text-xs mb-2">Threat Level</div><div className={`font-display font-bold text-xl ${selectedReport.threatLevel === 'critical' ? 'text-cyber-red' : 'text-orange-500'} uppercase`}>{selectedReport.threatLevel}</div></div>
                </div>
                <div className="mb-6"><h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-cyber-red" />Threat Analysis</h3><div className="bg-white/5 rounded-lg p-4 border border-white/10"><p className="text-gray-300">{selectedReport.summary}</p></div></div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}