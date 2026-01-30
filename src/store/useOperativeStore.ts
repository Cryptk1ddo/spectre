import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Lift {
  name: string
  current: number
  target: number
  unit: string
}

export interface Skill {
  id: string
  name: string
  level: number // 0-5
  icon: string
  category: 'combat' | 'tradecraft' | 'intel' | 'medical' | 'driving' | 'psychology'
  benchmark?: string
}

export interface DailyProtocol {
  id: string
  name: string
  completed: boolean
}

export interface Book {
  id: string
  title: string
  author: string
  status: 'to-read' | 'reading' | 'analysed'
  url?: string
}

export interface LegalFramework {
  id: string
  name: string
  status: 'not-started' | 'in-progress' | 'completed'
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface EconomicEngine {
  id: string
  name: string
  type: 'consulting' | 'saas' | 'content' | 'asset'
  status: 'idea' | 'building' | 'operational' | 'scaling'
  monthlyRevenue: number
  description: string
}

export interface MentalFramework {
  id: string
  name: string
  description: string
  application: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  mastered: boolean
}

export interface OperativeAttribute {
  id: string
  name: string
  description: string
  strength: number // 1-10
  icon: string
}

export interface Mission {
  id: string
  name: string
  description: string
  domain: 'physical' | 'tactical' | 'intellectual' | 'strategic'
  status: 'active' | 'completed' | 'failed'
  target: number
  progress: number
  dueDate: string
  reward: string
}

export interface OperativeState {
  // User Stats
  height: number
  weight: number
  waistSize: number
  startDate: string
  interfaceScale: number
  geminiApiKey?: string
  openaiApiKey?: string
  anthropicApiKey?: string
  selectedAiProvider: 'gemini' | 'openai' | 'anthropic'
  
  // Physical
  lifts: Lift[]
  
  // Skills
  skills: Skill[]
  
  // Daily Protocols
  dailyProtocols: DailyProtocol[]
  lastResetDate: string
  
  // Intel Library
  books: Book[]
  
  // Infrastructure (Papers & Legal)
  legalFrameworks: LegalFramework[]
  
  // Economic Engines
  economicEngines: EconomicEngine[]
  
  // Mental Frameworks
  mentalFrameworks: MentalFramework[]
  
  // Operative Attributes
  operativeAttributes: OperativeAttribute[]
  
  // Missions & Goals
  missions: Mission[]
  
