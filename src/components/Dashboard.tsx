import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { useOperativeStore } from '../store/useOperativeStore'
import { getDailyQuote } from '../data/quotes'

// Get time-based greeting
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 6) return { text: 'Night Owl', emoji: '🦉' }
  if (hour < 12) return { text: 'Good Morning', emoji: '☀️' }
  if (hour < 17) return { text: 'Good Afternoon', emoji: '⚡' }
  if (hour < 21) return { text: 'Good Evening', emoji: '🌙' }
  return { text: 'Late Night Grind', emoji: '🔥' }
}

export function Dashboard() {
  const { dailyProtocols, toggleProtocol, startDate, lifts, missions } = useOperativeStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const quote = getDailyQuote()
  const greeting = getGreeting()

  // Haptic feedback
  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(5)
    }
  }

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Calculate mission progress
  const start = new Date(startDate)
  const end = new Date(start)
  end.setMonth(end.getMonth() + 6)
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.ceil((currentTime.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, totalDays - daysElapsed)
  const progressPercent = Math.min(100, (daysElapsed / totalDays) * 100)

  // Determine current phase
  const getPhase = () => {
    if (daysElapsed <= 60) return { name: 'FOUNDATION', color: 'text-blue-500', bg: 'bg-blue-500', description: 'Building the base' }
    if (daysElapsed <= 120) return { name: 'POWER SURGE', color: 'text-amber-500', bg: 'bg-amber-500', description: 'Accelerating growth' }
    return { name: 'FINAL POLISH', color: 'text-emerald-500', bg: 'bg-emerald-500', description: 'Refining excellence' }
  }
  
  const phase = getPhase()
  const completedProtocols = dailyProtocols.filter((p) => p.completed).length
  const totalProtocols = dailyProtocols.length
  const allProtocolsComplete = completedProtocols === dailyProtocols.length && dailyProtocols.length > 0
  
  // Active missions count
  const activeMissions = missions.filter(m => m.status === 'active').length
  const activeMissionsList = missions.filter(m => m.status === 'active')

  // Format date
  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Swiss Header - Minimal & Clean */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Date Label - Swiss Typography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="text-label text-slate-500 mb-2"
        >
          {formattedDate}
        </motion.div>
        
        {/* Main Heading - Swiss Hierarchy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon-192.png" alt="SPECTRE icon" className="w-12 h-12 rounded-xl object-cover shadow-md" />
            <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-display text-white text-3xl md:text-4xl"
          >
            {greeting.text}
          </motion.h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            aria-label={`Day ${daysElapsed} streak`}
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span className="text-xs font-medium text-emerald-400 tabular-nums">Day {daysElapsed}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions - Horizontal Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto scrollbar-hide -mx-3 px-3 pb-1"
        role="group"
        aria-label="Quick actions"
      >
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="quick-action whitespace-nowrap touch-manipulation" 
          aria-label="Log workout"
        >
          <Dumbbell className="w-4 h-4 text-red-400" aria-hidden="true" />
          <span>Log Workout</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="quick-action whitespace-nowrap touch-manipulation" 
          aria-label={`${activeMissions} active missions`}
        >
          <Target className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span>{activeMissions} Active</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="quick-action whitespace-nowrap touch-manipulation" 
          aria-label="Open Intel Library"
        >
          <BookOpen className="w-4 h-4 text-blue-400" aria-hidden="true" />
          <span>Intel</span>
        </motion.button>
      </motion.div>

      {/* Stats Grid - Swiss Grid System */}
      <div className="grid grid-cols-2 gap-3">
        {/* Progress Card - Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 card-elevated p-4"
        >
          {/* Label */}
          <div className="text-label text-slate-500 mb-3">Mission Progress</div>
          
          {/* Stats Row */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-display text-5xl text-white tabular-nums mb-1">
                {Math.round(progressPercent)}%
              </div>
              <div className="text-sm text-slate-400">{phase.name}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-white tabular-nums">{daysRemaining}</div>
              <div className="text-xs text-slate-500">Days Left</div>
            </div>
          </div>
          
          {/* Progress Bar - Swiss Minimal */}
          <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              className={`h-full ${phase.bg} rounded-full`}
            />
          </div>
        </motion.div>

        {/* Protocol Cards - Swiss Minimal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-4 active:bg-slate-800/60 transition-colors"
        >
          <div className="text-label text-slate-500 mb-3">Daily Streak</div>
          <div className="text-3xl font-semibold text-white tabular-nums mb-1">
            {daysElapsed}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span className="text-xs text-emerald-400">Active</span>
          </div>
        </motion.div>

        {/* Mission Clock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-4 active:bg-slate-800/60 transition-colors"
        >
          <div className="text-label text-slate-500 mb-3">Mission Clock</div>
          <div className="text-3xl font-semibold text-white tabular-nums">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400">Live</span>
          </div>
        </motion.div>
      </div>

      {/* Daily Protocols - Swiss Clean */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card-elevated p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Daily Protocols</h2>
            <p className="text-label text-slate-500">{allProtocolsComplete ? 'Complete' : 'In Progress'}</p>
          </div>
          
          {/* Progress Indicator */}
          <div className="relative w-12 h-12" aria-hidden="true">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(39,39,42,0.5)" strokeWidth="3" />
              <motion.circle 
                cx="24" cy="24" r="20" 
                fill="none" 
                stroke={allProtocolsComplete ? "#10b981" : "#f59e0b"}
                strokeWidth="3"
                strokeDasharray="125.6"
                initial={{ strokeDashoffset: 125.6 }}
                animate={{ strokeDashoffset: 125.6 * (1 - completedProtocols / totalProtocols) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white tabular-nums">
                {completedProtocols}/{totalProtocols}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {dailyProtocols.map((protocol, index) => (
            <motion.button
              key={protocol.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.03 }}
              onClick={() => {
                toggleProtocol(protocol.id)
                vibrate()
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all ${
                protocol.completed 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : 'bg-slate-800/30 border border-slate-700/50 active:bg-slate-800/50'
              }`}
              aria-pressed={protocol.completed}
              aria-label={`${protocol.completed ? 'Completed' : 'Mark as complete'}: ${protocol.name}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
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
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>
              <span className={`flex-1 text-left text-sm ${
                protocol.completed ? 'text-emerald-400 font-medium' : 'text-slate-300'
              }`}>
                {protocol.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active Missions - Swiss Typography */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card-elevated p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Active Missions</h2>
            <p className="text-label text-slate-500">{activeMissions} in progress</p>
          </div>
          <Target className="w-5 h-5 text-blue-400" aria-hidden="true" />
        </div>
        
        <div className="space-y-2.5">
          {activeMissionsList.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.03 }}
              className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{mission.name}</span>
                <span className="text-xs text-slate-500 tabular-nums">{mission.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mission.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.03 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quote Card - Swiss Minimal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="card-elevated p-4"
        role="figure"
        aria-label="Daily inspiration quote"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-violet-500/20" aria-hidden="true">
            <Quote className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm md:text-base text-slate-200 italic leading-relaxed font-sans">
              "{quote.text}"
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" aria-hidden="true" />
              <p className="text-xs text-violet-400 font-semibold whitespace-nowrap font-sans">
                {quote.author}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lift Progress - Enhanced horizontal scroll */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        aria-labelledby="lift-progress-heading"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-red-400" aria-hidden="true" />
            <h2 id="lift-progress-heading" className="text-sm font-display tracking-wide text-white">Lift Progress</h2>
          </div>
          <button className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 font-sans" aria-label="View all lifts">
            View All
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
          {lifts.map((lift, index) => {
            const progress = (lift.current / lift.target) * 100
            const isComplete = progress >= 100
            return (
              <motion.div
                key={lift.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                className={`p-3.5 min-w-[140px] flex-shrink-0 rounded-2xl border transition-all ${
                  isComplete 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'card-elevated'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide font-medium font-sans">{lift.name}</div>
                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="level-badge"
                      aria-label="Goal achieved"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className={`text-2xl font-display tabular-nums ${isComplete ? 'text-emerald-400' : 'text-white'}`}>
                    {lift.current}
                  </span>
                  <span className="text-xs text-slate-500 font-sans">/ {lift.target} kg</span>
                </div>
                <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.min(100, progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`${lift.name} progress`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                    className={`h-full rounded-full ${
                      isComplete 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-slate-600 font-sans">Progress</span>
                  <span className={`text-xs font-mono tabular-nums ${isComplete ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {Math.min(100, progress).toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
