import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Award,
} from 'lucide-react'
import { useOperativeStore } from '../store/useOperativeStore'

const categories = [
  { id: 'combat', label: 'Combat', color: 'text-red-500', bg: 'bg-red-500' },
  { id: 'tradecraft', label: 'Tradecraft', color: 'text-amber-500', bg: 'bg-amber-500' },
  { id: 'intel', label: 'Intel', color: 'text-blue-500', bg: 'bg-blue-500' },
  { id: 'medical', label: 'Medical', color: 'text-emerald-500', bg: 'bg-emerald-500' },
  { id: 'driving', label: 'Driving', color: 'text-purple-500', bg: 'bg-purple-500' },
  { id: 'psychology', label: 'Psychology', color: 'text-cyan-500', bg: 'bg-cyan-500' },
]

const progressionPaths: Record<string, { level: number; milestone: string; details: string }[]> = {
  'bjj': [
    { level: 0, milestone: 'White Belt (Fundamentals)', details: 'Learn basic positions, escapes, and safety' },
    { level: 1, milestone: 'Early White Belt', details: 'Foundational techniques, basic transitions' },
    { level: 2, milestone: 'White Belt Progressing', details: 'Build consistency, understand positioning' },
    { level: 3, milestone: 'Blue Belt (Competent)', details: 'Control larger opponents, solid fundamentals' },
    { level: 4, milestone: 'Blue Belt Advanced', details: 'Advanced techniques, competition ready' },
    { level: 5, milestone: 'Purple Belt+ (Expert)', details: 'Teaching ability, advanced problem-solving' },
  ],
  'muay-thai': [
    { level: 0, milestone: 'No Training', details: 'Begin foundational striking mechanics' },
    { level: 1, milestone: 'Beginner', details: 'Basic stance, guard, footwork' },
    { level: 2, milestone: 'Fundamental Strikes', details: 'Jab, cross, hook, kick mechanics' },
    { level: 3, milestone: 'Intermediate', details: 'Combinations, timing, distance management' },
    { level: 4, milestone: 'Proficient', details: 'Sparring capability, defensive transitions' },
    { level: 5, milestone: 'Advanced Fighter', details: 'Competition level, multiple opponents' },
  ],
  'lockpicking': [
    { level: 0, milestone: 'No Knowledge', details: 'Understand basic lock types (pin, wafer, etc)' },
    { level: 1, milestone: 'Beginner', details: 'Know parts: pins, springs, plug, bible' },
    { level: 2, milestone: 'Basic Picking', details: 'Single pin picking on simple locks' },
    { level: 3, milestone: 'Proficient', details: '<60 seconds on standard 5-pin tumbler' },
    { level: 4, milestone: 'Advanced', details: 'Defeat security pins, various lock types' },
    { level: 5, milestone: 'Master', details: 'Rapid entry on most locks, door/safe knowledge' },
  ],
  'performance-driving': [
    { level: 0, milestone: 'Standard License', details: 'Legal basic driving competency' },
    { level: 1, milestone: 'Defensive Driving', details: 'Hazard awareness, safe distance, reaction' },
    { level: 2, milestone: 'Performance Basics', details: 'Understand understeer/oversteer, braking zones' },
    { level: 3, milestone: 'Track Ready', details: 'Threshold braking, late apex, smooth inputs' },
    { level: 4, milestone: 'Advanced Control', details: 'J-turns, evasion maneuvers, pursuit basics' },
    { level: 5, milestone: 'Specialist', details: 'Extreme condition driving, high-speed tactics' },
  ],
  'osint': [
    { level: 0, milestone: 'No Knowledge', details: 'Understand what OSINT is (Open Source Intel) - Start with TryHackMe Roadmap' },
    { level: 1, milestone: 'Beginner', details: 'Basic Google dorking, social media searches - TryHackMe fundamentals' },
    { level: 2, milestone: 'Intermediate', details: 'Email finding, username tracking, basics - Complete TryHackMe paths' },
    { level: 3, milestone: 'Proficient', details: 'Full digital footprint mapping from single identifier' },
    { level: 4, milestone: 'Advanced', details: 'Deep web techniques, metadata analysis' },
    { level: 5, milestone: 'Master', details: 'Complete profile reconstruction from minimal data' },
  ],
  'tccc': [
    { level: 0, milestone: 'No Training', details: 'Understand trauma care principles' },
    { level: 1, milestone: 'First Aid', details: 'CPR basics, bandaging, shock management' },
    { level: 2, milestone: 'Intermediate', details: 'Tourniquet application, wound types' },
    { level: 3, milestone: 'TCCC Certified', details: 'Tourniquet proficiency, hemorrhage control' },
    { level: 4, milestone: 'Advanced TCCC', details: 'Chest seals, airway management' },
    { level: 5, milestone: 'Field Medic', details: 'Combat casualty care, triage, advanced protocols' },
  ],
}