  // Actions
  updateHeight: (height: number) => void
  updateWeight: (weight: number) => void
  updateWaistSize: (size: number) => void
  updateInterfaceScale: (scale: number) => void
  updateGeminiApiKey: (key: string) => void
  updateOpenAIApiKey: (key: string) => void
  updateAnthropicApiKey: (key: string) => void
  updateAiProvider: (provider: 'gemini' | 'openai' | 'anthropic') => void
  updateLift: (name: string, current: number) => void
  updateLiftTarget: (name: string, target: number) => void
  updateSkillLevel: (id: string, level: number) => void
  toggleProtocol: (id: string) => void
  resetDailyProtocols: () => void
  addBook: (book: Omit<Book, 'id'>) => void
  updateBookStatus: (id: string, status: Book['status']) => void
  removeBook: (id: string) => void
  updateLegalFramework: (id: string, status: LegalFramework['status']) => void
  addEconomicEngine: (engine: Omit<EconomicEngine, 'id'>) => void
  updateEconomicEngine: (id: string, updates: Partial<EconomicEngine>) => void
  toggleMentalFramework: (id: string) => void
  updateOperativeAttribute: (id: string, strength: number) => void
  addMission: (mission: Omit<Mission, 'id'>) => void
  updateMission: (id: string, updates: Partial<Mission>) => void
  completeMission: (id: string) => void
}

const MISSION_START_DATE = '2026-01-28'

const initialLifts: Lift[] = [
  { name: 'Deadlift', current: 0, target: 122.5, unit: 'kg' },
  { name: 'OHP', current: 0, target: 52.5, unit: 'kg' },
  { name: 'W. Pull-up', current: 0, target: 17.5, unit: 'kg' },
]

const initialSkills: Skill[] = [
  { id: 'bjj', name: 'Brazilian Jiu-Jitsu', level: 0, icon: 'Swords', category: 'combat', benchmark: 'Blue Belt' },
  { id: 'muay-thai', name: 'Muay Thai', level: 0, icon: 'Swords', category: 'combat', benchmark: 'Fundamental strikes' },
  { id: 'lockpicking', name: 'Lockpicking', level: 0, icon: 'KeyRound', category: 'tradecraft', benchmark: '<60sec on 5-pin' },
  { id: 'performance-driving', name: 'Performance Driving', level: 0, icon: 'Car', category: 'driving', benchmark: 'Threshold braking' },
  { id: 'osint', name: 'OSINT', level: 0, icon: 'Target', category: 'intel', benchmark: 'Digital footprint mapping' },
  { id: 'tccc', name: 'TCCC (Tactical Casualty)', level: 0, icon: 'HeartPulse', category: 'medical', benchmark: 'Tourniquet proficiency' },
  { id: 'languages', name: 'Languages', level: 0, icon: 'Languages', category: 'tradecraft', benchmark: 'B1/B2 level' },
  { id: 'situational-awareness', name: 'Situational Awareness', level: 0, icon: 'Eye', category: 'psychology', benchmark: 'Condition Yellow' },
  { id: 'cold-reading', name: 'Cold Reading', level: 0, icon: 'Brain', category: 'psychology', benchmark: 'Deduction basics' },
  { id: 'elicitation', name: 'Elicitation', level: 0, icon: 'MessageCircle', category: 'psychology', benchmark: 'Casual intel extraction' },
]

const initialProtocols: DailyProtocol[] = [
  { id: 'cold-shower', name: 'Cold Shower', completed: false },
  { id: 'water', name: '3L Water', completed: false },
  { id: 'posture', name: 'Posture Check', completed: false },
  { id: 'language', name: 'Language Practice', completed: false },
]

const initialBooks: Book[] = [
  // Marcus Aurelius & Sun Tzu (Core)
  { id: '1', title: 'The Art of War', author: 'Sun Tzu', status: 'reading' },
  { id: '2', title: 'Meditations', author: 'Marcus Aurelius', status: 'to-read' },
  
  // Psychology & Manipulation
  { id: '3', title: 'The 48 Laws of Power', author: 'Robert Greene', status: 'to-read' },
  { id: '4', title: 'Social Engineering: The Science of Human Hacking', author: 'Christopher Hadnagy', status: 'to-read' },
  { id: '5', title: 'What Every Body Is Saying', author: 'Joe Navarro', status: 'to-read' },
  { id: '6', title: 'Never Split the Difference', author: 'Chris Voss', status: 'to-read' },
  { id: '7', title: 'Influence: The Psychology of Persuasion', author: 'Robert Cialdini', status: 'to-read' },
  { id: '8', title: 'The Confidence Game', author: 'Maria Konnikova', status: 'to-read' },
  { id: '9', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', status: 'to-read' },
  
  // Tradecraft & Tactical Skills
  { id: '10', title: '100 Deadly Skills', author: 'Clint Emerson', status: 'to-read' },
  { id: '11', title: 'Left of Bang', author: 'Patrick Van Horne & Jason Riley', status: 'to-read' },
  { id: '12', title: 'The Gift of Fear', author: 'Gavin de Becker', status: 'to-read' },
  { id: '13', title: 'Emergency War Surgery (NATO Handbook)', author: 'NATO', status: 'to-read' },
  
  // Strategy & Decision Making
  { id: '14', title: 'Good Strategy Bad Strategy', author: 'Richard Rumelt', status: 'to-read' },
  { id: '15', title: 'The Goal', author: 'Eliyahu Goldratt', status: 'to-read' },
  { id: '16', title: 'Antifragile', author: 'Nassim Taleb', status: 'to-read' },
  { id: '17', title: 'The Black Swan', author: 'Nassim Taleb', status: 'to-read' },
  
  // Business & Economics
  { id: '18', title: 'The Lean Startup', author: 'Eric Ries', status: 'to-read' },
  { id: '19', title: 'Zero to One', author: 'Peter Thiel', status: 'to-read' },
  { id: '20', title: 'The 4-Hour Workweek', author: 'Tim Ferriss', status: 'to-read' },
  { id: '21', title: 'Traction', author: 'Gabriel Weinberg & Justin Mares', status: 'to-read' },
  
  // Stoicism & Philosophy
  { id: '22', title: 'Letters from a Stoic', author: 'Seneca', status: 'to-read' },
  { id: '23', title: 'The Obstacle Is the Way', author: 'Ryan Holiday', status: 'to-read' },
  { id: '24', title: 'Ego Is the Enemy', author: 'Ryan Holiday', status: 'to-read' },
  { id: '25', title: 'Stillness Is the Key', author: 'Ryan Holiday', status: 'to-read' },
  
  // Combat & Physical
  { id: '26', title: 'Jiu-Jitsu Principles', author: 'John Kavanagh', status: 'to-read' },
  { id: '27', title: 'The Art of Invisibility', author: 'Kevin Mitnick', status: 'to-read' },
  { id: '28', title: 'Stealing Fire', author: 'Jamie Wheal & Steven Kotler', status: 'to-read' },
  
  // Intelligence & Operations
  { id: '29', title: 'The Spy and the Traitor', author: 'John le Carré', status: 'to-read' },
  { id: '30', title: 'Spy Schools', author: 'William M. Stevenson', status: 'to-read' },
  { id: '31', title: 'The Puzzle Palace', author: 'James Bamford', status: 'to-read' },
  
  // Psychology of Performance
  { id: '32', title: 'Flow', author: 'Mihály Csíkszentmihályi', status: 'to-read' },
  { id: '33', title: 'Peak Performance', author: 'Brad Stulberg & Steve Magness', status: 'to-read' },
  { id: '34', title: 'The Champion Mind', author: 'Jim Afremow', status: 'to-read' },
  
  // Security & Privacy
  { id: '35', title: 'This Machine Kills Secrets', author: 'Andy Greenberg', status: 'to-read' },
  { id: '36', title: 'Cypherpunks', author: 'Julian Assange', status: 'to-read' },
  { id: '37', title: 'TryHackMe Roadmap', author: 'hunterdii', status: 'to-read', url: 'https://hunterdii.gitbook.io/tryhackme-roadmap/' },
  
  // Practical Knowledge
  { id: '38', title: 'The SAS Survival Handbook', author: 'John Wiseman', status: 'to-read' },
  { id: '39', title: 'Urban Survival Guide', author: 'Creek Stewart', status: 'to-read' },
  { id: '40', title: 'Evasion', author: 'Armed Forces Manual', status: 'to-read' },
]

const initialLegalFrameworks: LegalFramework[] = [
  { id: 'second-residency', name: 'Second Residency / Digital Nomad Visa', status: 'not-started', description: 'Acquire Plan B residency (Spain, Portugal, Dubai)', priority: 'high' },
  { id: 'idp', name: 'International Driving Permit', status: 'not-started', description: 'IDP for legal vehicle control in 150+ countries', priority: 'medium' },
  { id: 'doomsday-drive', name: 'Encrypted Doomsday Drive', status: 'not-started', description: 'USB with critical docs & cold storage keys', priority: 'high' },
  { id: 'global-entry', name: 'Global Entry / APEC Card', status: 'not-started', description: 'Trusted Traveler status for rapid transit', priority: 'medium' },
  { id: 'anonymous-llc', name: 'Anonymous LLC (Wyoming/Nevis)', status: 'not-started', description: 'Asset protection entity with privacy', priority: 'high' },
  { id: 'living-trust', name: 'Revocable Living Trust', status: 'not-started', description: 'Private asset management & succession', priority: 'medium' },
  { id: 'ip-holding', name: 'IP Holding Company', status: 'not-started', description: 'Separate brand/code asset ownership', priority: 'medium' },
]

const initialEconomicEngines: EconomicEngine[] = [
  { id: 'consulting', name: 'Boutique Consulting', type: 'consulting', status: 'idea', monthlyRevenue: 0, description: 'High-level specialized knowledge (Cybersecurity, Crisis Management, Code)' },
  { id: 'saas', name: 'Micro-SaaS', type: 'saas', status: 'idea', monthlyRevenue: 0, description: 'Location-independent software tools with passive revenue' },
  { id: 'content', name: 'Digital Real Estate (Newsletter/Authority)', type: 'content', status: 'idea', monthlyRevenue: 0, description: 'Niche authority site or newsletter with audience leverage' },
  { id: 'boring', name: 'Boring Acquisitions (Storage/Wash)', type: 'asset', status: 'idea', monthlyRevenue: 0, description: 'Unsexy cash-flowing assets (storage units, car wash)' },
]

const initialMentalFrameworks: MentalFramework[] = [
  { id: 'ooda', name: 'OODA Loop', description: 'Observe → Orient → Decide → Act', application: 'Fast decision-making in high-stakes situations', difficulty: 'intermediate', mastered: false },
  { id: 'flag-theory', name: 'Flag Theory', description: 'Go where you are treated best', application: 'Earn in Country A, Bank in B, Live in C - optimize freedom', difficulty: 'advanced', mastered: false },
  { id: 'zero-trust', name: 'Zero Trust Architecture', description: 'Never trust, always verify', application: '2FA with hardware keys, VPN, data compartmentalization', difficulty: 'intermediate', mastered: false },
  { id: 'barbell', name: 'Barbell Strategy', description: 'Extreme safety + extreme risk (no middle)', application: '90% safe (cash/bonds), 10% high-risk (crypto/startups)', difficulty: 'advanced', mastered: false },
  { id: 'stoicism', name: 'Stoic Philosophy', description: 'Emotional control through virtue', application: 'Remain calm under pressure, focus on what you control', difficulty: 'intermediate', mastered: false },
]

const initialMissions: Mission[] = [
  // Physical Domain
  { id: 'deadlift-122', name: 'Deadlift 122.5kg', description: 'Achieve 122.5kg deadlift - 50% bodyweight target', domain: 'physical', status: 'active', target: 122.5, progress: 0, dueDate: '2026-07-28', reward: 'Physical Mastery Badge' },
  { id: 'ohp-52', name: 'OHP 52.5kg', description: 'Overhead press to 52.5kg', domain: 'physical', status: 'active', target: 52.5, progress: 0, dueDate: '2026-07-28', reward: 'Core Strength Badge' },
  { id: 'pullup-17', name: 'Weighted Pull-up +17.5kg', description: 'Weighted pull-up with 17.5kg - 1RM', domain: 'physical', status: 'active', target: 17.5, progress: 0, dueDate: '2026-07-28', reward: 'Upper Body Badge' },
  
  // Tactical Domain
  { id: 'bjj-blue', name: 'BJJ Blue Belt', description: 'Achieve Brazilian Jiu-Jitsu blue belt', domain: 'tactical', status: 'active', target: 100, progress: 0, dueDate: '2026-07-28', reward: 'Combat Proficiency' },
  { id: 'osint-mastery', name: 'OSINT Mastery', description: 'Create detailed digital footprint mapping - 10 profiles', domain: 'tactical', status: 'active', target: 10, progress: 0, dueDate: '2026-07-28', reward: 'Intel Badge' },
  { id: 'languages-b1', name: 'Language B1 Level', description: 'Reach B1/B2 proficiency in target language', domain: 'tactical', status: 'active', target: 100, progress: 0, dueDate: '2026-07-28', reward: 'Polyglot Badge' },
  
  // Intellectual Domain
  { id: 'books-15', name: 'Read 15 Books', description: 'Complete reading of 15 core reference books', domain: 'intellectual', status: 'active', target: 15, progress: 0, dueDate: '2026-07-28', reward: 'Knowledge Master' },
  { id: 'strategy-mastery', name: 'Strategy Framework Mastery', description: 'Master Good Strategy, The Goal, Antifragile', domain: 'intellectual', status: 'active', target: 3, progress: 0, dueDate: '2026-07-28', reward: 'Strategic Thinking Badge' },
  
  // Strategic Domain
  { id: 'second-residency', name: 'Acquire Plan B Residency', description: 'Successfully obtain second residency or digital nomad visa', domain: 'strategic', status: 'active', target: 100, progress: 0, dueDate: '2026-07-28', reward: 'Global Citizen Badge' },
  { id: 'economic-revenue', name: 'Generate First Revenue Stream', description: 'Launch first economic engine with $500+ MRR', domain: 'strategic', status: 'active', target: 500, progress: 0, dueDate: '2026-07-28', reward: 'Entrepreneur Badge' },
]

const initialOperativeAttributes: OperativeAttribute[] = [
  { id: 'grey-man', name: 'Grey Man Theory', description: 'Ability to be forgettable until you choose not to be', strength: 0, icon: 'Eye' },
  { id: 'silence', name: 'Operational Silence', description: 'Speak in statements, not questions. Comfort with silence', strength: 0, icon: 'Lock' },
  { id: 'grit', name: 'Grit', description: 'Endure discomfort without complaint (cold, hard rucking, fasting)', strength: 0, icon: 'Flame' },
  { id: 'decision-speed', name: 'Decision Speed', description: 'Good decisions made immediately beat perfect ones made late', strength: 0, icon: 'Zap' },
]

export const useOperativeStore = create<OperativeState>()(
  persist(
    (set, get) => ({
      // Initial State
      height: 0,
      weight: 0,
      waistSize: 0,
      startDate: MISSION_START_DATE,
      interfaceScale: 1.0,
      geminiApiKey: '',
      openaiApiKey: '',
      anthropicApiKey: '',
      selectedAiProvider: 'gemini',
      lifts: initialLifts,
      skills: initialSkills,
      dailyProtocols: initialProtocols,
      lastResetDate: new Date().toISOString().split('T')[0],
      books: initialBooks,
      legalFrameworks: initialLegalFrameworks,
      economicEngines: initialEconomicEngines,
      mentalFrameworks: initialMentalFrameworks,
      operativeAttributes: initialOperativeAttributes,
      missions: initialMissions,
      
      // Actions
      updateHeight: (height) => set({ height }),
      
      updateWeight: (weight) => set({ weight }),
      
      updateWaistSize: (waistSize) => set({ waistSize }),
      
      updateInterfaceScale: (scale) => {
        const clampedScale = Math.max(0.8, Math.min(1.2, scale))
        set({ interfaceScale: clampedScale })
        document.documentElement.style.fontSize = `${clampedScale * 16}px`
      },
      updateGeminiApiKey: (key) => set({ geminiApiKey: key }),
      updateOpenAIApiKey: (key) => set({ openaiApiKey: key }),
      updateAnthropicApiKey: (key) => set({ anthropicApiKey: key }),
      updateAiProvider: (provider) => set({ selectedAiProvider: provider }),

      updateLift: (name, current) => set((state) => ({
        lifts: state.lifts.map((lift) =>
          lift.name === name ? { ...lift, current } : lift
        ),
      })),
      
      updateLiftTarget: (name, target) => set((state) => ({
        lifts: state.lifts.map((lift) =>
          lift.name === name ? { ...lift, target } : lift
        ),
      })),
      
      updateSkillLevel: (id, level) => set((state) => ({
        skills: state.skills.map((skill) =>
          skill.id === id ? { ...skill, level: Math.min(5, Math.max(0, level)) } : skill
        ),
      })),
      
      toggleProtocol: (id) => {
        const today = new Date().toISOString().split('T')[0]
        const state = get()
        
        // Reset if it's a new day
        if (state.lastResetDate !== today) {
          set({
            dailyProtocols: state.dailyProtocols.map((p) => ({ ...p, completed: false })),
            lastResetDate: today,
          })
        }
        
        set((state) => ({
          dailyProtocols: state.dailyProtocols.map((protocol) =>
            protocol.id === id ? { ...protocol, completed: !protocol.completed } : protocol
          ),
        }))
      },
      
      resetDailyProtocols: () => set((state) => ({
        dailyProtocols: state.dailyProtocols.map((p) => ({ ...p, completed: false })),
        lastResetDate: new Date().toISOString().split('T')[0],
      })),
      
      addBook: (book) => set((state) => ({
        books: [...state.books, { ...book, id: Date.now().toString() }],
      })),
      
      updateBookStatus: (id, status) => set((state) => ({
        books: state.books.map((book) =>
          book.id === id ? { ...book, status } : book
        ),
      })),
      
      removeBook: (id) => set((state) => ({
        books: state.books.filter((book) => book.id !== id),
      })),
      
      updateLegalFramework: (id, status) => set((state) => ({
        legalFrameworks: state.legalFrameworks.map((fw) =>
          fw.id === id ? { ...fw, status } : fw
        ),
      })),
      
      addEconomicEngine: (engine) => set((state) => ({
        economicEngines: [...state.economicEngines, { ...engine, id: Date.now().toString() }],
      })),
      
      updateEconomicEngine: (id, updates) => set((state) => ({
        economicEngines: state.economicEngines.map((engine) =>
          engine.id === id ? { ...engine, ...updates } : engine
        ),
      })),
      
      toggleMentalFramework: (id) => set((state) => ({
        mentalFrameworks: state.mentalFrameworks.map((fw) =>
          fw.id === id ? { ...fw, mastered: !fw.mastered } : fw
        ),
      })),
      
      updateOperativeAttribute: (id, strength) => set((state) => ({
        operativeAttributes: state.operativeAttributes.map((attr) =>
          attr.id === id ? { ...attr, strength: Math.min(10, Math.max(0, strength)) } : attr
        ),
      })),      
      addMission: (mission) => set((state) => ({
        missions: [...state.missions, { ...mission, id: Date.now().toString() }],
      })),
      
      updateMission: (id, updates) => set((state) => ({
        missions: state.missions.map((mission) =>
          mission.id === id ? { ...mission, ...updates } : mission
        ),
      })),
      
      completeMission: (id) => set((state) => ({
        missions: state.missions.map((mission) =>
          mission.id === id ? { ...mission, status: 'completed', progress: mission.target } : mission
        ),
      })),    }),
    {
      name: 'operative-storage',
    }
  )
)
