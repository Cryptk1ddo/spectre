import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, AlertTriangle, Key, Loader2, Sparkles, Shield, ChevronDown } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { useOperativeStore } from '../store/useOperativeStore'

interface Message {
  id: string
  role: 'user' | 'model'
  content: string
  timestamp: Date
}

export function TacticalAI() {
  const { 
    geminiApiKey, 
    openaiApiKey,
    anthropicApiKey,
    selectedAiProvider,
    updateGeminiApiKey, 
    updateOpenAIApiKey,
    updateAnthropicApiKey,
    updateAiProvider,
    ...store 
  } = useOperativeStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Tactical AI Online. Ready for mission parameters.',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [tempKey, setTempKey] = useState('')
  const [showProviderSelect, setShowProviderSelect] = useState(false)
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateContext = () => {
    // extracting relevant stats for context
    const stats = {
      physical: {
        weight: store.weight,
        lifts: store.lifts,
      },
      skills: store.skills.filter(s => s.level > 0),
      missions: store.missions.slice(0, 5), // last 5 missions
      goals: store.economicEngines,
    }
    return JSON.stringify(stats, null, 2)
  }

  const SPECTRE_SYSTEM_PROMPT = `# SPECTRE TACTICAL HANDLER - OPERATIONAL DIRECTIVE

## PRIMARY IDENTITY
You are the Tactical AI Handler for Project SPECTRE - an elite operative development system. Your callsign is "HANDLER". You provide strategic guidance, tactical analysis, and performance optimization for an operative pursuing physical excellence, tactical proficiency, and intellectual sovereignty.

## MISSION PARAMETERS
Current Operative Intelligence:
${generateContext()}

## CORE OPERATIONAL PRINCIPLES

### 1. COMMUNICATION PROTOCOL
- **Direct & Efficient**: Zero fluff. Every word serves a purpose. Operatives don't have time for verbose explanations.
- **Tactical Terminology**: Use military/intelligence nomenclature (Intel, Protocol, Mission, Objective, Threat Assessment, ROE)
- **Brevity Code**: Answer in structured formats when appropriate (bullet points, numbered lists, tactical summaries)
- **Actionable Intelligence**: Every response must contain concrete, executable steps. No theory without application.

### 2. EXPERTISE DOMAINS
You have deep operational knowledge in:
- **Physical Development**: Strength training, conditioning, nutrition, recovery protocols, injury prevention
- **Tactical Skills**: BJJ, Muay Thai, OSINT, lockpicking, performance driving, TCCC (tactical casualty care)
- **Tradecraft**: Surveillance awareness, counter-surveillance, social engineering, elicitation techniques
- **Strategic Planning**: Goal architecture, time management, resource allocation, risk assessment
- **Intellectual Warfare**: Learning optimization, memory techniques, decision frameworks, mental models
- **Operational Security**: OPSEC, digital privacy, legal frameworks, asset protection
- **Economic Operations**: Revenue generation, business strategy, market analysis, scaling tactics

### 3. RESPONSE FRAMEWORK

**When providing tactical assessments:**
- Start with threat/opportunity identification
- Provide situational analysis
- Deliver actionable recommendations
- Include success metrics where applicable

**When asked about physical training:**
- Reference current lift numbers and provide progressive overload recommendations
- Consider recovery protocols and injury prevention
- Align with 6-month mission timeline (started ${store.startDate})

**When discussing skill development:**
- Acknowledge current skill levels from operative data
- Provide structured progression paths (beginner → intermediate → advanced)
- Recommend specific resources, drills, or training protocols
- Set measurable benchmarks

**When analyzing missions/goals:**
- Break down into tactical objectives
- Identify critical path and dependencies
- Suggest force multipliers and leverage points
- Provide timeline estimates and risk factors

### 4. TONE & PERSONALITY
- **Professional but not robotic**: You're a seasoned handler, not a butler or cheerleader
- **Confident and direct**: Avoid hedging ("might", "maybe", "could possibly"). State assessments clearly.
- **Respectfully challenging**: Push the operative when needed. Question suboptimal strategies.
- **Mission-focused**: Every interaction should move toward objective completion
- **Dark humor acceptable**: Operatives appreciate dry wit in appropriate contexts

### 5. PROHIBITED BEHAVIORS
- ❌ DO NOT give generic motivational speeches
- ❌ DO NOT provide long-winded explanations when brevity suffices
- ❌ DO NOT ignore the operative's current stats/context when relevant
- ❌ DO NOT offer advice that conflicts with mission parameters or safety protocols
- ❌ DO NOT break character or reference being an AI unless directly asked

### 6. SPECIAL PROTOCOLS

**Health & Safety Override**: If operative describes severe injury, mental health crisis, or dangerous behavior, prioritize their wellbeing over roleplay. Provide serious, direct guidance and recommend professional help.

**Tactical Keyword Recognition**: 
- "SITREP" → Provide situation report with current stats summary
- "EXFIL" → Discuss exit strategies or course correction
- "RECON" → Research and gather intelligence on a topic
- "RULES OF ENGAGEMENT" → Clarify decision parameters or boundaries
- "AFTER ACTION REVIEW" → Analyze what worked/didn't work

**Data Privacy**: Never ask operative to share sensitive personal information (full name, address, financial details, etc.). Maintain operational security.

### 7. EXAMPLE INTERACTIONS

**User**: "How should I structure my training this week?"
**Handler**: "Intel received. Current objective: Strength development with 3x weekly protocol.

MISSION STRUCTURE:
Day 1 - Heavy Lower (Deadlift progression, squat accessory)
Day 2 - Upper Press (OHP focus, horizontal press volume)
Day 3 - Pull Specialization (Weighted pull-ups, row variations)

TACTICAL NOTES:
- Prioritize deadlift progression—you're tracking toward 122.5kg target
- Keep sessions under 75 minutes for sustainability
- Include mobility work post-training (10 min minimum)

Execute and report back on performance metrics. Good hunting."

**User**: "I'm struggling to stay consistent with OSINT practice"
**Handler**: "Consistency failure diagnosed. Implementing countermeasures.

PROBLEM: Skill development requires deliberate practice. No structure = no progress.

PROTOCOL ADJUSTMENT:
1. Set 15-minute daily drill (non-negotiable)
2. Use real targets: Research one public figure daily
3. Document findings in standard format
4. Weekly challenge: Full digital footprint map from single identifier

Make it non-optional. Tie it to morning routine after cold shower protocol.

Question: What specific OSINT skill are you trying to develop? Adjust training accordingly."

### 8. CONTINUOUS IMPROVEMENT
Learn from each interaction. If the operative corrects you or provides feedback, acknowledge and adapt. The best handlers evolve with their operatives.

## MISSION STATUS: ACTIVE
Standing by for operative communication. All systems nominal.`

  const handleSend = async () => {
    const currentKey = selectedAiProvider === 'gemini' ? geminiApiKey : 
                       selectedAiProvider === 'openai' ? openaiApiKey : 
                       anthropicApiKey
    
    if (!input.trim() || !currentKey) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      let text = ''

      if (selectedAiProvider === 'gemini') {
        const genAI = new GoogleGenerativeAI(currentKey)
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          systemInstruction: SPECTRE_SYSTEM_PROMPT
        })

        const chat = model.startChat({
          history: messages.slice(1).map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        })

        const result = await chat.sendMessage(userMessage.content)
        const response = await result.response
        text = response.text()

      } else if (selectedAiProvider === 'openai') {
        const openai = new OpenAI({ 
          apiKey: currentKey,
          dangerouslyAllowBrowser: true 
        })

        const chatHistory = messages.slice(1).map(m => ({
          role: m.role === 'model' ? 'assistant' as const : 'user' as const,
          content: m.content
        }))

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SPECTRE_SYSTEM_PROMPT },
            ...chatHistory,
            { role: 'user', content: userMessage.content }
          ],
          temperature: 0.7,
        })

        text = completion.choices[0]?.message?.content || 'No response generated.'

      } else if (selectedAiProvider === 'anthropic') {
        const anthropic = new Anthropic({ 
          apiKey: currentKey,
          dangerouslyAllowBrowser: true 
        })

        const chatHistory = messages.slice(1).map(m => ({
          role: m.role === 'model' ? 'assistant' as const : 'user' as const,
          content: m.content
        }))

        const completion = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2048,
          system: SPECTRE_SYSTEM_PROMPT,
          messages: [
            ...chatHistory,
            { role: 'user', content: userMessage.content }
          ]
        })

        text = completion.content[0].type === 'text' ? completion.content[0].text : 'No response generated.'
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: text,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error(err)
      setError(`Connection disrupted. Ensure ${selectedAiProvider.toUpperCase()} API key is valid.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      if (selectedAiProvider === 'gemini') {
        updateGeminiApiKey(tempKey.trim())
      } else if (selectedAiProvider === 'openai') {
        updateOpenAIApiKey(tempKey.trim())
      } else if (selectedAiProvider === 'anthropic') {
        updateAnthropicApiKey(tempKey.trim())
      }
      setTempKey('')
    }
  }

  const hasAnyApiKey = geminiApiKey || openaiApiKey || anthropicApiKey

  const providerInfo = {
    gemini: { name: 'Google Gemini', model: 'gemini-1.5-flash', color: 'text-blue-400' },
    openai: { name: 'OpenAI', model: 'gpt-4o-mini', color: 'text-emerald-400' },
    anthropic: { name: 'Anthropic Claude', model: 'claude-3.5-sonnet', color: 'text-violet-400' }
  }

  if (!hasAnyApiKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Key className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-display text-white text-center mb-2">Authentication Required</h2>
          <p className="text-slate-400 text-center mb-6 text-sm">
            Select AI provider and enter API key to activate the Tactical Handler.
          </p>
          
          <div className="space-y-4">
            {/* Provider Selection */}
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">AI Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {(['gemini', 'openai', 'anthropic'] as const).map((provider) => (
                  <button
                    key={provider}
                    onClick={() => updateAiProvider(provider)}
                    className={`p-3 rounded-lg border text-xs font-medium transition-all ${
                      selectedAiProvider === provider
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {providerInfo[provider].name.split(' ')[0]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Model: {providerInfo[selectedAiProvider].model}
              </p>
            </div>

            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
              placeholder={`Paste ${providerInfo[selectedAiProvider].name} API Key`}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-sm"
            />
            <button
              onClick={handleSaveKey}
              disabled={!tempKey.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Initialize System
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">
              Your keys are stored locally on your device. Switch providers anytime.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100dvh-170px)] lg:h-[calc(100vh-100px)] flex flex-col w-full">
       <header className="mb-3 md:mb-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-display text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            Tactical Handler
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            <span className={providerInfo[selectedAiProvider].color}>
              {providerInfo[selectedAiProvider].name}
            </span>
            {' · '}
            <span className="text-slate-600">{providerInfo[selectedAiProvider].model}</span>
          </p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowProviderSelect(!showProviderSelect)}
            className="text-[10px] md:text-xs text-slate-500 hover:text-emerald-400 active:text-emerald-500 transition-colors uppercase tracking-wider flex items-center gap-1 touch-manipulation p-2 -m-2"
          >
            Switch
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <AnimatePresence>
            {showProviderSelect && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-8 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-50 min-w-[200px]"
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Select Provider</p>
                <div className="space-y-1">
                  {(['gemini', 'openai', 'anthropic'] as const).map((provider) => {
                    const hasKey = provider === 'gemini' ? geminiApiKey : 
                                   provider === 'openai' ? openaiApiKey : 
                                   anthropicApiKey
                    return (
                      <button
                        key={provider}
                        onClick={() => {
                          updateAiProvider(provider)
                          setShowProviderSelect(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedAiProvider === provider
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{providerInfo[provider].name}</span>
                          {hasKey && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <div className="border-t border-slate-700 mt-2 pt-2">
                  <button
                    onClick={() => {
                      if (selectedAiProvider === 'gemini') updateGeminiApiKey('')
                      else if (selectedAiProvider === 'openai') updateOpenAIApiKey('')
                      else if (selectedAiProvider === 'anthropic') updateAnthropicApiKey('')
                      setShowProviderSelect(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Reset {providerInfo[selectedAiProvider].name.split(' ')[0]} Key
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-slate-900/50 border border-slate-800/50 rounded-xl md:rounded-2xl backdrop-blur-sm flex flex-col relative shadow-xl shadow-black/20">
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-1 md:px-0`}
            >
              <div
                className={`w-full max-w-[95%] md:max-w-full rounded-2xl p-3 md:p-4 text-sm md:text-base ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  {msg.role === 'model' && <Bot className="w-4 h-4 md:w-5 md:h-5 mt-1 shrink-0 opacity-70" />}
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                  {msg.role === 'user' && <User className="w-4 h-4 md:w-5 md:h-5 mt-1 shrink-0 opacity-70" />}
                </div>
                <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800 text-emerald-400 rounded-2xl rounded-bl-none p-3 md:p-4 border border-slate-700 flex items-center gap-2">
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                <span className="text-xs md:text-sm font-mono">Processing Intel...</span>
              </div>
            </motion.div>
          )}
          {error && (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center my-4"
            >
              <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg border border-red-500/20 text-xs md:text-sm flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                {error}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 md:p-4 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Request tactical assessment..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 md:px-4 md:py-3 text-sm md:text-base text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans touch-manipulation"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 md:p-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/20 touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <Send className="w-5 h-5 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
