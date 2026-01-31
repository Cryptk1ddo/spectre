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
  X,
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
  { id: 'settings', label: 'Control Panel', icon: SettingsIcon },
]

const pageTitles: Record<string, string> = {
  dashboard: 'Mission Control',
  description: 'Program Briefing',
  missions: 'Mission Dossier',
  analytics: 'Analytics',
  achievements: 'Awards',
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
    <div className="min-h-screen min-h-dvh bg-slate-950 flex font-sans text-slate-200">
      {/* Desktop Sidebar - Enhanced */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800/50">
        {/* Logo - Enhanced with glow */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11">
              <motion.div
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 to-violet-400/20 flex items-center justify-center border border-emerald-500/20 holographic-glow"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                aria-hidden="true"
              />
              <img
                src="/icon-192.png"
                alt="SPECTRE icon"
                className="absolute -top-3 -right-3 w-14 h-14 rounded-xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              />
            </div>
            <div>
              <h1 className="text-xl font-display tracking-[0.05em] text-white">SPECTRE</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-sans">Operative OS</p>
            </div>
          </div>
        </div>

        {/* Navigation - Enhanced styling */}
        <nav className="flex-1 p-4 overflow-y-auto" aria-label="Main navigation">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold mb-3 px-3 font-sans">Navigation</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <li key={item.id}>
                  <motion.button
                    onClick={() => onNavigate(item.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98, backgroundColor: isActive ? 'rgba(0, 230, 155, 0.2)' : 'rgba(26, 26, 26, 0.5)' }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-sans transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 energy-border shadow-lg shadow-emerald-500/5' /* Uses new energy-border */
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} aria-hidden="true" />
                    <span>{pageTitles[item.id] || item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 rounded-full bg-emerald-500 holographic-glow"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer - Enhanced */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 energy-border">
            <div className="flex items-center gap-2 mb-2" aria-live="polite">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" aria-hidden="true" />
              <span className="text-[10px] text-emerald-500/80 font-semibold uppercase tracking-wider font-sans">Status: Active</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">v1.0.0 // OPERATIONAL PROTOCOL</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen min-h-dvh overflow-hidden">
        {/* Mobile Header - Minimal Swiss Design */}
        <motion.header 
          initial={{ y: 0 }}
          animate={{ y: scrollDirection === 'down' ? -56 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="lg:hidden sticky top-0 z-30 glass border-b border-slate-700/50 safe-area-pt"
        >
          <div className="flex items-center justify-between px-4 h-14 safe-area-px">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8">
                <motion.div 
                  className="w-8 h-8 rounded-lg bg-emerald-500/15 holographic-glow"
                  initial={{ opacity: 0.5, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                  aria-hidden="true"
                />
                <img src="/icon-192.png" alt="Spectre OS icon" className="absolute -top-1 -left-1 w-10 h-10 rounded-md object-cover shadow-sm" />
              </div>
              <h1 className="font-display font-semibold text-white text-base uppercase tracking-wider">{pageTitles[currentPage]}</h1>
            </div>
            <motion.button
              onClick={() => setMobileMenuOpen(true)}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 active:bg-slate-700 active:text-white transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          </div>
        </motion.header>

        {/* Page Content - Full width with proper spacing */}
        <div className="flex-1 overflow-auto scrollbar-hide scroll-smooth webkit-overflow-scrolling-touch">
          <div className="safe-area-px px-4 pt-4 pb-24 lg:pb-8 lg:px-6 lg:pt-6 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Bottom Tab Bar - iOS Style with Blur */}
        <nav 
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t border-slate-700/50 safe-area-pb" 
          aria-label="Quick navigation"
        >
          <ul className="flex items-center h-[var(--spacing-xl)] px-2 pb-1 pt-1 justify-around">
            {navItems.slice(0, 5).map((item) => { /* Displaying 5 items */
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <li key={item.id} className="flex-1">
                  <motion.button
                    onClick={() => {
                      onNavigate(item.id)
                      vibrate()
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={pageTitles[item.id] || item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className="w-full h-full flex flex-col items-center justify-center gap-1 py-1 touch-manipulation"
                  >
                    <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-emerald-500/10 energy-border' : 'bg-transparent'
                    }`}>
                      <Icon className={`w-6 h-6 transition-all duration-300 ${
                        isActive ? 'text-emerald-400 stroke-[2.5px]' : 'text-slate-500 stroke-2'
                      }`} aria-hidden="true" />
                    </div>
                    <span className={`text-[10px] font-medium transition-colors duration-300 ${
                      isActive ? 'text-emerald-400' : 'text-slate-500'
                    }`} aria-hidden="true">
                      {item.label}
                    </span>
                  </motion.button>
                </li>
              )
            })}
            
            {/* More Button */}
            <li className="flex-1">
              <motion.button
                onClick={() => {
                  setMobileMenuOpen(true)
                  vibrate()
                }}
                whileTap={{ scale: 0.9 }}
                aria-label="More menu"
                aria-expanded={mobileMenuOpen}
                className="w-full h-full flex flex-col items-center justify-center gap-1 py-1 touch-manipulation"
              >
                <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                  mobileMenuOpen ? 'bg-emerald-500/10 energy-border' : 'bg-transparent'
                }`}>
                  <Menu className={`w-6 h-6 transition-all duration-300 ${
                    mobileMenuOpen ? 'text-emerald-400 stroke-[2.5px]' : 'text-slate-500 stroke-2'
                  }`} aria-hidden="true" />
                </div>
                <span className={`text-[10px] font-medium transition-colors duration-300 ${
                  mobileMenuOpen ? 'text-emerald-400' : 'text-slate-500'
                }`} aria-hidden="true">
                  Menu
                </span>
              </motion.button>
            </li>
          </ul>
        </nav>
      </main>

      {/* Mobile Menu - Bottom Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  setMobileMenuOpen(false)
                }
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="lg:hidden fixed left-0 right-0 bottom-0 glass z-50 rounded-t-3xl overflow-hidden max-h-[85vh]"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-9 h-1 bg-slate-700 rounded-full" />
              </div>
              
              {/* Header */}
              <div className="flex justify-between items-center px-5 pb-4 safe-area-px">
                <h2 className="text-base font-semibold text-white">Navigation</h2>
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 active:bg-slate-700"
                  aria-label="Close navigation menu"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </div>
              
              {/* Navigation List */}
              <nav className="px-3 pb-8 safe-area-pb overflow-y-auto" aria-label="Full navigation">
                <div className="space-y-1" role="menu">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentPage === item.id
                    
                    return (
                      <motion.button
                        key={item.id}
                        role="menuitem"
                        onClick={() => {
                          onNavigate(item.id)
                          setMobileMenuOpen(false)
                        }}
                        whileTap={{ scale: 0.98 }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors ${
                          isActive
                            ? 'bg-emerald-500/15 energy-border'
                            : 'active:bg-slate-800'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-emerald-500/20' : 'bg-slate-800'
                        }`}>
                          <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className={`text-sm font-medium ${
                            isActive ? 'text-emerald-400' : 'text-white'
                          }`}>
                            {pageTitles[item.id] || item.label}
                          </span>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 holographic-glow" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