export function OperativeAcademy() {
  const { skills, updateSkillLevel } = useOperativeStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('combat')
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)

  const filteredSkills = skills.filter((skill) => skill.category === selectedCategory)
  const totalPoints = skills.reduce((sum, s) => sum + s.level, 0)
  const maxPoints = skills.length * 5

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-display text-emerald-400 tabular-nums">{totalPoints}</span>
          <span className="text-slate-500 text-sm font-sans">/ {maxPoints} pts</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono tabular-nums">{((totalPoints / maxPoints) * 100).toFixed(0)}% mastery</span>
      </div>

      {/* Overall Progress - Compact */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-3"
        aria-label="Overall skill mastery"
      >
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={(totalPoints / maxPoints) * 100} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalPoints / maxPoints) * 100}%` }}
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
          />
        </div>
      </motion.section>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1" role="radiogroup" aria-label="Skill category">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            role="radio"
            aria-checked={selectedCategory === cat.id}
            className={`tap-highlight px-3 py-1.5 rounded-full text-[11px] font-medium font-sans whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? `${cat.color} bg-slate-700`
                : 'bg-slate-800/60 text-slate-500'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills in Category */}
      <div className="space-y-2.5" role="list" aria-label={`${selectedCategory} skills`}>
        {filteredSkills.map((skill) => {
          const path = progressionPaths[skill.id] || progressionPaths['bjj']
          const currentMilestone = path[skill.level] || path[0]

          return (
            <motion.article
              key={skill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-4"
              role="listitem"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display tracking-wide text-white text-sm">{skill.name}</h3>
                  <p className="text-[11px] text-emerald-400 font-sans">{currentMilestone.milestone}</p>
                </div>
                <span className="text-2xl font-display text-emerald-400 tabular-nums">{skill.level}</span>
              </div>

              {/* Current Level Description */}
              <p className="text-[11px] text-slate-500 mb-3 font-sans">{currentMilestone.details}</p>

              {/* Level Progression - Tappable */}
              <div className="mb-3">
                <div className="flex gap-0.5 mb-1" role="group" aria-label={`${skill.name} level selector`}>
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateSkillLevel(skill.id, level)}
                      aria-label={`Set ${skill.name} to level ${level}`}
                      aria-pressed={skill.level === level}
                      className={`tap-highlight flex-1 h-2 rounded-full transition-all ${
                        level <= skill.level ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Progression Path Toggle */}
              <button
                onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
                className="tap-highlight flex items-center gap-1.5 text-[11px] text-slate-400"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View path</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSkill === skill.id ? 'rotate-180' : ''}`} />
              </button>

              {/* Expanded Path */}
              <AnimatePresence>
                {expandedSkill === skill.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-slate-700/50"
                  >
                    <div className="space-y-1.5">
                      {path.map((milestone, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg ${
                            idx <= skill.level
                              ? 'bg-emerald-500/10 border border-emerald-500/20'
                              : 'bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                idx <= skill.level ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                              }`}
                            >
                              {idx}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-white text-xs">{milestone.milestone}</div>
                              <div className="text-[10px] text-slate-500">{milestone.details}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
