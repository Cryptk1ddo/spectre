import { motion } from 'framer-motion'
import { Shield, Target, Zap, Award, BookOpen, BarChart3, ListChecks } from 'lucide-react'

export function ProgramDescription() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header section */}
      <section className="relative p-1 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-slate-800/50 to-cyan-500/20">
        <div className="p-8 rounded-2xl bg-slate-900/90 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center gap-6"
          >
            <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 font-mono">Project Spectre — Operative OS</h1>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                An elite Special Forces-inspired training operating system designed to transform an individual from 
                <span className="text-emerald-400 font-bold"> Zero to Elite Agent</span> across cognitive, physical, and tactical domains.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Modules */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: 'mod1',
            icon: Shield,
            title: 'Module 1: Induction',
            duration: 'Months 1-6',
            desc: 'Hardening the baseline shell. Establishing foundation, power surge, and final polish.',
            color: 'emerald'
          },
          {
            id: 'mod2',
            icon: Target,
            title: 'Module 2: Specialization',
            duration: 'Months 7-18',
            desc: 'Advanced Field Operations. Urban Tradecraft, Reconnaissance, or High-Threat Protection.',
            color: 'cyan'
          },
          {
            id: 'mod3',
            icon: Zap,
            title: 'Module 3: Elite Mastery',
            duration: 'Years 2+',
            desc: 'Continuous evolution, leadership of multi-discipline units, and asset management.',
            color: 'purple'
          }
        ].map((mod) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 border border-slate-800/50 hover:border-emerald-500/30 transition-colors"
          >
            <div className={`w-12 h-12 rounded-lg bg-${mod.color}-500/10 flex items-center justify-center mb-4 border border-${mod.color}-500/20`}>
              <mod.icon className={`w-6 h-6 text-${mod.color}-500`} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 font-mono">{mod.title}</h3>
            <p className="text-xs font-bold text-emerald-500 mb-3 uppercase tracking-wider">{mod.duration}</p>
            <p className="text-sm text-slate-400 leading-relaxed">{mod.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Core Features */}
      <section className="glass p-8 border border-slate-800/50">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-mono">
          <Zap className="w-5 h-5 text-emerald-500" />
          Core OS Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: ListChecks, title: 'Mission Control', desc: '6-month induction countdown and progressive phase tracking.' },
            { icon: ListChecks, title: 'Protocol Checklist', desc: 'Daily high-performance habits for physical and mental peak.' },
            { icon: BarChart3, title: 'Physical Vault', desc: 'Biometric logging and elite strength progression tracking.' },
            { icon: Award, title: 'Skill Matrix', desc: 'Visual proficiency tracking across tactical and technical domains.' },
            { icon: BookOpen, title: 'Intel Library', desc: 'Centralized repository for intelligence processing and reading.' }
          ].map((feat, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-slate-700">
                <feat.icon className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1 font-mono">{feat.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Training Protocols */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
          <Award className="w-5 h-5 text-emerald-500" />
          Elite Operative Protocols (Bourne & Bond Tier)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass p-6 border border-slate-800/50">
            <h3 className="text-emerald-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest font-mono">
              🔫 Tactical & Tradecraft
            </h3>
            <ul className="text-sm text-slate-400 space-y-3">
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Combat: BJJ (Blue Belt+) and Muay Thai</li>
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Entry: Lockpicking L1-L3 and Physical Auditing</li>
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> OSINT: Advanced investigative techniques</li>
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Medical: TCCC / Stop The Bleed certification</li>
            </ul>
          </div>
          <div className="glass p-6 border border-slate-800/50">
            <h3 className="text-emerald-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest font-mono">
              🏋️ Physical Dominance
            </h3>
            <ul className="text-sm text-slate-400 space-y-3">
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Strength: 2x BW Deadlift, 1.5x BW Bench</li>
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Endurance: 10km in &lt;45m</li>
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Conditioning: 20kg Ruck / 15km / 2.5h</li>
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Mobility: Full squat & overhead range</li>
            </ul>
          </div>
          <div className="glass p-6 border border-slate-800/50">
            <h3 className="text-emerald-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest font-mono">
              🕵️ Intellectual & Signals
            </h3>
            <ul className="text-sm text-slate-400 space-y-3">
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Languages: Bi-lingual proficiency (B2+)</li>
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Cryptography: PGP, AES-256, Secure Comms</li>
              <li className="flex gap-2"><span className="text-emerald-500">▹</span> Tech Mastery: Full-stack Design & Arch</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <footer className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
        <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-tighter mb-2 font-mono">Next Milestone: Tactical AI Integration</h4>
        <p className="text-xs text-slate-500">Dynamic threat assessment visualization and regional intel scraping in development.</p>
      </footer>
    </div>
  )
}
