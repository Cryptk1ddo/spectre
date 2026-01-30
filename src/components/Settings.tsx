import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon,
  User,
  Dumbbell,
  Target,
  Brain,
  Zap,
  Scale,
  Ruler,
  Save,
  X,
  Edit3,
  Maximize2,
  Minimize2,
  Monitor,
  Key,
  Shield,
} from 'lucide-react'
import { useOperativeStore } from '../store/useOperativeStore'

export function Settings() {
  const {
    height,
    weight,
    waistSize,
    interfaceScale,
    lifts,
    skills,
    missions,
    operativeAttributes,
    updateHeight,
    updateWeight,
    updateWaistSize,
    updateInterfaceScale,
    updateLift,
    updateLiftTarget,
    updateSkillLevel,
    updateMission,
    updateOperativeAttribute,
    geminiApiKey,
    updateGeminiApiKey,
  } = useOperativeStore()

  // Initialize interface scale on mount
  useEffect(() => {
    document.documentElement.style.fontSize = `${interfaceScale * 16}px`
  }, [])

  // Physical stats editing
  const [editingPhysical, setEditingPhysical] = useState(false)
  const [physicalStats, setPhysicalStats] = useState({ height, weight, waistSize })

  // Lifts editing
  const [editingLift, setEditingLift] = useState<string | null>(null)
  const [liftValues, setLiftValues] = useState<Record<string, { current: number; target: number }>>({})

  // Missions editing
  const [editingMission, setEditingMission] = useState<string | null>(null)
  const [missionValues, setMissionValues] = useState<Record<string, number>>({})

  const handleSavePhysical = () => {
    updateHeight(physicalStats.height)
    updateWeight(physicalStats.weight)
    updateWaistSize(physicalStats.waistSize)
    setEditingPhysical(false)
  }

  const handleSaveLift = (name: string) => {
    if (liftValues[name]) {
      updateLift(name, liftValues[name].current)
      updateLiftTarget(name, liftValues[name].target)
    }
    setEditingLift(null)
  }

  const handleSaveMission = (id: string) => {
    if (missionValues[id] !== undefined) {
      updateMission(id, { progress: missionValues[id] })
    }
    setEditingMission(null)
  }

  return (
    <div className="w-full space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display tracking-wide text-white">Control Panel</h1>
            <p className="text-xs text-slate-500 font-sans">Manage all metrics and variables</p>
          </div>
        </div>
      </div>

      {/* Interface Scale Section */}
      <section className="card-elevated p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-lg font-display tracking-wide text-white">
            <Monitor className="w-5 h-5 text-purple-500" />
            Interface Scale
          </h2>
          <span className="text-sm text-slate-400 font-mono tabular-nums">{Math.round(interfaceScale * 100)}%</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateInterfaceScale(interfaceScale - 0.05)}
              disabled={interfaceScale <= 0.8}
              className="tap-highlight w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease scale"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={interfaceScale}
                onChange={(e) => updateInterfaceScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-emerald-400 [&::-webkit-slider-thumb]:transition-colors [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:hover:bg-emerald-400 [&::-moz-range-thumb]:border-0"
                aria-label="Interface scale"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>80%</span>
                <span>100%</span>
                <span>120%</span>
              </div>
            </div>
            
            <button
              onClick={() => updateInterfaceScale(interfaceScale + 0.05)}
              disabled={interfaceScale >= 1.2}
              className="tap-highlight w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase scale"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={() => updateInterfaceScale(1.0)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Reset to Default (100%)
          </button>
          
          <p className="text-xs text-slate-500 leading-relaxed">
            Adjust the overall size of the interface. Changes affect all text, buttons, and UI elements.
          </p>
        </div>
      </section>

      {/* AI Intelligence Access */}
      <section className="card-elevated p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-lg font-display tracking-wide text-white">
            <Shield className="w-5 h-5 text-emerald-500" />
            Tactical AI System
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
            <label className="block text-sm text-slate-400 mb-2 font-mono">
              GEMINI API KEY <span className="text-emerald-500/50 text-[10px] ml-2">ENCRYPTED</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                value={geminiApiKey || ''}
                onChange={(e) => updateGeminiApiKey(e.target.value)}
                placeholder="Enter Gemini API Key"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-base md:text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-colors font-mono"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Required for the Tactical AI module. Your key interacts directly with Google APIs and is stored only on this device.
            </p>
          </div>
        </div>
      </section>

      {/* Physical Stats Section */}
      <section className="card-elevated p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-display tracking-wide text-white">
            <User className="w-5 h-5 text-blue-500" />
            Physical Stats
          </h2>
          {!editingPhysical && (
            <button
              onClick={() => {
                setPhysicalStats({ height, weight, waistSize })
                setEditingPhysical(true)
              }}
              className="tap-highlight px-3 py-1.5 bg-slate-800 rounded-lg text-emerald-500 text-sm flex items-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>

        {editingPhysical ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Height (cm)</label>
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-blue-500" />
                  <input
                    type="number"
                    value={physicalStats.height}
                    onChange={(e) => setPhysicalStats({ ...physicalStats, height: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Weight (kg)</label>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-500" />
                  <input
                    type="number"
                    value={physicalStats.weight}
                    onChange={(e) => setPhysicalStats({ ...physicalStats, weight: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Waist (cm)</label>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  <input
                    type="number"
                    value={physicalStats.waistSize}
                    onChange={(e) => setPhysicalStats({ ...physicalStats, waistSize: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSavePhysical}
                className="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-display flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setEditingPhysical(false)}
                className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Height</div>
              <div className="text-lg font-display text-white">{height} cm</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Weight</div>
              <div className="text-lg font-display text-white">{weight} kg</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Waist</div>
              <div className="text-lg font-display text-white">{waistSize} cm</div>
            </div>
          </div>
        )}
      </section>

      {/* Lifts Section */}
      <section className="card-elevated p-4 md:p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-display tracking-wide text-white">
          <Dumbbell className="w-5 h-5 text-red-500" />
          Primary Lifts
        </h2>
        <div className="space-y-2">
          {lifts.map((lift) => (
            <div key={lift.name} className="p-3 bg-slate-800/50 rounded-lg">
              {editingLift === lift.name ? (
                <div className="space-y-2">
                  <div className="font-display text-white">{lift.name}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Current ({lift.unit})</label>
                      <input
                        type="number"
                        value={liftValues[lift.name]?.current ?? lift.current}
                        onChange={(e) =>
                          setLiftValues({
                            ...liftValues,
                            [lift.name]: { ...liftValues[lift.name], current: parseFloat(e.target.value) || 0, target: liftValues[lift.name]?.target ?? lift.target },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono"
                        step="2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Target ({lift.unit})</label>
                      <input
                        type="number"
                        value={liftValues[lift.name]?.target ?? lift.target}
                        onChange={(e) =>
                          setLiftValues({
                            ...liftValues,
                            [lift.name]: { current: liftValues[lift.name]?.current ?? lift.current, target: parseFloat(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono"
                        step="2.5"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveLift(lift.name)}
                      className="flex-1 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-display"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingLift(null)}
                      className="px-3 py-1.5 bg-slate-700 text-slate-400 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-white">{lift.name}</div>
                    <div className="text-xs text-slate-400">
                      {lift.current} / {lift.target} {lift.unit}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLiftValues({ ...liftValues, [lift.name]: { current: lift.current, target: lift.target } })
                      setEditingLift(lift.name)
                    }}
                    className="tap-highlight px-3 py-1 bg-slate-700 rounded-lg text-emerald-500 text-xs"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="card-elevated p-4 md:p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-display tracking-wide text-white">
          <Zap className="w-5 h-5 text-amber-500" />
          Skills Matrix
        </h2>
        <div className="space-y-2">
          {skills.map((skill) => (
            <div key={skill.id} className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-sm text-white">{skill.name}</div>
                <div className="text-xs text-slate-400">Level {skill.level}/5</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={skill.level}
                  onChange={(e) => updateSkillLevel(skill.id, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-sm font-mono text-emerald-500 w-6 text-right">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Missions Section */}
      <section className="card-elevated p-4 md:p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-display tracking-wide text-white">
          <Target className="w-5 h-5 text-emerald-500" />
          Active Missions
        </h2>
        <div className="space-y-2">
          {missions.filter(m => m.status === 'active').map((mission) => (
            <div key={mission.id} className="p-3 bg-slate-800/50 rounded-lg">
              {editingMission === mission.id ? (
                <div className="space-y-2">
                  <div className="font-display text-sm text-white">{mission.name}</div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Progress</label>
                    <input
                      type="number"
                      value={missionValues[mission.id] ?? mission.progress}
                      onChange={(e) =>
                        setMissionValues({
                          ...missionValues,
                          [mission.id]: parseFloat(e.target.value) || 0,
                        })
                      }
                      max={mission.target}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveMission(mission.id)}
                      className="flex-1 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-display"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingMission(null)}
                      className="px-3 py-1.5 bg-slate-700 text-slate-400 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-display text-sm text-white mb-1">{mission.name}</div>
                    <div className="text-xs text-slate-400">
                      {mission.progress} / {mission.target}
                    </div>
                    <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMissionValues({ ...missionValues, [mission.id]: mission.progress })
                      setEditingMission(mission.id)
                    }}
                    className="tap-highlight ml-3 px-3 py-1 bg-slate-700 rounded-lg text-emerald-500 text-xs"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Operative Attributes Section */}
      <section className="card-elevated p-4 md:p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-display tracking-wide text-white">
          <Brain className="w-5 h-5 text-blue-500" />
          Operative Attributes
        </h2>
        <div className="space-y-2">
          {operativeAttributes.map((attr) => (
            <div key={attr.id} className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-display text-sm text-white">{attr.name}</div>
                  <div className="text-xs text-slate-500">{attr.description}</div>
                </div>
                <div className="text-xs text-slate-400">Strength {attr.strength}/10</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={attr.strength}
                  onChange={(e) => updateOperativeAttribute(attr.id, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-sm font-mono text-emerald-500 w-6 text-right">{attr.strength}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
