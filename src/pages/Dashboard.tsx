import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, TrendingUp, Globe, Video, Image, FileText, Mic, Shield, Users, Eye, BarChart3, MapPin, Zap } from 'lucide-react';

const stats = [
  { label: 'Active Threats', value: 1284, change: 12, icon: AlertTriangle, color: 'text-cyber-red' },
  { label: 'Scans Today', value: 45218, change: 8, icon: Eye, color: 'text-cyber-blue' },
  { label: 'Deepfakes Blocked', value: 567, change: 23, icon: Video, color: 'text-cyber-green' },
  { label: 'Active Investigators', value: 12453, change: 5, icon: Users, color: 'text-yellow-400' },
];

const recentThreats = [
  { id: '1', type: 'deepfake' as const, location: 'New York, USA', timestamp: '2 min ago', severity: 'critical' as const, description: 'Political figure deepfake video detected' },
  { id: '2', type: 'image' as const, location: 'London, UK', timestamp: '5 min ago', severity: 'high' as const, description: 'GAN-generated social media image' },
  { id: '3', type: 'voice' as const, location: 'Tokyo, Japan', timestamp: '8 min ago', severity: 'high' as const, description: 'Voice clone scam attempt identified' },
];

const threatTypeConfig = { deepfake: { icon: Video, color: 'text-cyber-red', bg: 'bg-cyber-red/20' }, image: { icon: Image, color: 'text-cyber-blue', bg: 'bg-cyber-blue/20' }, text: { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/20' }, voice: { icon: Mic, color: 'text-cyber-green', bg: 'bg-cyber-green/20' }, document: { icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-400/20' } };

export default function Dashboard() {
  const [animatedStats, setAnimatedStats] = useState(stats.map(s => ({ ...s, animated: 0 })));

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    stats.forEach((stat, i) => {
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const value = Math.min(Math.floor((stat.value / 60) * step), stat.value);
        setAnimatedStats(prev => prev.map((s, idx) => idx === i ? { ...s, animated: value } : s));
        if (step >= 60) clearInterval(timer);
      }, 33);
      timers.push(timer);
    });
    return () => timers.forEach(t => clearInterval(t));
  }, []);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-4xl lg:text-5xl neon-text mb-2">Cyber Command</h1>
          <p className="text-gray-400">Real-time threat monitoring and analytics</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {animatedStats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
              <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
              <div className="font-display font-bold text-3xl text-white mb-1">{animatedStats[i].animated.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card p-6">
            <h2 className="font-display font-semibold text-xl text-white mb-6 flex items-center gap-2"><Globe className="w-5 h-5 text-cyber-blue" />Global Threat Map</h2>
            <div className="relative h-64 rounded-lg bg-cyber-darker border border-white/10 overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-30" />
              {[{ x: 20, y: 30 }, { x: 50, y: 25 }, { x: 75, y: 35 }, { x: 80, y: 45 }].map((point, i) => (
                <div key={i} className="absolute" style={{ left: `${point.x}%`, top: `${point.y}%` }}><div className="w-3 h-3 rounded-full bg-cyber-red animate-pulse" /></div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h2 className="font-display font-semibold text-xl text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-cyber-red" />Live Alerts</h2>
            <div className="space-y-3">
              {recentThreats.map((threat) => {
                const config = threatTypeConfig[threat.type];
                const Icon = config.icon;
                return (
                  <div key={threat.id} className={`p-3 rounded-lg border ${threat.severity === 'critical' ? 'bg-cyber-red/10 border-cyber-red/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}><Icon className={`w-4 h-4 ${config.color}`} /></div>
                      <div className="flex-1"><p className="text-sm text-white truncate">{threat.description}</p><p className="text-xs text-gray-500">{threat.location} • {threat.timestamp}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}