import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Swords,
  KeyRound,
  Languages,
  HeartPulse,
  Car,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  Eye,
  MessageCircle,
  Brain,
  AlertCircle,
} from 'lucide-react'
import { useOperativeStore } from '../store/useOperativeStore'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Swords,
  KeyRound,
  Languages,
  HeartPulse,
  Car,
  Eye,
  MessageCircle,
  Brain,
}

const levelLabels = [
  'Untrained',
  'Novice',
  'Competent',
  'Proficient',
  'Expert',
  'Master',
]

export function SkillMatrix() {
  const { skills, updateSkillLevel } = useOperativeStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const radarData = skills.map((skill) => ({
    skill: skill.name.substring(0, 10),
    level: skill.level,
    fullMark: 5,
  }))

  const overallLevel = skills.reduce((sum, s) => sum + s.level, 0)
  const maxLevel = skills.length * 5
  const overallPercent = (overallLevel / maxLevel) * 100

  const categories = [
    { id: 'combat', label: 'Combat', color: 'text-red-500' },
    { id: 'tradecraft', label: 'Tradecraft', color: 'text-amber-500' },
    { id: 'intel', label: 'Intel', color: 'text-blue-500' },
    { id: 'medical', label: 'Medical', color: 'text-emerald-500' },
    { id: 'driving', label: 'Driving', color: 'text-purple-500' },
    { id: 'psychology', label: 'Psychology', color: 'text-cyan-500' },
  ]

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-lg font-display text-emerald-400 tabular-nums">{overallLevel}</div>
          <span className="text-slate-500 text-sm font-sans">/ {maxLevel} pts</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono tabular-nums">{overallPercent.toFixed(0)}% proficiency</span>
      </div>

      {/* Radar Chart - Compact */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-elevated p-4"
        aria-label="Skill radar chart"
      >
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: '#71717a', fontSize: 9 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tick={{ fill: '#52525b', fontSize: 8 }}
                tickCount={6}
              />
              <Radar
                name="Level"
                dataKey="level"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={overallPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Overall skill proficiency">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallPercent}%` }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </motion.section>

      {/* Category Selector - Pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1" role="radiogroup" aria-label="Skill category filter">
        <button
          onClick={() => setSelectedCategory(null)}
          role="radio"
          aria-checked={selectedCategory === null}
          className={`tap-highlight px-3 py-1.5 rounded-full text-[11px] font-medium font-sans whitespace-nowrap transition-all ${
            selectedCategory === null
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-800/60 text-slate-500'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            role="radio"
            aria-checked={selectedCategory === cat.id}
            className={`tap-highlight px-3 py-1.5 rounded-full text-[11px] font-medium font-sans whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-slate-700 text-white'
                : 'bg-slate-800/60 text-slate-500'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skill Cards - Compact list */}
      <div className="space-y-2" role="list" aria-label="Skills">
        {skills
          .filter((skill) => selectedCategory === null || skill.category === selectedCategory)
          .map((skill, index) => {
            const Icon = iconMap[skill.icon] || Swords
            
            return (
              <motion.article
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="card-elevated p-3"
                role="listitem"
              >
                {/* Header Row */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Icon className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display tracking-wide text-white text-sm">{skill.name}</h3>
                      <span className="text-lg font-display text-white tabular-nums">{skill.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-sans">{levelLabels[skill.level]}</span>
                      <span className="text-[10px] text-slate-500 font-sans">/ 5</span>
                    </div>
                  </div>
                </div>

                {/* Level Indicator */}
                <div className="flex gap-0.5 mb-2" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={5} aria-label={`${skill.name} level`}>
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        level <= skill.level ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => updateSkillLevel(skill.id, skill.level - 1)}
                    disabled={skill.level === 0}
                    className="tap-highlight flex items-center gap-1 px-2.5 py-1 bg-slate-800 rounded-lg text-xs disabled:opacity-30"
                    aria-label={`Decrease ${skill.name} level`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  
                  <div className="flex items-center gap-1 text-[10px] text-slate-500" aria-hidden="true">
                    {skill.level === 0 ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3 text-emerald-500" />
                    )}
                  </div>
                  
                  <button
                    onClick={() => updateSkillLevel(skill.id, skill.level + 1)}
                    disabled={skill.level === 5}
                    className="tap-highlight flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 rounded-lg text-xs text-emerald-400 disabled:opacity-30"
                    aria-label={`Increase ${skill.name} level`}
                  >
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            )
          })}
      </div>

      {/* Info Box - Compact */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card-elevated p-3 border border-amber-500/20"
        role="note"
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-[11px] text-slate-400 font-sans">
              Progress from 0 (Untrained) to 5 (Master). Visit Academy for detailed milestones.
            </p>
          </div>
        </div>
      </motion.aside>
    </div>
  )
}
