import { motion } from 'framer-motion';
import { Shield, Users, Globe, Eye, Heart, Lock } from 'lucide-react';

const stats = [
  { value: '2.5M+', label: 'Scans Completed', icon: Eye },
  { value: '850K+', label: 'Threats Detected', icon: Shield },
  { value: '150+', label: 'Countries Protected', icon: Globe },
  { value: '100K+', label: 'Active Users', icon: Users },
];

const values = [
  { icon: Shield, title: 'Truth', description: 'We believe in a world where truth can be verified and misinformation can be detected.' },
  { icon: Lock, title: 'Security', description: 'Protecting individuals and organizations from AI-generated threats is our mission.' },
  { icon: Users, title: 'Trust', description: 'Building trust in digital communication through transparency and accuracy.' },
  { icon: Heart, title: 'Impact', description: 'Making the internet safer for everyone, one detection at a time.' },
];

export default function About() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display font-bold text-4xl lg:text-5xl neon-text mb-4">About AI Police</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">We're on a mission to protect the digital world from AI-generated misinformation and help organizations verify the authenticity of content.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="glass-card-hover p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-cyber-blue" />
              <div className="font-display font-bold text-3xl text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 md:p-12 mb-20">
          <h2 className="font-display font-bold text-3xl text-white mb-6">Our Mission</h2>
          <p className="text-gray-400 mb-4">In an era where AI can generate convincing fake content within seconds, the ability to verify authenticity has become crucial. AI Police was founded to address this growing challenge.</p>
          <p className="text-gray-400">Our advanced neural networks analyze content at the pixel, audio frequency, and linguistic pattern levels to detect manipulation that's invisible to the human eye.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-20">
          <h2 className="font-display font-bold text-3xl text-white text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass-card-hover p-6 text-center">
                <value.icon className="w-10 h-10 mx-auto mb-4 text-cyber-green" />
                <h3 className="font-display font-semibold text-xl text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}