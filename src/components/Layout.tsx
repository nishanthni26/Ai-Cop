import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Scan, LayoutDashboard, FileText, CreditCard, Info, Mail, Menu, X, Bot } from 'lucide-react';
import InspectorAI from './InspectorAI';

interface LayoutProps { children: ReactNode }

const navItems = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/scanner', label: 'AI Scanner', icon: Scan },
  { path: '/ocr', label: 'OCR', icon: FileText },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/pricing', label: 'Pricing', icon: CreditCard },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Mail },
];

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      <div className="fixed inset-0 cyber-grid pointer-events-none" />
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-darker/95 backdrop-blur-xl border-b border-cyber-blue/30 shadow-neon-blue' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Shield className="w-10 h-10 text-cyber-blue" />
              </motion.div>
              <span className="font-display font-bold text-xl tracking-wider neon-text hidden sm:block">AI POLICE</span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-cyber-blue/20 border border-cyber-blue text-cyber-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`} whileHover={{ x: 2 }}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-4">
              <motion.button onClick={() => setIsAIOpen(!isAIOpen)} className={`p-2 rounded-lg transition-all ${isAIOpen ? 'bg-cyber-green/20 border border-cyber-green' : 'bg-white/5 border border-white/10'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Bot className={`w-5 h-5 ${isAIOpen ? 'neon-text-green' : 'text-gray-400'}`} />
              </motion.button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10">
                {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-cyber-blue/20 bg-cyber-darker/95 backdrop-blur-xl">
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <motion.div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-cyber-blue/20 border border-cyber-blue' : 'bg-white/5'}`} whileTap={{ scale: 0.98 }}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-cyber-blue' : 'text-gray-400'}`} />
                        <span className={isActive ? 'text-cyber-blue' : 'text-gray-300'}>{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <main className="relative z-10 pt-16">{children}</main>
      <AnimatePresence>{isAIOpen && <InspectorAI onClose={() => setIsAIOpen(false)} />}</AnimatePresence>
      <footer className="relative z-10 border-t border-cyber-blue/20 bg-cyber-darker/80 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-cyber-blue" />
                <span className="font-display font-bold text-lg neon-text">AI POLICE</span>
              </div>
              <p className="text-gray-400 text-sm">Advanced AI-powered platform for detecting and analyzing fake content across the internet.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-cyber-blue mb-4">Platform</h4>
              <ul className="space-y-2">
                {navItems.slice(0, 5).map((item) => (
                  <li key={item.path}><Link to={item.path} className="text-gray-400 hover:text-cyber-blue transition-colors text-sm">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-cyber-blue mb-4">Company</h4>
              <ul className="space-y-2">
                {navItems.slice(5).map((item) => (
                  <li key={item.path}><Link to={item.path} className="text-gray-400 hover:text-cyber-blue transition-colors text-sm">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-cyber-blue mb-4">Taglines</h4>
              <ul className="space-y-2 text-sm text-gray-500 italic">
                <li>"Truth Needs Protection"</li>
                <li>"Detect. Verify. Protect."</li>
                <li>"Digital Crime Ends Here."</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 AI Police. All rights reserved. Protecting digital truth.</p>
            <div className="flex items-center gap-2 text-cyber-green">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              <span className="text-sm font-mono">System Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}