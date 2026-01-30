import { useState, useEffect } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { ProgramDescription } from './components/ProgramDescription'
import { PhysicalVault } from './components/PhysicalVault'
import { OperativeAcademy } from './components/OperativeAcademy'
import { SovereigntyFramework } from './components/SovereigntyFramework'
import { IntelLibrary } from './components/IntelLibrary'
import { Missions } from './components/Missions'
import { Analytics } from './components/Analytics'
import { Achievements } from './components/Achievements'
import { Settings } from './components/Settings'
import { TacticalAI } from './components/TacticalAI'
import { useOperativeStore } from './store/useOperativeStore'
import './index.css'

type Page = 'dashboard' | 'description' | 'physical' | 'academy' | 'sovereignty' | 'intel' | 'missions' | 'analytics' | 'achievements' | 'settings' | 'tactical-ai'

function App() {
  const interfaceScale = useOperativeStore((state) => state.interfaceScale)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  // Apply interface scale on mount and when it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${interfaceScale * 16}px`
  }, [interfaceScale])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'description':
        return <ProgramDescription />
      case 'physical':
        return <PhysicalVault />
      case 'academy':
        return <OperativeAcademy />
      case 'sovereignty':
        return <SovereigntyFramework />
      case 'intel':
        return <IntelLibrary />
      case 'missions':
        return <Missions />
      case 'analytics':
        return <Analytics />
      case 'achievements':
        return <Achievements />
      case 'tactical-ai':
        return <TacticalAI />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as Page)}>
      {renderPage()}
    </Layout>
  )
}

export default App
