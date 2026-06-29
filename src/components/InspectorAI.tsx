import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, User, AlertTriangle, Shield, Search, HelpCircle } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string }

const quickActions = [
  { label: 'Explain Results', icon: Search, prompt: 'Can you explain the detection results?' },
  { label: 'Safety Tips', icon: Shield, prompt: 'What safety actions should I take?' },
  { label: 'Report Threat', icon: AlertTriangle, prompt: 'How do I report a cyber threat?' },
  { label: 'Learn More', icon: HelpCircle, prompt: 'Tell me about deepfake detection' },
];

export default function InspectorAI({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: "Hello, I'm Inspector AI, your cyber investigation assistant. How can I assist you today?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTyping(false);
    setMessages((prev) => [...prev, { role: 'assistant', content: "I understand. Based on your question, I recommend using our AI Scanner to verify content authenticity." }]);
  };

  return (
    <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-16 bottom-0 w-full max-w-md z-50">
      <div className="h-full bg-cyber-darker/95 backdrop-blur-xl border-l border-cyber-green/30 flex flex-col shadow-neon-green">
        <div className="p-4 border-b border-cyber-green/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-cyber-green" />
            <div>
              <h3 className="font-display font-semibold text-cyber-green">Inspector AI</h3>
              <p className="text-xs text-gray-500">Online & Ready to Assist</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && <div className="w-8 h-8 rounded-lg bg-cyber-green/20 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-cyber-green" /></div>}
              <div className={`max-w-[80%] p-3 rounded-xl text-sm ${message.role === 'user' ? 'bg-cyber-blue/20 border border-cyber-blue/30 text-white' : 'bg-white/5 border border-white/10 text-gray-300'}`}>{message.content}</div>
              {message.role === 'user' && <div className="w-8 h-8 rounded-lg bg-cyber-blue/20 flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-cyber-blue" /></div>}
            </motion.div>
          ))}
          {isTyping && <div className="flex gap-3"><div className="w-8 h-8 rounded-lg bg-cyber-green/20 flex items-center justify-center"><Bot className="w-4 h-4 text-cyber-green" /></div><div className="bg-white/5 border border-white/10 p-3 rounded-xl"><div className="flex gap-1">{[0, 1, 2].map((i) => (<motion.div key={i} className="w-2 h-2 bg-cyber-green rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />))}</div></div></div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, i) => (
              <motion.button key={i} onClick={() => setInput(action.prompt)} className="flex items-center gap-2 p-2 text-xs bg-white/5 border border-white/10 rounded-lg hover:border-cyber-green/50 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <action.icon className="w-3 h-3 text-cyber-green" />
                <span className="text-gray-400">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-cyber-green/20">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Inspector AI..." className="flex-1 bg-cyber-dark border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyber-green/50" />
            <motion.button onClick={handleSend} className="p-2 bg-cyber-green/20 border border-cyber-green/50 rounded-lg hover:bg-cyber-green/30 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Send className="w-5 h-5 text-cyber-green" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}