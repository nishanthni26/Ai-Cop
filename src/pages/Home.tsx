import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Scan,
  Image,
  FileText,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Video,
  Mic,
  MessageSquare,
  Search,
  Cpu,
  Zap,
} from 'lucide-react';

const features = [
  { icon: Image, title: 'AI Image Scanner', description: 'Upload an image and get an AI-generation signal with an authenticity percentage.', color: 'cyber-blue' },
  { icon: FileText, title: 'OCR Investigation', description: 'Extract text from screenshots, document images, and PDFs with a review-friendly result panel.', color: 'cyber-green' },
  { icon: FileCheck, title: 'Saved History', description: 'Login to save scan thumbnails, scores, risk labels, and image insights.', color: 'cyber-blue' },
  { icon: AlertTriangle, title: 'Risk Labeling', description: 'Results are grouped as low, medium, high, or critical signal for quick review.', color: 'cyber-red' },
];

const comingSoonFeatures = [
  { icon: Video, title: 'Video Deepfake Detection', description: 'Frame-by-frame analysis for manipulated videos and face swaps.' },
  { icon: Mic, title: 'Voice Clone Detection', description: 'Audio screening for synthetic speech and voice impersonation.' },
  { icon: MessageSquare, title: 'AI Text Detector', description: 'Checks posts, emails, and messages for AI-written patterns.' },
  { icon: Search, title: 'Metadata Analysis', description: 'EXIF, compression, and source checks to support scan results.' },
  { icon: AlertTriangle, title: 'Scam Link Detection', description: 'Flags suspicious URLs, phishing pages, and fraud indicators.' },
  { icon: Cpu, title: 'Multi-Model Verification', description: 'Compares results across multiple detectors before showing high confidence.' },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CyberBackground />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark via-transparent to-cyber-dark z-10 pointer-events-none" />
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-red/10 border border-cyber-red/30 rounded-full mb-6" animate={{ boxShadow: ['0 0 20px rgba(255, 45, 85, 0.3)', '0 0 40px rgba(255, 45, 85, 0.5)', '0 0 20px rgba(255, 45, 85, 0.3)'] }} transition={{ duration: 2, repeat: Infinity }}>
              <div className="w-2 h-2 bg-cyber-red rounded-full animate-pulse" />
              <span className="text-cyber-red text-sm font-mono">LIVE THREAT DETECTION ACTIVE</span>
            </motion.div>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-9xl mb-4 tracking-wider">
              <span className="text-gradient">AI POLICE</span>
            </h1>
            <motion.p className="font-display text-lg sm:text-xl lg:text-2xl text-gray-400 mb-8 tracking-wide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Detecting Fake AI Content Before It Spreads
            </motion.p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {['Truth Needs Protection', 'Detect. Verify. Protect.', 'Digital Crime Ends Here.'].map((tag, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400">
                  {tag}
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/scanner">
                <motion.button className="btn-cyber text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Scan className="w-5 h-5 inline mr-2" />
                  Start Investigation
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div className="absolute top-0 left-0 right-0 h-32" animate={{ background: ['linear-gradient(to bottom, rgba(255, 45, 85, 0.15), transparent)', 'linear-gradient(to bottom, rgba(0, 212, 255, 0.15), transparent)', 'linear-gradient(to bottom, rgba(255, 45, 85, 0.15), transparent)'] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </section>

      {/* Features Section */}
      <section className="relative z-20 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl neon-text mb-4">What You Can Do</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Use focused tools for image AI-signal detection, OCR extraction, and saved review history.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6 relative overflow-hidden group">
                <div className="hud-corner hud-corner-tl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="hud-corner hud-corner-tr opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="hud-corner hud-corner-bl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="hud-corner hud-corner-br opacity-50 group-hover:opacity-100 transition-opacity" />
                <feature.icon className={`w-10 h-10 mb-4 text-${feature.color} group-hover:scale-110 transition-transform`} />
                <h3 className="font-display font-semibold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/scanner">
              <motion.button className="btn-cyber inline-flex items-center gap-2 group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Launch Scanner
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-20 border-y border-white/10 bg-white/[0.03] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <h2 className="font-display font-bold text-4xl lg:text-5xl neon-text mb-4">Recommended Next Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">These tools are planned additions and are marked clearly as coming soon.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoonFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="glass-card p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyber-blue/10 text-cyber-blue">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">Coming Soon</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-20 py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl neon-text-red mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Our advanced AI system analyzes content through multiple layers of detection.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Login', description: 'Create an account so scans can be saved to your personal history.', icon: Shield },
              { step: '02', title: 'Upload Image or Document', description: 'Use AI Scanner for image checks or OCR for text extraction.', icon: Zap },
              { step: '03', title: 'Review Results', description: 'See AI signal, authenticity, risk level, image insight, and saved history.', icon: FileCheck },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="relative p-8 glass-card text-center border-t-2 border-cyber-blue">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 font-display font-bold text-2xl neon-text">{item.step}</div>
                <item.icon className="w-12 h-12 mx-auto mb-4 text-cyber-blue" />
                <h3 className="font-display font-semibold text-xl text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card p-12 relative overflow-hidden">
            <Shield className="w-16 h-16 mx-auto mb-6 text-cyber-blue" />
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-white mb-4">Join the Fight Against AI-Generated Misinformation</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">Protect yourself and your organization from the rising threat of deepfakes and AI-generated fake content.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/pricing">
                <motion.button className="btn-cyber text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>View Pricing Plans</motion.button>
              </Link>
              <Link to="/contact">
                <motion.button className="px-6 py-3 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Contact Sales</motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function CyberBackground() {
  return (
    <div className="absolute inset-0">
      <motion.div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2">
        <motion.div className="absolute inset-0 border border-cyber-blue/20 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute inset-12 border border-cyber-red/20 rounded-full" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute inset-24 border border-cyber-green/20 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
      </motion.div>
      <motion.div className="absolute top-1/2 left-1/2 w-48 h-1 bg-gradient-to-r from-cyber-blue/50 to-transparent origin-left" style={{ transform: 'translate(-50%, -50%)' }} animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
      {[...Array(15)].map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-cyber-blue rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
      ))}
      <div className="absolute inset-0 cyber-grid opacity-30" />
    </div>
  );
}
