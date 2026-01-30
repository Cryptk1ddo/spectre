import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Heart,
  Brain,
  Zap,
  Briefcase,
  BookMarked,
  Gauge,
  Clock,
} from 'lucide-react'
import { useOperativeStore } from '../store/useOperativeStore'

export function Analytics() {
  const {
    lifts,
    skills,
    books,
    missions,
    dailyProtocols,
    operativeAttributes,
    economicEngines,
    startDate,
  } = useOperativeStore()

  // Physical metrics
  const physicalMetrics = useMemo(() => {
    const totalTarget = lifts.reduce((sum, lift) => sum + lift.target, 0)
    const totalCurrent = lifts.reduce((sum, lift) => sum + lift.current, 0)
    const progress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

    return { progress, totalCurrent, totalTarget }
  }, [lifts])

  // Tactical metrics
  const tacticalMetrics = useMemo(() => {
    const tacticalSkills = skills.filter((s) =>
      ['combat', 'tradecraft'].includes(s.category)
    )
    const avgLevel = tacticalSkills.length > 0
      ? (tacticalSkills.reduce((sum, s) => sum + s.level, 0) / tacticalSkills.length / 5) * 100
      : 0

    return { avgLevel, count: tacticalSkills.length }
  }, [skills])

  // Intellectual metrics
  const intellectualMetrics = useMemo(() => {
    const read = books.filter((b) => b.status === 'analysed').length
    const reading = books.filter((b) => b.status === 'reading').length
    const progress = books.length > 0 ? (read / books.length) * 100 : 0

    return { progress, read, reading, total: books.length }
  }, [books])

  // Strategic metrics
  const strategicMetrics = useMemo(() => {
    const completedMissions = missions.filter((m) => m.status === 'completed').length
    const activeMissions = missions.filter((m) => m.status === 'active').length
    const totalRevenue = economicEngines.reduce((sum, e) => sum + e.monthlyRevenue, 0)

    return { completedMissions, activeMissions, totalRevenue }
  }, [missions, economicEngines])

  // Operative attributes strength
  const attributeStrength = useMemo(() => {
    return operativeAttributes.length > 0
      ? Math.round(
          ((operativeAttributes.reduce((sum, a) => sum + a.strength, 0)) /
            (operativeAttributes.length * 10)) *
            100
        )
      : 0
  }, [operativeAttributes])

  // Daily protocol compliance
  const protocolCompliance = useMemo(() => {
    return dailyProtocols.length > 0
      ? Math.round((dailyProtocols.filter((p) => p.completed).length / dailyProtocols.length) * 100)
      : 0
  }, [dailyProtocols])

  // Days in mission
  const daysElapsed = useMemo(() => {
    const start = new Date(startDate)
    const now = new Date()
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }, [startDate])

  const analyticsCards = [
    {
      title: 'Physical Progression',
      value: `${physicalMetrics.progress.toFixed(1)}%`,
      subtitle: `${physicalMetrics.totalCurrent.toFixed(0)}kg / ${physicalMetrics.totalTarget.toFixed(0)}kg`,
      icon: Heart,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      title: 'Tactical Mastery',
      value: `${tacticalMetrics.avgLevel.toFixed(0)}%`,
      subtitle: `${tacticalMetrics.count} skills in development`,
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Intellectual Capital',
      value: `${intellectualMetrics.progress.toFixed(0)}%`,
      subtitle: `${intellectualMetrics.read} of ${intellectualMetrics.total} books read`,
      icon: Brain,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Strategic Progress',
      value: `${((missions.reduce((sum, m) => sum + m.progress / m.target, 0) / missions.length) * 100).toFixed(0)}%`,
      subtitle: `${strategicMetrics.completedMissions} completed missions`,
      icon: Briefcase,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Days Elapsed Badge */}
      <div className="flex items-center gap-2 px-1">
        <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
        <span className="text-[11px] text-slate-500 font-medium font-sans tabular-nums" aria-live="polite">{daysElapsed} days elapsed</span>
      </div>

      {/* Key Metrics - Horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2" role="group" aria-label="Key metrics">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon

          return (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card-elevated min-w-[140px] p-3"
            >
              <div className={`w-8 h-8 rounded-full ${card.bg} flex items-center justify-center mb-2`} aria-hidden="true">
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-xl font-display text-white leading-none tabular-nums">{card.value}</div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-sans">{card.title}</p>
            </motion.article>
          )
        })}
      </div>

      {/* Mission & Performance Cards */}
      <div className="space-y-3">
        {/* Mission Summary - Compact */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-4"
          aria-labelledby="missions-summary-heading"
        >
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            <h2 id="missions-summary-heading" className="text-sm font-display tracking-wide text-white">Missions</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-slate-800/50 rounded-lg">
              <div className="text-lg font-display text-blue-400 tabular-nums">{strategicMetrics.activeMissions}</div>
              <div className="text-[10px] text-slate-500 font-sans">Active</div>
            </div>
            <div className="text-center p-2 bg-slate-800/50 rounded-lg">
              <div className="text-lg font-display text-emerald-400 tabular-nums">{strategicMetrics.completedMissions}</div>
              <div className="text-[10px] text-slate-500 font-sans">Done</div>
            </div>
            <div className="text-center p-2 bg-slate-800/50 rounded-lg">
              <div className="text-lg font-display text-white tabular-nums">
                {missions.length > 0 ? `${Math.round((strategicMetrics.completedMissions / missions.length) * 100)}%` : '—'}
              </div>
              <div className="text-[10px] text-slate-500 font-sans">Rate</div>
            </div>
          </div>
        </motion.section>

        {/* Performance Indicators */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-elevated p-4"
          aria-labelledby="performance-heading"
        >
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <h2 id="performance-heading" className="text-sm font-display tracking-wide text-white">Performance</h2>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400 font-sans">Protocol Compliance</span>
                <span className="text-xs font-mono text-white tabular-nums">{protocolCompliance}%</span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={protocolCompliance} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${protocolCompliance}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400 font-sans">Attribute Strength</span>
                <span className="text-xs font-mono text-white tabular-nums">{attributeStrength}%</span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={attributeStrength} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${attributeStrength}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400 font-sans">Skill Development</span>
                <span className="text-xs font-mono text-white tabular-nums">
                  {Math.round((skills.reduce((sum, s) => sum + s.level, 0) / (skills.length * 5)) * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round((skills.reduce((sum, s) => sum + s.level, 0) / (skills.length * 5)) * 100)} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((skills.reduce((sum, s) => sum + s.level, 0) / (skills.length * 5)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Knowledge & Economic Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-elevated p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookMarked className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
              <span className="text-[11px] font-display tracking-wide text-white">Knowledge</span>
            </div>
            <div className="text-lg font-display text-white tabular-nums">{intellectualMetrics.read}/{books.length}</div>
            <p className="text-[10px] text-slate-500 font-sans">books read</p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-elevated p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span className="text-[11px] font-display tracking-wide text-white">Revenue</span>
            </div>
            <div className="text-lg font-display text-emerald-400 tabular-nums">${strategicMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 font-sans">/month</p>
          </motion.article>
        </div>
      </div>

      {/* Timeline - Compact */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated p-4"
        aria-labelledby="timeline-heading"
      >
        <h2 id="timeline-heading" className="section-header mb-3 font-display tracking-wide">Mission Timeline</h2>

        <div className="flex gap-2 mb-3">
          {[
            { value: daysElapsed, label: 'Elapsed', color: 'text-white' },
            { value: 180 - daysElapsed, label: 'Remaining', color: 'text-amber-400' },
            { value: `${Math.round((daysElapsed / 180) * 100)}%`, label: 'Progress', color: 'text-emerald-400' },
          ].map((item) => (
            <div key={item.label} className="flex-1 text-center p-2 bg-slate-800/50 rounded-lg">
              <div className={`text-lg font-display ${item.color} leading-none tabular-nums`}>{item.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-sans">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round((daysElapsed / 180) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Mission timeline progress">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${(daysElapsed / 180) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.section>
    </div>
  )
}
