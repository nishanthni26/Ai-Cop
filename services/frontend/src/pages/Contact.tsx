import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'contact@aipolice.com', color: 'cyber-blue' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', color: 'cyber-green' },
  { icon: MapPin, label: 'Location', value: 'San Francisco, CA', color: 'cyber-red' },
  { icon: Clock, label: 'Hours', value: '24/7 Support', color: 'purple-400' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await new Promise((resolve) => setTimeout(resolve, 1500)); setSubmitted(true); };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center max-w-md">
          <CheckCircle className="w-20 h-20 mx-auto mb-6 text-cyber-green" />
          <h2 className="font-display font-bold text-2xl text-white mb-4">Message Sent</h2>
          <p className="text-gray-400 mb-6">Thank you for contacting AI Police. Our team will respond within 24-48 hours.</p>
          <motion.button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '', type: 'general' }); }} className="btn-cyber" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Send Another Message</motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl lg:text-5xl neon-text mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Have questions or need assistance? Our team is here to help protect you from AI-generated threats.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="glass-card-hover p-6 text-center">
              <method.icon className={`w-8 h-8 mx-auto mb-3 text-${method.color}`} />
              <div className="text-gray-400 text-sm mb-1">{method.label}</div>
              <div className="text-white font-medium">{method.value}</div>
            </motion.div>
          ))}
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8">
            <h2 className="font-display font-semibold text-2xl text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-gray-400 text-sm mb-2">Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-cyber-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50" placeholder="Your name" /></div>
                <div><label className="block text-gray-400 text-sm mb-2">Email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-cyber-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50" placeholder="your@email.com" /></div>
              </div>
              <div><label className="block text-gray-400 text-sm mb-2">Subject</label><input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-cyber-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50" placeholder="Brief description of your inquiry" /></div>
              <div><label className="block text-gray-400 text-sm mb-2">Message</label><textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-cyber-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue/50 resize-none" placeholder="Describe your inquiry in detail..." /></div>
              <motion.button type="submit" className="w-full btn-cyber flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><Send className="w-4 h-4" />Send Message</motion.button>
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="font-display font-semibold text-xl text-white mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-cyber-blue" />Headquarters</h3>
            <address className="not-italic text-gray-400 text-sm">
              <p>AI Police Headquarters</p>
              <p>123 Cyber Defense Center</p>
              <p>San Francisco, CA 94105</p>
              <p className="mt-2 text-cyber-blue">United States</p>
            </address>
          </motion.div>
        </div>
      </div>
    </div>
  );
}