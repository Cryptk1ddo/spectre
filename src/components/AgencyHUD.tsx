import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Target, Activity, Users, Lock, ChevronRight, BarChart3, Search, MessageSquare } from 'lucide-react';

const AgencyHUD = () => {
  const [activeSignals, setActiveSignals] = useState<string[]>([]);
  const [leadStatus, setLeadStatus] = useState('MONITORING');
  const [processedLeads, setProcessedLeads] = useState(142);

  // Simulated live data stream
  useEffect(() => {
    const signals = [
      "IP Trace: Milan, IT",
      "Behavioral Pattern: High Intent",
      "Liquidity Verified: Tier 1",
      "Sentiment: Focused",
      "Latency: 0.4ms"
    ];
    
    const interval = setInterval(() => {
      setActiveSignals(prev => {
        const next = [...prev, signals[Math.floor(Math.random() * signals.length)]];
        return next.slice(-5);
      });
      if (Math.random() > 0.8) setProcessedLeads(p => p + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-300 font-mono p-4 md:p-8 overflow-hidden selection:bg-emerald-500/30">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed inset-0 bg-radial-at-t from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Top Header - Status Bar */}
      <div className="relative flex justify-between items-center border-b border-slate-800 pb-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
          <div>
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">AURA INTELLIGENCE</h1>
            <p className="text-[10px] text-slate-500 tracking-[0.3em]">AUTONOMOUS INTAKE PROTOCOL v4.0</p>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] tracking-tighter">
          <div className="flex flex-col items-end">
            <span className="text-slate-600">SYSTEM STATUS</span>
            <span className="text-emerald-400">NOMINAL</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-600">LATENCY</span>
            <span className="text-emerald-400">0.04ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-600">ENCRYPTION</span>
            <span className="text-emerald-400">AES-256</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="relative grid grid-cols-12 gap-6">
        
        {/* Left Column: Real-time Signal Feed */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
            <h3 className="text-xs font-bold mb-4 flex items-center gap-2 text-white uppercase tracking-wider">
              <Activity className="w-4 h-4 text-emerald-500" />
              Live Signal Recon
            </h3>
            <div className="space-y-3 font-mono text-[11px]">
              <AnimatePresence mode="popLayout">
                {activeSignals.map((signal, i) => (
                  <motion.div
                    key={i + signal}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3 text-slate-400 border-l border-slate-800 pl-3"
                  >
                    <span className="text-emerald-500/50">{`>`}</span>
                    {signal}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 backdrop-blur-xl">
            <h3 className="text-xs font-bold mb-4 flex items-center gap-2 text-white uppercase tracking-wider">
              <Target className="w-4 h-4 text-emerald-500" />
              Lead Quality Analysis
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Liquidity Verification', value: 98 },
                { label: 'Intent Recognition', value: 84 },
                { label: 'Engagement Velocity', value: 92 }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] mb-1 uppercase tracking-widest text-slate-500 font-bold">
                    <span>{stat.label}</span>
                    <span>{stat.value}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Intelligence Dashboard */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 backdrop-blur-xl flex flex-col items-center justify-center">
              <Users className="w-6 h-6 text-emerald-500 mb-2 opacity-50" />
              <span className="text-2xl font-bold text-white tracking-tighter">{processedLeads}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Total Handled</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 backdrop-blur-xl flex flex-col items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-500 mb-2 opacity-50" />
              <span className="text-2xl font-bold text-white tracking-tighter">0.42s</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Avg Response</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 backdrop-blur-xl flex flex-col items-center justify-center">
              <BarChart3 className="w-6 h-6 text-emerald-500 mb-2 opacity-50" />
              <span className="text-2xl font-bold text-white tracking-tighter">42.8%</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Conv. Uplift</span>
            </div>
          </div>

          {/* Primary Intelligence Feed */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg backdrop-blur-xl overflow-hidden">
            <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-800/20">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Active Tactical Handler
              </h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red]" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
              </div>
            </div>
            <div className="p-6 h-[300px] overflow-y-auto space-y-4 font-mono text-sm leading-relaxed scrollbar-hide">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs text-emerald-500 font-bold">A1</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-emerald-400 text-xs mb-1 font-bold">INTAKE ANALYSIS_</p>
                  "Inbound lead identified as 'Lorenzo M.' (Milan). Metadata suggests High-Net-Worth status. Behavior: Focused. Qualification process initiated via stealth-empathy protocol."
                </div>
              </div>
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-lg rounded-tr-none text-slate-400">
                  "I'm interested in the branded residences in Brera. What is the expected delivery date for Phase 2?"
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs text-emerald-500 font-bold">A1</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-emerald-400 text-xs mb-1 font-bold">HANDLER RESPONSE_</p>
                  "Brera Phase 2 delivery is scheduled for Q4 2026. Given the exclusivity of the asset, only 3 units remain unreserved. Would you like a private dossier on the penthouse specs?"
                </div>
              </div>
            </div>
            <div className="p-4 bg-black/40 border-t border-slate-800 flex items-center gap-4">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-xs text-slate-600 italic">
                Awaiting manual override or autonomous next step...
              </div>
              <button className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-2 rounded hover:bg-emerald-500 hover:text-black transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating UI Elements */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-emerald-500 shadow-2xl hover:border-emerald-500/50 transition-all">
          <Shield className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-emerald-500 shadow-2xl hover:border-emerald-500/50 transition-all">
          <Lock className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Ticker */}
      <div className="fixed bottom-0 left-0 w-full bg-emerald-500 text-black py-1 px-4 text-[9px] font-black uppercase tracking-[0.2em] flex gap-8 whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-8"
        >
          <span>SYSTEM ONLINE: AURA_INTEL_PROTOCOL</span>
          <span>LIQUIDITY_QUAL_ACTIVE</span>
          <span>LATENCY: 0.04MS</span>
          <span>LOCATION: ROME_HQ</span>
          <span>OPERATIONAL_SILENCE_ENABLED</span>
          <span>ENCRYPTION: AES-256</span>
          <span>SYSTEM ONLINE: AURA_INTEL_PROTOCOL</span>
          <span>LIQUIDITY_QUAL_ACTIVE</span>
          <span>LATENCY: 0.04MS</span>
        </motion.div>
      </div>
    </div>
  );
};

export default AgencyHUD;
