import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Check,
  Flame,
  Quote,
  TrendingUp,
  ChevronRight,
  Dumbbell,
  Target,
  BookOpen,
  Sparkles,
  Info,
  Zap,
} from 'lucide-react';
import { useOperativeStore, Mission } from '../store/useOperativeStore';
import { getDailyQuote } from '../data/quotes';

// Get time-based greeting for operative
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return { text: 'Night Ops', emoji: '🦉' };
  if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '⚡' };
  if (hour < 21) return { text: 'Good Evening', emoji: '🌙' };
  return { text: 'Late Watch', emoji: '🔥' };
}

// Helper to get mission domain color
const getMissionDomainColor = (domain: Mission['domain']) => {
  switch (domain) {
    case 'physical': return 'text-red-400';
    case 'tactical': return 'text-amber-400';
    case 'intellectual': return 'text-blue-400';
    case 'strategic': return 'text-violet-400';
    default: return 'text-slate-400';
  }
};

export function Dashboard() {
  const { dailyProtocols, toggleProtocol, startDate, lifts, missions, books } = useOperativeStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const quote = getDailyQuote();
  const greeting = getGreeting();

  // Haptic feedback
  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate overall program progress (6-month induction)
  const start = new Date(startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 6); // 6-month program
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((currentTime.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const overallProgressPercent = Math.min(100, (daysElapsed / totalDays) * 100);

  // Determine current phase
  const getPhase = () => {
    if (daysElapsed <= 60) return { name: 'FOUNDATION', color: 'text-blue-400', bg: 'bg-blue-500', description: 'Building the base' };
    if (daysElapsed <= 120) return { name: 'POWER SURGE', color: 'text-amber-400', bg: 'bg-amber-500', description: 'Accelerating growth' };
    return { name: 'FINAL POLISH', color: 'text-emerald-400', bg: 'bg-emerald-500', description: 'Refining excellence' };
  };
  
  const phase = getPhase();
  const completedProtocols = dailyProtocols.filter((p) => p.completed).length;
  const totalProtocols = dailyProtocols.length;
  const allProtocolsComplete = completedProtocols === dailyProtocols.length && dailyProtocols.length > 0;
  
  // Active missions & most critical mission
  const activeMissions = missions.filter(m => m.status === 'active').length;
  const criticalMission = missions.filter(m => m.status === 'active').sort((a,b) => {
    // Prioritize by lowest progress, then by nearest due date
    if (a.progress !== b.progress) return a.progress - b.progress;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  })[0];

  // Books in progress
  const readingBooks = books.filter(b => b.status === 'reading');

  // Format date
  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="w-full space-y-5 pb-8 safe-area-pb lg:safe-area-pb-0">
      {/* Top Banner: Operative Status & Daily Protocols */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-slate-900/60 glass rounded-2xl p-4 border border-slate-800/50 shadow-xl safe-area-px mx-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div 
              className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/10 holographic-glow"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </motion.div>
            <div>
              <h1 className="font-display text-lg font-semibold text-white tracking-wide">{greeting.text}, Operative.</h1>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">MISSION STATUS: NOMINAL</p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-right"
          >
            <span className="block text-sm font-semibold text-white font-mono tabular-nums">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            <span className="block text-[11px] text-slate-500 uppercase tracking-wider">{formattedDate.split(', ')[0]}</span>
          </motion.div>
        </div>

        {/* Daily Protocols Summary */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className={`w-4 h-4 ${allProtocolsComplete ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-xs font-semibold text-white">Daily Protocols</span>
            </div>
            <span className={`text-xs font-mono tabular-nums ${allProtocolsComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {completedProtocols}/{totalProtocols} Complete
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Layout for Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 safe-area-px mx-auto">
        {/* Critical Mission Brief - Large Card */}
        {criticalMission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-2 card-elevated p-6 energy-border hover:shadow-emerald-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display text-white tracking-tight">Critical Mission Brief</h2>
              <Target className={`w-5 h-5 ${getMissionDomainColor(criticalMission.domain)}`} />
            </div>
            <h3 className="text-2xl font-display text-white mb-2 leading-tight">{criticalMission.name}</h3>
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">{criticalMission.description}</p>

            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-white">Progress</span>
              <span className="font-mono tabular-nums text-emerald-400">{criticalMission.progress}%</span>
            </div>
            <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${criticalMission.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Domain: {criticalMission.domain}</span>
              <span>Due: {new Date(criticalMission.dueDate).toLocaleDateString()}</span>
            </div>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full btn-accent py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              <ChevronRight className="w-4 h-4" />
              Initiate Protocol
            </motion.button>
          </motion.div>
        )}

        {/* Program Overview / Time Remaining */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: criticalMission ? 0.2 : 0.1, ease: 'easeOut' }}
          className="card-elevated p-6 energy-border hover:shadow-violet-400/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-white tracking-tight">Program Overview</h2>
            <Info className={`w-5 h-5 ${phase.color}`} />
          </div>
          <h3 className="text-4xl font-display text-white mb-2 leading-tight tabular-nums">{Math.round(overallProgressPercent)}%</h3>
          <p className="text-sm text-slate-400 mb-4">Current Phase: <span className={`font-semibold ${phase.color}`}>{phase.name}</span></p>
          
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-white">Days Remaining</span>
            <span className="font-mono tabular-nums text-violet-400">{daysRemaining}</span>
          </div>
          <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
              className={`h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full`}
            />
          </div>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full btn-accent py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm text-violet-400 border-violet-500/30"
            style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(167, 139, 250, 0.08) 100%)' }}
          >
            <ChevronRight className="w-4 h-4" />
            View Timeline
          </motion.button>
        </motion.div>

        {/* Physical Readiness - Smaller Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: criticalMission ? 0.3 : 0.2, ease: 'easeOut' }}
          className="card-elevated p-6 energy-border hover:shadow-red-400/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-white tracking-tight">Physical Readiness</h2>
            <Dumbbell className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display tabular-nums text-white">{lifts[0]?.current || 0}</span>
            <span className="text-sm text-slate-400">kg Deadlift</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-display tabular-nums text-white">{lifts[1]?.current || 0}</span>
            <span className="text-xs text-slate-400">kg OHP</span>
          </div>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            className="w-full btn-accent py-2 rounded-xl flex items-center justify-center gap-2 text-sm text-red-400 border-red-500/30"
            style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)' }}
          >
            <Zap className="w-4 h-4" />
            Log Session
          </motion.button>
        </motion.div>

        {/* Intel Digest - Smaller Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: criticalMission ? 0.4 : 0.3, ease: 'easeOut' }}
          className="card-elevated p-6 energy-border hover:shadow-blue-400/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-white tracking-tight">Intel Digest</h2>
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          {readingBooks.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={readingBooks[0]?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-white mb-1 leading-tight line-clamp-2">{readingBooks[0].title}</h3>
                <p className="text-sm text-slate-400 line-clamp-1">by {readingBooks[0].author}</p>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full btn-accent py-2 rounded-xl flex items-center justify-center gap-2 text-sm text-blue-400 border-blue-500/30"
                  style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)' }}
                >
                  <ChevronRight className="w-4 h-4" />
                  Continue Reading
                </motion.button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-500 text-sm">No active intel. Time for a new book.</p>
            </div>
          )}
        </motion.div>

        {/* Daily Protocol Checklist - Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: criticalMission ? 0.5 : 0.4, ease: 'easeOut' }}
          className="card-elevated p-6 energy-border lg:col-span-2 hover:shadow-emerald-400/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-white tracking-tight">Daily Protocols</h2>
            <span className={`text-sm font-mono tabular-nums ${allProtocolsComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {completedProtocols}/{totalProtocols} Complete
            </span>
          </div>
          <div className="space-y-3">
            {dailyProtocols.map((protocol, index) => (
              <motion.button
                key={protocol.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                onClick={() => {
                  toggleProtocol(protocol.id);
                  vibrate();
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all energy-border ${
                  protocol.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                    : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                }`}
                aria-pressed={protocol.completed}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors holographic-glow ${
                  protocol.completed 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'border-slate-600'
                }`}>
                  {protocol.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
                <span className={`flex-1 text-left text-base font-medium ${
                  protocol.completed ? 'text-emerald-400 line-through opacity-70' : 'text-white'
                }`}>
                  {protocol.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quote of the Day - Small Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: criticalMission ? 0.6 : 0.5, ease: 'easeOut' }}
          className="card-elevated p-6 energy-border hover:shadow-purple-400/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-white tracking-tight">Intel Feed</h2>
            <Quote className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-sm italic text-slate-300 line-clamp-4 leading-relaxed">"{quote.text}"</p>
          <p className="text-xs text-violet-400 font-semibold text-right mt-3">- {quote.author}</p>
        </motion.div>

        {/* Overall Progress Stat - Small Card (Re-purposed from old Mission Clock) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: criticalMission ? 0.7 : 0.6, ease: 'easeOut' }}
          className="card-elevated p-6 energy-border hover:shadow-cyan-400/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-white tracking-tight">Operative Tier</h2>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-display tabular-nums text-white">Tier {Math.ceil(overallProgressPercent / 20)}</span>
          </div>
          <p className="text-sm text-slate-400">Progression to Elite</p>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full btn-accent py-2 rounded-xl flex items-center justify-center gap-2 text-sm text-cyan-400 border-cyan-500/30"
            style={{ background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.15) 0%, rgba(0, 255, 255, 0.08) 100%)' }}
          >
            <ChevronRight className="w-4 h-4" />
            View Ranks
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
