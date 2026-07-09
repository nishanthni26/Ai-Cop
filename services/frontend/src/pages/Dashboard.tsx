import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, BarChart3, CheckCircle, History, Image, Shield } from 'lucide-react';
import { getCurrentUser, getHistory } from '../lib/localStore';

const getRiskCount = (items: ReturnType<typeof getHistory>, levels: string[]) =>
  items.filter((item) => levels.includes(item.threatLevel)).length;

export default function Dashboard() {
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen px-4 py-24">
        <div className="mx-auto max-w-xl glass-card p-8 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-cyber-blue" />
          <h1 className="text-2xl font-semibold text-white">Login Required</h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">Login to view your real scan activity and saved analysis summary.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login" className="btn-cyber">Login</Link>
            <Link to="/signup" className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-cyber-blue hover:text-cyber-blue">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  const history = getHistory(user.email);
  const totalScans = history.length;
  const highSignal = getRiskCount(history, ['high', 'critical']);
  const lowSignal = getRiskCount(history, ['low']);
  const averageScore = totalScans > 0
    ? Number((history.reduce((sum, item) => sum + item.aiScore, 0) / totalScans).toFixed(2))
    : 0;
  const latestScans = history.slice(0, 5);

  const cards = [
    { label: 'Total Scans', value: totalScans, icon: Image, color: 'text-cyber-blue' },
    { label: 'High AI Signal', value: highSignal, icon: AlertTriangle, color: 'text-cyber-red' },
    { label: 'Low Risk Scans', value: lowSignal, icon: CheckCircle, color: 'text-cyber-green' },
    { label: 'Average AI Score', value: `${averageScore}%`, icon: BarChart3, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <Activity className="h-9 w-9 text-cyber-blue" />
            <div>
              <h1 className="text-3xl font-semibold text-white lg:text-4xl">My Activity</h1>
              <p className="mt-2 text-sm text-gray-400">Real scan activity from {user.name}'s saved history.</p>
            </div>
          </div>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="glass-card p-5">
                <Icon className={`mb-4 h-7 w-7 ${card.color}`} />
                <div className="text-3xl font-semibold text-white">{card.value}</div>
                <div className="mt-1 text-sm text-gray-400">{card.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <section className="glass-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Recent Scans</h2>
                <p className="mt-1 text-sm text-gray-400">Latest saved image checks.</p>
              </div>
              <Link to="/reports" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:border-cyber-blue hover:text-cyber-blue">
                View History
              </Link>
            </div>

            {latestScans.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center">
                <History className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-300">No scans yet</h3>
                <p className="mt-2 text-sm text-gray-500">Run an image scan while logged in to see activity here.</p>
                <Link to="/scanner" className="btn-cyber mt-5 inline-block">Open Scanner</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {latestScans.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/30">
                      <img src={item.imageUrl} alt={item.fileName} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-white">{item.fileName}</div>
                      <div className="mt-1 text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">{item.aiScore}%</div>
                      <div className="text-xs uppercase text-gray-500">{item.threatLevel}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white">What This Page Shows</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-gray-400">
              <p>This page uses your saved scan history only. No fake global numbers are shown.</p>
              <p>Total scans, high-signal scans, low-risk scans, and average score are calculated from images you scanned while logged in.</p>
              <p>Use History for the full list, thumbnails, and individual insight text.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
