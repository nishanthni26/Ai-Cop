import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Zap, Building2, Scan, Lock, FileText, Globe, Headphones } from 'lucide-react';

const plans = [
  { name: 'Free Scan', price: 0, description: 'Basic AI content detection for personal use', icon: Scan, color: 'cyber-blue', features: [{ name: '5 scans per month', included: true }, { name: 'Image analysis', included: true }, { name: 'Video analysis', included: false }] },
  { name: 'Pro Investigator', price: 49, description: 'Advanced tools for professional investigators', icon: Shield, color: 'cyber-green', popular: true, features: [{ name: '100 scans per month', included: true }, { name: 'All content types', included: true }, { name: 'API access', included: true }] },
  { name: 'Enterprise Security', price: 199, description: 'Enterprise-grade protection for organizations', icon: Building2, color: 'cyber-red', features: [{ name: 'Unlimited scans', included: true }, { name: 'Priority support', included: true }, { name: 'Custom integrations', included: true }] },
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl lg:text-5xl neon-text mb-4">Pricing Plans</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">Choose the right plan for your investigation needs</p>
          <div className="inline-flex items-center gap-4 p-2 bg-white/5 rounded-lg border border-white/10">
            <button onClick={() => setBillingPeriod('monthly')} className={`px-4 py-2 rounded-lg transition-all ${billingPeriod === 'monthly' ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue' : 'text-gray-400'}`}>Monthly</button>
            <button onClick={() => setBillingPeriod('annual')} className={`px-4 py-2 rounded-lg transition-all ${billingPeriod === 'annual' ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green' : 'text-gray-400'}`}>Annual <span className="ml-2 text-xs bg-cyber-green/20 px-2 py-0.5 rounded-full">Save 17%</span></button>
          </div>
        </motion.div>
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`relative glass-card p-6 ${plan.popular ? 'border-cyber-green scale-[1.02]' : ''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyber-green/20 border border-cyber-green rounded-full font-display font-semibold text-xs text-cyber-green">MOST POPULAR</div>}
              <div className="text-center mb-6 pt-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-${plan.color}/20 flex items-center justify-center`}><plan.icon className={`w-8 h-8 text-${plan.color}`} /></div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end justify-center gap-1"><span className="font-display font-bold text-4xl text-white">{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>{plan.price > 0 && <span className="text-gray-500 text-sm mb-1">/mo</span>}</div>
              </div>
              <ul className="space-y-3 mb-6">{plan.features.map((feature, j) => (<li key={j} className="flex items-center gap-3">{feature.included ? <Check className="w-5 h-5 text-cyber-green" /> : <X className="w-5 h-5 text-gray-600" />}<span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>{feature.name}</span></li>))}</ul>
              <motion.button className={`w-full py-3 rounded-lg font-display font-semibold transition-all ${plan.popular ? 'bg-cyber-green/20 border border-cyber-green text-cyber-green hover:bg-cyber-green/30' : `bg-${plan.color}/10 border border-${plan.color}/50 text-${plan.color}`}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{plan.price === 0 ? 'Get Started Free' : 'Subscribe Now'}</motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}