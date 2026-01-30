import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dumbbell,
  Target,
  TrendingUp,
  User,
  Ruler,
  Scale,
  Edit3,
  Check,
  X,
} from 'lucide-react'
import { useOperativeStore } from '../store/useOperativeStore'

export function PhysicalVault() {
  const { height, weight, waistSize, lifts, updateHeight, updateWeight, updateWaistSize, updateLift } = useOperativeStore()
  
  const [editingLift, setEditingLift] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [editingStats, setEditingStats] = useState(false)
  const [statValues, setStatValues] = useState({ height, weight, waistSize })

  const handleLiftEdit = (liftName: string, currentValue: number) => {
    setEditingLift(liftName)
    setEditValue(currentValue.toString())
  }

  const handleLiftSave = (liftName: string) => {
    const value = parseFloat(editValue)
    if (!isNaN(value) && value >= 0) {
      updateLift(liftName, value)
    }
    setEditingLift(null)
  }

  const handleStatsSave = () => {
    updateHeight(statValues.height)
    updateWeight(statValues.weight)
    updateWaistSize(statValues.waistSize)
    setEditingStats(false)
  }

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Live Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          <span className="text-[11px] text-red-400 uppercase tracking-widest font-display" aria-live="polite">Live</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium font-sans">Classified Biometric Data</span>
      </div>

      {/* Biometric Stats - Horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2" role="group" aria-label="Biometric stats">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-elevated min-w-[110px] p-3"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2" aria-hidden="true">
            <User className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-[10px] text-slate-500 uppercase font-sans">Codename</div>
          <div className="text-sm font-display tracking-wide text-white">OPERATIVE</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="card-elevated min-w-[100px] p-3 tap-highlight"
          onClick={() => !editingStats && setEditingStats(true)}
          role="button"
          aria-label={editingStats ? 'Editing height' : `Height: ${height} cm. Click to edit`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-2" aria-hidden="true">
            <Ruler className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-[10px] text-slate-500 uppercase font-sans">Height</div>
          {editingStats ? (
            <div className="flex items-center gap-1 mt-1">
              <label className="sr-only" htmlFor="height-input">Height in cm</label>
              <input
                id="height-input"
                type="number"
                value={statValues.height}
                onChange={(e) => setStatValues({ ...statValues, height: parseFloat(e.target.value) || 0 })}
                className="w-12 px-1 py-0.5 bg-slate-800 border border-slate-600 rounded text-white text-xs font-mono"
              />
            </div>
          ) : (
            <div className="text-sm font-display text-white">{height} <span className="text-xs font-sans">cm</span></div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-elevated min-w-[100px] p-3 tap-highlight"
          onClick={() => !editingStats && setEditingStats(true)}
          role="button"
          aria-label={editingStats ? 'Editing weight' : `Weight: ${weight} kg. Click to edit`}
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mb-2" aria-hidden="true">
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-[10px] text-slate-500 uppercase font-sans">Weight</div>
          {editingStats ? (
            <div className="flex items-center gap-1 mt-1">
              <label className="sr-only" htmlFor="weight-input">Weight in kg</label>
              <input
                id="weight-input"
                type="number"
                value={statValues.weight}
                onChange={(e) => setStatValues({ ...statValues, weight: parseFloat(e.target.value) || 0 })}
                className="w-12 px-1 py-0.5 bg-slate-800 border border-slate-600 rounded text-white text-xs font-mono"
                autoFocus
              />
              <button onClick={handleStatsSave} className="p-0.5 text-emerald-500" aria-label="Save weight">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="text-sm font-display text-white">{weight} <span className="text-xs font-sans">kg</span></div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="card-elevated min-w-[100px] p-3 tap-highlight"
          onClick={() => !editingStats && setEditingStats(true)}
          role="button"
          aria-label={editingStats ? 'Editing waist size' : `Waist: ${waistSize} cm. Click to edit`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-2" aria-hidden="true">
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-[10px] text-slate-500 uppercase font-sans">Waist</div>
          {editingStats ? (
            <div className="flex items-center gap-1 mt-1">
              <label className="sr-only" htmlFor="waist-input">Waist size in cm</label>
              <input
                id="waist-input"
                type="number"
                value={statValues.waistSize}
                onChange={(e) => setStatValues({ ...statValues, waistSize: parseFloat(e.target.value) || 0 })}
                className="w-12 px-1 py-0.5 bg-slate-800 border border-slate-600 rounded text-white text-xs font-mono"
              />
              <button onClick={() => setEditingStats(false)} className="p-0.5 text-slate-500" aria-label="Cancel editing">
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="text-sm font-display text-white">{waistSize} <span className="text-xs font-sans">cm</span></div>
          )}
        </motion.div>
      </div>

      {/* Main Lifts */}
      <section className="space-y-3" aria-labelledby="lift-metrics-heading">
        <h2 id="lift-metrics-heading" className="section-header font-display tracking-wide">Primary Lift Metrics</h2>

        <div className="space-y-2.5">
          {lifts.map((lift, index) => {
            const progress = (lift.current / lift.target) * 100
            const remaining = lift.target - lift.current
            
            return (
              <motion.div
                key={lift.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-elevated p-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                    <h3 className="text-sm font-display tracking-wide text-white">{lift.name}</h3>
                  </div>
                  {editingLift === lift.name ? (
                    <div className="flex items-center gap-1">
                      <label className="sr-only" htmlFor={`lift-${lift.name}`}>Current {lift.name} weight</label>
                      <input
                        id={`lift-${lift.name}`}
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLiftSave(lift.name)}
                        className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs text-center font-mono"
                        autoFocus
                        step="2.5"
                      />
                      <button onClick={() => handleLiftSave(lift.name)} className="tap-highlight p-1 text-emerald-500" aria-label={`Save ${lift.name}`}>
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button onClick={() => setEditingLift(null)} className="tap-highlight p-1 text-slate-500" aria-label="Cancel">
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleLiftEdit(lift.name, lift.current)}
                      className="tap-highlight flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-lg text-slate-400"
                      aria-label={`Edit ${lift.name}`}
                    >
                      <Edit3 className="w-3 h-3" aria-hidden="true" />
                      <span className="text-[10px] font-sans">Edit</span>
                    </button>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-baseline gap-3 mb-3">
                  <div>
                    <span className="text-2xl font-display text-emerald-400 tabular-nums">{lift.current}</span>
                    <span className="text-slate-500 text-xs ml-1 font-sans">{lift.unit}</span>
                  </div>
                  <span className="text-slate-600" aria-hidden="true">/</span>
                  <div>
                    <span className="text-lg text-slate-400 font-display tabular-nums">{lift.target}</span>
                    <span className="text-slate-600 text-xs ml-1 font-sans">{lift.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 ml-auto font-sans">
                    <TrendingUp className="w-3 h-3" aria-hidden="true" />
                    <span>+{remaining.toFixed(1)} to go</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.min(100, progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`${lift.name} progress`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, progress)}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                    />
                  </div>
                  <span className="absolute right-0 -top-5 text-[11px] font-mono text-emerald-400 tabular-nums">
                    {progress.toFixed(0)}%
                  </span>
                </div>

                {/* Achievement Badge */}
                {progress >= 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 flex items-center gap-1.5 text-emerald-400"
                  >
                    <Target className="w-4 h-4" aria-hidden="true" />
                    <span className="text-[10px] font-display uppercase tracking-wider">Target Achieved</span>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Quick Reference - Horizontal scroll */}
      <section aria-labelledby="training-protocol-heading">
        <h2 id="training-protocol-heading" className="section-header mb-2 font-display tracking-wide">Training Protocol</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2" role="list">
          {[
            { lift: 'Deadlift', target: '1.75× BW', value: '122.5kg' },
            { lift: 'OHP', target: '0.75× BW', value: '52.5kg' },
            { lift: 'Pull-up', target: '+BW', value: '+17.5kg' },
          ].map((item) => (
            <div key={item.lift} className="card-elevated min-w-[120px] p-3" role="listitem">
              <div className="text-xs font-display text-emerald-400 mb-1">{item.lift}</div>
              <div className="text-lg font-display text-white tabular-nums">{item.value}</div>
              <div className="text-[10px] text-slate-500 font-sans">{item.target}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
