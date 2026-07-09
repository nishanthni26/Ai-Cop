import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, History, Shield, Trash2 } from 'lucide-react';
import { clearHistory, getCurrentUser, getHistory, ScanHistoryItem } from '../lib/localStore';

const threatColor = {
  low: 'text-cyber-green',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-cyber-red',
};

export default function Reports() {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      setItems(getHistory(user.email));
    }
  }, [user?.email]);

  if (!user) {
    return (
      <div className="min-h-screen px-4 py-24">
        <div className="mx-auto max-w-xl glass-card p-8 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-cyber-blue" />
          <h1 className="text-2xl font-semibold text-white">Login Required</h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">Create an account or login to save and view your scan history.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login" className="btn-cyber">Login</Link>
            <Link to="/signup" className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-cyber-blue hover:text-cyber-blue">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <History className="h-8 w-8 text-cyber-blue" />
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-white lg:text-4xl">Scan History</h1>
              <p className="mt-2 text-sm text-gray-400">Saved image scans for {user.name}</p>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => {
                  clearHistory(user.email);
                  setItems([]);
                }}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:border-cyber-red hover:text-cyber-red"
              >
                <Trash2 className="h-4 w-4" />
                Clear History
              </button>
            )}
          </div>
        </motion.div>

        {items.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <History className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-300">No scans saved yet</h2>
            <p className="mt-2 text-sm text-gray-500">Run an image scan while logged in and it will appear here.</p>
            <Link to="/scanner" className="btn-cyber mt-6 inline-block">Open Scanner</Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="glass-card overflow-hidden"
              >
                <div className="h-48 bg-black/30">
                  <img src={item.imageUrl} alt={item.fileName} className="h-full w-full object-contain" />
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="truncate text-base font-semibold text-white">{item.fileName}</h2>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-xs text-gray-400">AI Image</div>
                      <div className="mt-1 text-2xl font-semibold text-white">{item.aiScore}%</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-xs text-gray-400">Authentic</div>
                      <div className="mt-1 text-2xl font-semibold text-cyber-green">{item.humanAuthenticity}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Risk</span>
                    <span className={`text-sm font-semibold uppercase ${threatColor[item.threatLevel]}`}>{item.threatLevel}</span>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-sm font-medium text-white">{item.insightTitle}</div>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{item.insightText}</p>
                    {item.imageDescription && (
                      <p className="mt-3 text-xs leading-5 text-gray-500">Image: {item.imageDescription}</p>
                    )}
                    {item.reasons && item.reasons.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {item.reasons.slice(0, 2).map((reason) => (
                          <div key={reason} className="flex gap-2 text-xs leading-5 text-gray-500">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyber-blue" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
