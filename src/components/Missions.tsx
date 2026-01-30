import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  AlertCircle,
  Zap,
  Heart,
  Brain,
  Briefcase,
} from 'lucide-react'
import { useOperativeStore, type Mission } from '../store/useOperativeStore'

const domainConfig = {
  physical: {
    label: 'Physical',
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-500',
    bgLight: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  tactical: {
    label: 'Tactical',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  intellectual: {
    label: 'Intellectual',
    icon: Brain,
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  strategic: {
    label: 'Strategic',
    icon: Briefcase,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
}

const statusConfig = {
  active: { label: 'Active', color: 'text-white', bg: 'bg-slate-700' },
  completed: { label: 'Completed', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  failed: { label: 'Failed', color: 'text-red-500', bg: 'bg-red-500/10' },
}

export function Missions() {
  const { missions, updateMission, completeMission } = useOperativeStore()
  const [filterDomain, setFilterDomain] = useState<'all' | Mission['domain']>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | Mission['status']>('all')

  const filteredMissions = missions.filter((mission) => {
    if (filterDomain !== 'all' && mission.domain !== filterDomain) return false
    if (filterStatus !== 'all' && mission.status !== filterStatus) return false
    return true
  })

  const stats = {
    total: missions.length,
    active: missions.filter((m) => m.status === 'active').length,
    completed: missions.filter((m) => m.status === 'completed').length,
    failed: missions.filter((m) => m.status === 'failed').length,
  }

  const domainProgress = {
    physical: (() => {
      const domain = missions.filter((m) => m.domain === 'physical')
      return domain.length > 0 ? Math.round((domain.reduce((sum, m) => sum + m.progress / m.target, 0) / domain.length) * 100) : 0
    })(),
    tactical: (() => {
      const domain = missions.filter((m) => m.domain === 'tactical')
      return domain.length > 0 ? Math.round((domain.reduce((sum, m) => sum + m.progress / m.target, 0) / domain.length) * 100) : 0
    })(),
    intellectual: (() => {
      const domain = missions.filter((m) => m.domain === 'intellectual')
      return domain.length > 0 ? Math.round((domain.reduce((sum, m) => sum + m.progress / m.target, 0) / domain.length) * 100) : 0
    })(),
    strategic: (() => {
      const domain = missions.filter((m) => m.domain === 'strategic')
      return domain.length > 0 ? Math.round((domain.reduce((sum, m) => sum + m.progress / m.target, 0) / domain.length) * 100) : 0
    })(),
  }

  const overallProgress = missions.length > 0
    ? Math.round((missions.reduce((sum, m) => sum + m.progress / m.target, 0) / missions.length) * 100)
    : 0

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Overall Progress Card */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-elevated p-3 md:p-4"
        aria-labelledby="overall-progress-heading"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" aria-hidden="true" />
            <h2 id="overall-progress-heading" className="text-xs md:text-sm font-display tracking-wide text-white">Overall Progress</h2>
          </div>
          <span className="text-base md:text-lg font-display text-white tabular-nums">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={overallProgress} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.section>

      {/* Domain Cards - Horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4" role="group" aria-label="Domain progress">
        {(['physical', 'tactical', 'intellectual', 'strategic'] as const).map((domain) => {
          const config = domainConfig[domain]
          const Icon = config.icon
          const progress = domainProgress[domain]

          return (
            <motion.div
              key={domain}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-elevated min-w-[130px] p-3 tap-highlight"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-full ${config.bgLight} flex items-center justify-center`} aria-hidden="true">
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <span className="text-[11px] font-display tracking-wide text-white">{config.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${config.label} progress`}>
                  <motion.div
                    className={`h-full ${config.bg}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">{progress}%</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Filters - Pill style */}
      <div className="space-y-3">
        <div role="group" aria-labelledby="domain-filter-label">
          <p id="domain-filter-label" className="section-header mb-2 font-display tracking-wide">Domain</p>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-3 md:-mx-4 px-3 md:px-4 pb-1" role="radiogroup">
            {['all', 'physical', 'tactical', 'intellectual', 'strategic'].map((domain) => (
              <button
                key={domain}
                onClick={() => setFilterDomain(domain as any)}
                role="radio"
                aria-checked={filterDomain === domain}
                className={`tap-highlight px-2.5 md:px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-medium font-sans whitespace-nowrap transition-all ${
                  filterDomain === domain
                    ? `${domainConfig[domain as keyof typeof domainConfig]?.color || 'text-white'} bg-slate-700`
                    : 'bg-slate-800/60 text-slate-500'
                }`}
              >
                {domain === 'all' ? 'All' : domainConfig[domain as keyof typeof domainConfig]?.label}
              </button>
            ))}
          </div>
        </div>

        <div role="group" aria-labelledby="status-filter-label">
          <p id="status-filter-label" className="section-header mb-2 font-display tracking-wide">Status</p>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1" role="radiogroup">
            {['all', 'active', 'completed', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                role="radio"
                aria-checked={filterStatus === status}
                className={`tap-highlight px-3 py-1.5 rounded-full text-[11px] font-medium font-sans whitespace-nowrap transition-all ${
                  filterStatus === status
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800/60 text-slate-500'
                }`}
              >
                {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Cards */}
      <div className="space-y-2" role="list" aria-label="Missions">
        {filteredMissions.length === 0 ? (
          <div className="card-elevated text-center py-10">
            <Target className="w-10 h-10 text-slate-700 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm text-slate-500 font-sans">No missions match filters</p>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const domainCfg = domainConfig[mission.domain]
            const DomainIcon = domainCfg.icon
            const statusCfg = statusConfig[mission.status]
            const progressPercent = Math.min(100, (mission.progress / mission.target) * 100)

            return (
              <motion.article
                key={mission.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`glass p-4 rounded-lg border ${
                  mission.status === 'completed'
                    ? 'border-emerald-500/30'
                    : mission.status === 'failed'
                    ? 'border-red-500/30'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Domain Icon */}
                  <div className={`w-9 h-9 rounded-xl ${domainCfg.bgLight} flex items-center justify-center flex-shrink-0`} aria-hidden="true">
                    <DomainIcon className={`w-4 h-4 ${domainCfg.color}`} />
                  </div>

                  {/* Mission Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <h3 className="font-display tracking-wide text-white text-sm leading-tight">{mission.name}</h3>
                        <p className="text-[11px] text-slate-500 truncate font-sans">{mission.description}</p>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium font-sans ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`${mission.name} progress`}>
                        <motion.div
                          className={`h-full ${domainCfg.bg}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                        {mission.progress}/{mission.target}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-600 font-sans">
                        {new Date(mission.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-500 font-medium font-sans">{mission.reward}</span>
                        {mission.status === 'active' && (
                          <>
                            <button
                              onClick={() => updateMission(mission.id, { progress: Math.min(mission.target, mission.progress + 1) })}
                              className="tap-highlight w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center text-[11px] font-bold text-white"
                            >
                              +1
                            </button>
                            {progressPercent >= 100 && (
                              <button
                                onClick={() => completeMission(mission.id)}
                                className="tap-highlight w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center text-[11px] font-bold text-white"
                              >
                                ✓
                              </button>
                            )}
                          </>
                        )}
                        {mission.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
             )
           })
        )}
      </div>

      {/* Stats Summary - Compact horizontal */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        {[
          { label: 'Total', value: stats.total, icon: Target, color: 'text-white', bg: 'bg-slate-700' },
          { label: 'Active', value: stats.active, icon: Circle, color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { label: 'Done', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          { label: 'Failed', value: stats.failed, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card-elevated min-w-[80px] p-3 text-center">
              <div className={`w-7 h-7 rounded-full ${stat.bg} flex items-center justify-center mx-auto mb-1.5`}>
                <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
              <div className="text-lg font-bold text-white leading-none">{stat.value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
