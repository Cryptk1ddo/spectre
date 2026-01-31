import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Dumbbell,
  Target,
  BookOpen,
  Menu,
  TrendingUp,
  Lock,
  Award,
  Trophy,
  Settings as SettingsIcon,
  Sparkles,
  Info,
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'description', label: 'Briefing', icon: Info },
  { id: 'missions', label: 'Missions', icon: Target },
  { id: 'physical', label: 'Physical', icon: Dumbbell },
  { id: 'tactical-ai', label: 'AI Handler', icon: Sparkles },
  { id: 'analytics', label: 'Stats', icon: TrendingUp },
  { id: 'achievements', label: 'Awards', icon: Trophy },
  { id: 'academy', label: 'Academy', icon: Award },
  { id: 'sovereignty', label: 'Sovereignty', icon: Lock },
  { id: 'intel', label: 'Intel', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

const pageTitles: Record<string, string> = {
  dashboard: 'Mission Control',
  description: 'Program Briefing',
  missions: 'Mission Dossier',
  analytics: 'Analytics',
  achievements: 'Achievements',
  physical: 'Physical Vault',
  academy: 'Operative Academy',
  sovereignty: 'Sovereignty',
  settings: 'Control Panel',
  intel: 'Intel Library',
  'tactical-ai': 'Tactical AI Hub',
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [lastScrollY, setLastScrollY] = useState(0)

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(5)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY > lastScrollY && scrollY > 100) {
        setScrollDirection('down')
      } else if (scrollY < lastScrollY) {
        setScrollDirection('up')
      }
      setLastScrollY(scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div className="min-h-screen min-h-dvh bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-widest">SPECTRE</h1>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {pageTitles[item.id] || item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen min-h-dvh overflow-hidden">
        {/* Mobile Header */}
        <motion.header 
          animate={{ y: scrollDirection === 'down' ? -60 : 0 }}
          className="lg:hidden sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 safe-area-pt h-14 flex items-center justify-between px-4"
        >
          <h1 className="font-bold text-white text-sm tracking-widest uppercase">{pageTitles[currentPage]}</h1>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-400"><Menu className="w-5 h-5" /></button>
        </motion.header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 safe-area-pb">
          <div className="p-4 lg:p-8 max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur-2xl border-t border-slate-800/50 pb-safe">
          <ul className="flex justify-around items-center h-16">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { onNavigate(item.id); vibrate(); }}
                    className={`flex flex-col items-center gap-1 p-2 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                  </button>
                </li>
              )
            })}
            <li>
              <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center gap-1 p-2 text-slate-500">
                <Menu className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">More</span>
              </button>
            </li>
          </ul>
        </nav>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-slate-900 rounded-t-3xl p-6 pb-12 max-h-[80vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" />
              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 p-4 bg-slate-800 rounded-2xl text-left"
                  >
                    <item.icon className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white uppercase tracking-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
