import { motion } from 'framer-motion'
import {
  Trophy,
  Zap,
  Heart,
  Brain,
  Briefcase,
  Shield,
  Target,
  CheckCircle2,
  Star,
  Flame,
  Lock,
  Award as AwardIcon,
} from 'lucide-react'
import { useOperativeStore } from '../store/useOperativeStore'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  earned: boolean
  earnedDate?: string
}

export function Achievements() {
  const {
    lifts,
    skills,
    books,
    missions,
    operativeAttributes,
    dailyProtocols,
    legalFrameworks,
  } = useOperativeStore()

  // Calculate achievements
  const achievements: Badge[] = [
    // Physical Achievements
    {
      id: 'deadlift-start',
      name: 'Iron Will',
      description: 'Begin deadlift progression',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      earned: lifts.some((l) => l.name === 'Deadlift' && l.current > 0),
    },
    {
      id: 'physical-50',
      name: 'Half Strength',
      description: 'Reach 50% of all physical targets',
      icon: <Flame className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      earned: lifts.every((l) => l.current >= l.target * 0.5),
    },
    {
      id: 'physical-complete',
      name: 'Physical Mastery',
      description: 'Complete all physical targets',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      earned: lifts.every((l) => l.current >= l.target),
    },

    // Tactical Achievements
    {
      id: 'first-skill',
      name: 'First Blood',
      description: 'Level up your first skill',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500',
      earned: skills.some((s) => s.level > 0),
    },
    {
      id: 'skill-mastery',
      name: 'Specialist',
      description: 'Reach level 3 in any skill',
      icon: <Target className="w-6 h-6" />,
      color: 'from-amber-500 to-yellow-500',
      earned: skills.some((s) => s.level >= 3),
    },
    {
      id: 'blue-belt',
      name: 'BJJ Blue Belt',
      description: 'Achieve Blue Belt in Brazilian Jiu-Jitsu',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      earned: (skills.find((s) => s.name === 'Brazilian Jiu-Jitsu')?.level ?? 0) >= 2,
    },

    // Intellectual Achievements
    {
      id: 'first-book',
      name: 'Reader',
      description: 'Complete your first book',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-500',
      earned: books.some((b) => b.status === 'analysed'),
    },
    {
      id: 'five-books',
      name: 'Knowledge Seeker',
      description: 'Read 5 books',
      icon: <AwardIcon className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      earned: books.filter((b) => b.status === 'analysed').length >= 5,
    },
    {
      id: 'all-books',
      name: 'Polymath',
      description: 'Read all 39 books in the library',
      icon: <Star className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      earned: books.filter((b) => b.status === 'analysed').length === 39,
    },

    // Strategic Achievements
    {
      id: 'first-mission',
      name: 'Operative',
      description: 'Complete your first mission',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-emerald-500 to-green-600',
      earned: missions.some((m) => m.status === 'completed'),
    },
    {
      id: 'five-missions',
      name: 'Strategist',
      description: 'Complete 5 missions',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      earned: missions.filter((m) => m.status === 'completed').length >= 5,
    },
    {
      id: 'domain-mastery',
      name: 'Architect',
      description: 'Complete one mission in each domain',
      icon: <Lock className="w-6 h-6" />,
      color: 'from-emerald-500 to-cyan-500',
      earned: ['physical', 'tactical', 'intellectual', 'strategic'].every((domain) =>
        missions.some((m) => m.domain === domain && m.status === 'completed')
      ),
    },

    // Consistency Achievements
    {
      id: 'daily-protocol',
      name: 'Disciplined',
      description: 'Complete all daily protocols today',
      icon: <Flame className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500',
      earned: dailyProtocols.every((p) => p.completed),
    },
    {
      id: 'attribute-growth',
      name: 'Evolved',
      description: 'Reach 7+ strength in any operative attribute',
      icon: <Star className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-500',
      earned: operativeAttributes.some((a) => a.strength >= 7),
    },
    {
      id: 'sovereignty-start',
      name: 'Sovereign',
      description: 'Complete first legal framework',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-500',
      earned: legalFrameworks.some((f) => f.status === 'completed'),
    },
  ]

  const earnedCount = achievements.filter((a) => a.earned).length
  const totalCount = achievements.length
  const earnedPercent = Math.round((earnedCount / totalCount) * 100)

  // Group achievements by category
  const categories = {
    physical: achievements.filter((a) =>
      ['deadlift-start', 'physical-50', 'physical-complete'].includes(a.id)
    ),
    tactical: achievements.filter((a) =>
      ['first-skill', 'skill-mastery', 'blue-belt'].includes(a.id)
    ),
    intellectual: achievements.filter((a) =>
      ['first-book', 'five-books', 'all-books'].includes(a.id)
    ),
    strategic: achievements.filter((a) =>
      ['first-mission', 'five-missions', 'domain-mastery'].includes(a.id)
    ),
    personal: achievements.filter((a) =>
      ['daily-protocol', 'attribute-growth', 'sovereignty-start'].includes(a.id)
    ),
  }

  return (
    <div className="w-full space-y-4 pb-4">
      {/* Achievement Progress - Compact */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-4"
        aria-labelledby="achievement-progress-heading"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center" aria-hidden="true">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <h2 id="achievement-progress-heading" className="text-sm font-display tracking-wide text-white">Progress</h2>
          </div>
          <div className="text-right">
            <div className="text-xl font-display text-white leading-none tabular-nums">{earnedCount}/{totalCount}</div>
            <div className="text-[10px] text-slate-500 font-sans">{earnedPercent}% complete</div>
          </div>
        </div>

        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={earnedPercent} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${earnedPercent}%` }}
          />
        </div>
      </motion.section>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1" role="group" aria-label="Achievement categories">
        {Object.entries(categories).map(([category]) => {
          const categoryColors: Record<string, string> = {
            physical: 'text-red-400',
            tactical: 'text-amber-400',
            intellectual: 'text-blue-400',
            strategic: 'text-emerald-400',
            personal: 'text-purple-400',
          }
          const earnedInCat = categories[category as keyof typeof categories].filter(a => a.earned).length
          const totalInCat = categories[category as keyof typeof categories].length
          
          return (
            <div
              key={category}
              className="tap-highlight px-3 py-1.5 rounded-full bg-slate-800/60 text-[11px] font-medium font-sans whitespace-nowrap"
            >
              <span className={categoryColors[category]}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              <span className="text-slate-500 ml-1 tabular-nums">{earnedInCat}/{totalInCat}</span>
            </div>
          )
        })}
      </div>

      {/* Achievements by Category */}
      <div className="space-y-4" role="list">
      {Object.entries(categories).map(([category, categoryAchievements]) => {
        const categoryLabels = {
          physical: 'Physical',
          tactical: 'Tactical',
          intellectual: 'Intellectual',
          strategic: 'Strategic',
          personal: 'Growth',
        }

        const categoryColors = {
          physical: 'text-red-400',
          tactical: 'text-amber-400',
          intellectual: 'text-blue-400',
          strategic: 'text-emerald-400',
          personal: 'text-purple-400',
        }

        return (
          <section key={category} className="space-y-2" role="listitem">
            <h3 className={`section-header font-display tracking-wide ${categoryColors[category as keyof typeof categoryColors]}`}>
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>

            <div className="space-y-2">
              {categoryAchievements.map((achievement, index) => (
                <motion.article
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`card-elevated p-3 ${
                    achievement.earned
                      ? `bg-gradient-to-r ${achievement.color}`
                      : 'opacity-50'
                  }`}
                  aria-label={`${achievement.name}: ${achievement.earned ? 'Earned' : 'Locked'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      achievement.earned ? 'bg-white/20' : 'bg-slate-700/50'
                    }`} aria-hidden="true">
                      <div className={achievement.earned ? 'text-white' : 'text-slate-500'}>
                        {achievement.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-display tracking-wide text-sm ${achievement.earned ? 'text-white' : 'text-slate-400'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-[11px] font-sans ${achievement.earned ? 'text-white/70' : 'text-slate-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" aria-label="Earned" />
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )
      })}
      </div>

      {/* Next Milestones - Horizontal scroll */}
      <section aria-labelledby="next-milestones-heading">
        <h2 id="next-milestones-heading" className="section-header mb-2 font-display tracking-wide">Next Milestones</h2>
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2" role="list">
          {achievements
            .filter((a) => !a.earned)
            .slice(0, 4)
            .map((achievement) => (
              <motion.article
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-elevated min-w-[140px] p-3 tap-highlight"
                role="listitem"
              >
                <div className="text-slate-600 mb-2" aria-hidden="true">{achievement.icon}</div>
                <h3 className="font-display tracking-wide text-xs text-white mb-0.5 line-clamp-1">{achievement.name}</h3>
                <p className="text-[10px] text-slate-500 font-sans line-clamp-2">{achievement.description}</p>
              </motion.article>
            ))}
        </div>
      </section>
    </div>
  )
}
