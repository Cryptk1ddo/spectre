import { motion } from 'framer-motion'
import {
  FileText,
  Briefcase,
  Shield,
  Zap,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { useOperativeStore } from '../store/useOperativeStore'

const priorityColors = {
  high: { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500' },
  medium: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
  low: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
}

const statusConfig = {
  'not-started': { icon: Circle, label: 'Not Started', color: 'text-slate-500' },
  'in-progress': { icon: Zap, label: 'In Progress', color: 'text-amber-500' },
  'completed': { icon: CheckCircle2, label: 'Completed', color: 'text-emerald-500' },
}

export function SovereigntyFramework() {
  const { legalFrameworks, economicEngines, mentalFrameworks, operativeAttributes, updateLegalFramework, toggleMentalFramework, updateOperativeAttribute } = useOperativeStore()

  const legalProgress = legalFrameworks.filter((fw) => fw.status === 'completed').length
  const economicMonthly = economicEngines.reduce((sum, e) => sum + e.monthlyRevenue, 0)
  const mentalMastered = mentalFrameworks.filter((fw) => fw.mastered).length

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Summary Stats - Horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2\" role="group" aria-label="Sovereignty statistics">
        <div className="card-elevated min-w-[90px] p-3 text-center">
          <div className="text-lg font-display text-emerald-400 tabular-nums">{legalProgress}/{legalFrameworks.length}</div>
          <div className="text-[10px] text-slate-500 font-sans">Legal</div>
        </div>
        <div className="card-elevated min-w-[100px] p-3 text-center">
          <div className="text-lg font-display text-blue-400 tabular-nums">${economicMonthly}</div>
          <div className="text-[10px] text-slate-500 font-sans">/month</div>
        </div>
        <div className="card-elevated min-w-[90px] p-3 text-center">
          <div className="text-lg font-display text-purple-400 tabular-nums">{mentalMastered}/{mentalFrameworks.length}</div>
          <div className="text-[10px] text-slate-500 font-sans">Mental</div>
        </div>
        <div className="card-elevated min-w-[90px] p-3 text-center">
          <div className="text-lg font-display text-cyan-400 tabular-nums">{(operativeAttributes.reduce((sum, a) => sum + a.strength, 0) / (operativeAttributes.length * 10) * 100).toFixed(0)}%</div>
          <div className="text-[10px] text-slate-500 font-sans">Strength</div>
        </div>
      </div>

      {/* I. The Paper Trail */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-4"
        aria-labelledby="paper-trail-heading"
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-blue-500" aria-hidden="true" />
          <h2 id="paper-trail-heading" className="text-sm font-display tracking-wide text-white">Paper Trail</h2>
          <span className="ml-auto text-[10px] text-slate-500 font-sans">Global Mobility</span>
        </div>

        <div className="space-y-2" role="list">
          {legalFrameworks.map((fw) => {
            const config = statusConfig[fw.status]
            const StatusIcon = config.icon
            const priorityConfig = priorityColors[fw.priority]

            return (
              <div
                key={fw.id}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/50"
                role="listitem"
              >
                <button
                  onClick={() => updateLegalFramework(fw.id, fw.status === 'completed' ? 'not-started' : fw.status === 'not-started' ? 'in-progress' : 'completed')}
                  className={`tap-highlight flex-shrink-0 ${config.color}`}
                  aria-label={`Toggle ${fw.name} status: currently ${config.label}`}
                >
                  <StatusIcon className="w-4 h-4" aria-hidden="true" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display tracking-wide text-white text-xs">{fw.name}</h3>
                  <p className="text-[10px] text-slate-500 truncate font-sans">{fw.description}</p>
                </div>
                <span className={`text-[10px] font-medium font-sans ${priorityConfig.text}`}>{fw.priority}</span>
              </div>
            )
          })}
        </div>
      </motion.section>

      {/* II. Economic Engines */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-elevated p-4"
        aria-labelledby="economic-engines-heading"
      >
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          <h2 id="economic-engines-heading" className="text-sm font-display tracking-wide text-white">Economic Engines</h2>
          <span className="ml-auto text-[10px] text-slate-500 font-sans">Cash Flow</span>
        </div>

        <div className="space-y-2" role="list">
          {economicEngines.map((engine) => {
            const statusColors = {
              idea: 'bg-slate-700 text-slate-400',
              building: 'bg-amber-500/20 text-amber-400',
              operational: 'bg-emerald-500/20 text-emerald-400',
              scaling: 'bg-blue-500/20 text-blue-400',
            }

            return (
              <div
                key={engine.id}
                className="p-2.5 rounded-lg bg-slate-800/50"
                role="listitem"
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-display tracking-wide text-white text-xs">{engine.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium font-sans ${statusColors[engine.status]}`}>
                    {engine.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mb-1.5 font-sans">{engine.description}</p>
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-3 h-3" aria-hidden="true" />
                  <span className="text-[11px] font-mono tabular-nums">${engine.monthlyRevenue}/mo</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.section>

      {/* III. Mental Frameworks */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-4"
        aria-labelledby="mental-frameworks-heading"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-purple-500" aria-hidden="true" />
          <h2 id="mental-frameworks-heading" className="text-sm font-display tracking-wide text-white">Mental Frameworks</h2>
          <span className="ml-auto text-[10px] text-slate-500 font-sans">Decision Algorithms</span>
        </div>

        <div className="space-y-1.5" role="list">
          {mentalFrameworks.map((fw) => {
            const difficultyColors = {
              beginner: 'text-green-400',
              intermediate: 'text-amber-400',
              advanced: 'text-red-400',
            }

            return (
              <button
                key={fw.id}
                onClick={() => toggleMentalFramework(fw.id)}
                className={`tap-highlight w-full p-2.5 rounded-lg text-left transition-all ${
                  fw.mastered ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-800/50'
                }`}
                role="listitem"
                aria-pressed={fw.mastered}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display tracking-wide text-white text-xs">{fw.name}</h3>
                      <span className={`text-[10px] font-sans ${difficultyColors[fw.difficulty]}`}>{fw.difficulty}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate font-sans">{fw.application}</p>
                  </div>
                  {fw.mastered && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-label="Mastered" />}
                </div>
              </button>
            )
          })}
        </div>
      </motion.section>

      {/* IV. Operative Attributes */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated p-4"
        aria-labelledby="operative-attributes-heading"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-cyan-500" aria-hidden="true" />
          <h2 id="operative-attributes-heading" className="text-sm font-display tracking-wide text-white">Operative Attributes</h2>
          <span className="ml-auto text-[10px] text-slate-500 font-sans">Intangibles</span>
        </div>

        <div className="space-y-2.5" role="list">
          {operativeAttributes.map((attr) => (
            <div key={attr.id} className="p-2.5 rounded-lg bg-slate-800/50" role="listitem">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-display tracking-wide text-white text-xs">{attr.name}</h3>
                <span className="text-sm font-display text-cyan-400 tabular-nums">{attr.strength}/10</span>
              </div>
              <div className="flex gap-0.5" role="group" aria-label={`${attr.name} strength selector`}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateOperativeAttribute(attr.id, level)}
                    aria-label={`Set ${attr.name} to ${level}`}
                    aria-pressed={attr.strength === level}
                    className={`tap-highlight flex-1 h-1.5 rounded-full transition-all ${
                      level <= attr.strength ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Sovereignty Status - Compact */}
      <motion.aside
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated p-3 border border-emerald-500/20"
        role="note"
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11px] text-slate-400 font-sans">
            Complete legal frameworks first. Build economic engines in parallel. Master mental frameworks to survive pressure.
          </p>
        </div>
      </motion.aside>
    </div>
  )
}
