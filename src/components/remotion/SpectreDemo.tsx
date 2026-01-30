import { 
  AbsoluteFill, 
  useCurrentFrame, 
  useVideoConfig, 
  interpolate, 
  spring,
  Series,
} from 'remotion'
import { Shield, Target, Dumbbell, Brain, Lock, BookOpen, Award, ChevronRight, Zap, CheckCircle2 } from 'lucide-react'

// ============================================================================
// DESIGN TOKENS
// ============================================================================
const colors = {
  bg: '#020617',
  bgAlt: '#0a0f1a',
  surface: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  muted: '#64748b',
  text: '#f8fafc',
  emerald: '#10b981',
  emeraldGlow: '#34d399',
  emeraldBright: '#6ee7b7',
  cyan: '#22d3ee',
  cyanGlow: '#67e8f9',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  red: '#ef4444',
}

// Spring configs (from timing.md best practices)
const springConfigs = {
  smooth: { damping: 200 }, // Smooth, no bounce
  snappy: { damping: 20, stiffness: 200 }, // Snappy, minimal bounce
  bouncy: { damping: 8 }, // Bouncy entrance
  heavy: { damping: 15, stiffness: 80, mass: 2 }, // Heavy, slow
}

// ============================================================================
// SHARED BACKGROUND COMPONENTS
// ============================================================================
function GridBackground({ opacity = 0.03 }: { opacity?: number }) {
  const frame = useCurrentFrame()
  const offset = frame * 0.3
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      opacity,
      backgroundImage: `
        linear-gradient(to right, ${colors.emerald}40 1px, transparent 1px),
        linear-gradient(to bottom, ${colors.emerald}40 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
      backgroundPosition: `${offset}px ${offset}px`,
    }} />
  )
}

function ParticleField({ count = 30, color1 = colors.emerald, color2 = colors.cyan }) {
  const frame = useCurrentFrame()
  
  return (
    <>
      {[...Array(count)].map((_, i) => {
        const baseX = (i * 137.5) % 1920
        const baseY = (i * 73.3) % 1080
        const speed = 0.3 + (i % 5) * 0.15
        const size = 2 + (i % 4) * 1.5
        const pulsePhase = i * 0.5
        
        const x = baseX + Math.sin(frame * 0.01 * speed + i) * 50
        const y = baseY + Math.cos(frame * 0.008 * speed + i * 0.7) * 40
        const pulse = Math.sin(frame * 0.05 + pulsePhase) * 0.4 + 0.6
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: i % 2 === 0 ? color1 : color2,
              opacity: pulse * 0.6,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${size * 3}px ${i % 2 === 0 ? color1 : color2}`,
            }}
          />
        )
      })}
    </>
  )
}

function GlowOrb({ x, y, size, color, blur = 100, opacity = 0.3, pulse = false }: {
  x: string, y: string, size: number, color: string, blur?: number, opacity?: number, pulse?: boolean
}) {
  const frame = useCurrentFrame()
  const pulseValue = pulse ? (Math.sin(frame * 0.03) * 0.15 + 1) : 1
  
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size * pulseValue,
      height: size * pulseValue,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: `blur(${blur}px)`,
      opacity,
      transform: 'translate(-50%, -50%)',
    }} />
  )
}

function ScanLines() {
  const frame = useCurrentFrame()
  const scanY = (frame * 3) % 1200 - 100
  
  return (
    <>
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: scanY,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${colors.emeraldGlow}40, transparent)`,
        boxShadow: `0 0 20px ${colors.emerald}`,
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.03) 2px,
          rgba(0,0,0,0.03) 4px
        )`,
        pointerEvents: 'none',
      }} />
    </>
  )
}

function GlowBorder({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const frame = useCurrentFrame()
  const animFrame = Math.max(0, frame - delay)
  const rotation = animFrame * 2
  
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        inset: -2,
        borderRadius: 28,
        background: `conic-gradient(from ${rotation}deg, ${colors.emerald}, ${colors.cyan}, ${colors.violet}, ${colors.emerald})`,
        opacity: 0.6,
        filter: 'blur(4px)',
      }} />
      <div style={{
        position: 'relative',
        background: colors.surface,
        borderRadius: 26,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// SCENE 1: CINEMATIC INTRO (2.67s = 80 frames @ 30fps)
// ============================================================================
function CinematicIntro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  // Reveal animation - use seconds * fps (best practice from animations.md)
  const revealProgress = interpolate(frame, [0, 1.3 * fps], [0, 1], { 
    extrapolateRight: 'clamp'
  })
  
  // Logo scale with spring (proper fps usage from timing.md)
  const logoScale = spring({ 
    frame: frame - 0.33 * fps, 
    fps, 
    config: springConfigs.bouncy 
  })
  
  const glowIntensity = interpolate(frame, [0.67 * fps, 1.67 * fps], [0, 1], { 
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp' 
  })
  
  // Tagline with spring
  const taglineOpacity = interpolate(frame, [1.5 * fps, 2.17 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const taglineY = spring({
    frame: frame - 1.5 * fps,
    fps,
    config: springConfigs.smooth
  })
  
  // Particle burst
  const burstProgress = interpolate(frame, [0.33 * fps, 1.67 * fps], [0, 1], { 
    extrapolateLeft: 'clamp', 
    extrapolateRight: 'clamp' 
  })

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <GridBackground opacity={0.02 * revealProgress} />
      <ParticleField count={40} />
      
      <GlowOrb x="30%" y="40%" size={800} color={colors.emerald} opacity={0.2 * glowIntensity} pulse />
      <GlowOrb x="70%" y="60%" size={600} color={colors.cyan} opacity={0.15 * glowIntensity} pulse />
      <GlowOrb x="50%" y="50%" size={400} color={colors.violet} opacity={0.1 * glowIntensity} />
      
      {/* Particle burst from center */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const distance = burstProgress * 400
        const x = 960 + Math.cos(angle) * distance
        const y = 540 + Math.sin(angle) * distance
        const burstOpacity = interpolate(burstProgress, [0, 0.3, 1], [0, 1, 0])
        
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: i % 2 === 0 ? colors.emeraldGlow : colors.cyanGlow,
            opacity: burstOpacity,
            boxShadow: `0 0 10px ${i % 2 === 0 ? colors.emerald : colors.cyan}`,
          }} />
        )
      })}

      {/* Logo Container */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${Math.max(0, logoScale)})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: -20,
            borderRadius: 50,
            border: `2px solid ${colors.emeraldGlow}`,
            opacity: glowIntensity * 0.5,
            boxShadow: `0 0 40px ${colors.emerald}40, inset 0 0 40px ${colors.emerald}20`,
          }} />
          
          <div style={{
            width: 140,
            height: 140,
            borderRadius: 36,
            background: `linear-gradient(135deg, ${colors.emeraldGlow}, ${colors.cyan})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 ${80 * glowIntensity}px ${colors.emerald}60, 0 20px 60px -20px rgba(0,0,0,0.5)`,
          }}>
            <Shield style={{ width: 72, height: 72, color: colors.bg }} />
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          opacity: taglineOpacity,
          transform: `translateY(${interpolate(taglineY, [0, 1], [30, 0])}px)`,
        }}>
          <h1 style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            color: colors.text,
            margin: 0,
            fontFamily: 'Inter, system-ui, sans-serif',
            textShadow: `0 0 60px ${colors.emerald}40`,
          }}>
            SPECTRE
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginTop: 16,
          }}>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${colors.emeraldGlow})` }} />
            <p style={{
              fontSize: 18,
              color: colors.muted,
              letterSpacing: '0.3em',
              fontFamily: 'Inter, system-ui, sans-serif',
              margin: 0,
            }}>
              THE OPERATIVE PROTOCOL
            </p>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${colors.emeraldGlow}, transparent)` }} />
          </div>
        </div>
      </div>
      
      <ScanLines />
    </AbsoluteFill>
  )
}

// ============================================================================
// SCENE 2: THE PROBLEM (3.17s = 95 frames)
// ============================================================================
function ProblemScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const titleScale = spring({ frame, fps, config: springConfigs.snappy })
  const titleOpacity = interpolate(frame, [0, 0.67 * fps], [0, 1], {
    extrapolateRight: 'clamp'
  })
  
  // Glitch effect - deterministic based on frame
  const glitchOffset = frame % 60 < 3 ? Math.sin(frame * 123.456) * 4 : 0

  const problems = [
    { icon: '⚠️', text: 'Scattered goals across apps', delay: 0.83 * fps },
    { icon: '📉', text: 'Progress impossible to track', delay: 1.33 * fps },
    { icon: '🔄', text: 'Starting over every Monday', delay: 1.83 * fps },
    { icon: '😤', text: 'Discipline without direction', delay: 2.33 * fps },
  ]

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <GlowOrb x="50%" y="30%" size={1000} color={colors.red} opacity={0.15} blur={150} pulse />
      <GridBackground opacity={0.015} />
      
      {frame % 45 < 2 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 30%, rgba(239,68,68,0.03) 50%, transparent 70%)`,
          transform: `translateX(${Math.sin(frame * 7.89) * 20}px)`,
        }} />
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 80,
      }}>
        <div style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale}) translateX(${glitchOffset}px)`,
          marginBottom: 60,
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: 18,
            color: colors.red,
            letterSpacing: '0.3em',
            fontFamily: 'Inter, system-ui, sans-serif',
            textTransform: 'uppercase',
          }}>
            The Problem
          </span>
          <h2 style={{
            fontSize: 72,
            fontWeight: 900,
            color: colors.text,
            margin: '12px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            You're fighting{' '}
            <span style={{ color: colors.red }}>blind.</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 700 }}>
          {problems.map((problem, i) => {
            // Use spring with delay for staggered entrance (timing.md pattern)
            const cardSpring = spring({
              frame: frame - problem.delay,
              fps,
              config: springConfigs.smooth
            })
            const cardOpacity = interpolate(frame, [problem.delay, problem.delay + 0.4 * fps], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp'
            })
            const slideDirection = i % 2 === 0 ? -60 : 60
            const slideX = interpolate(cardSpring, [0, 1], [slideDirection, 0])
            
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '20px 28px',
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 16,
                  opacity: cardOpacity,
                  transform: `translateX(${slideX}px)`,
                }}
              >
                <span style={{ fontSize: 28 }}>{problem.icon}</span>
                <span style={{
                  fontSize: 22,
                  color: colors.text,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 500,
                }}>
                  {problem.text}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      
      <ScanLines />
    </AbsoluteFill>
  )
}

// ============================================================================
// SCENE 3: THE TRANSFORMATION (2.67s = 80 frames)
// ============================================================================
function TransformationScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const line1Scale = spring({ frame, fps, config: springConfigs.snappy })
  const line1Opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp'
  })
  
  const line2Spring = spring({
    frame: frame - 0.83 * fps,
    fps,
    config: springConfigs.smooth
  })
  const line2Opacity = interpolate(frame, [0.83 * fps, 1.33 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  
  // Energy ring burst
  const energyRing = interpolate(frame, [1.33 * fps, 2.67 * fps], [0, 600], { 
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp' 
  })
  const energyOpacity = interpolate(frame, [1.33 * fps, 2.67 * fps], [0.8, 0], { 
    extrapolateRight: 'clamp' 
  })

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <GridBackground opacity={0.025} />
      <ParticleField count={50} />
      
      <GlowOrb x="50%" y="50%" size={800} color={colors.emerald} opacity={0.25} pulse />
      <GlowOrb x="30%" y="70%" size={400} color={colors.cyan} opacity={0.15} pulse />
      <GlowOrb x="70%" y="30%" size={400} color={colors.violet} opacity={0.1} />
      
      {/* Energy ring */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: energyRing,
        height: energyRing,
        border: `2px solid ${colors.emeraldGlow}`,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: energyOpacity,
        boxShadow: `0 0 30px ${colors.emerald}`,
      }} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}>
        <div style={{
          opacity: line1Opacity,
          transform: `scale(${line1Scale})`,
        }}>
          <span style={{
            fontSize: 24,
            color: colors.emeraldGlow,
            letterSpacing: '0.3em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            INTRODUCING
          </span>
        </div>
        
        <div style={{
          opacity: line2Opacity,
          transform: `translateY(${interpolate(line2Spring, [0, 1], [50, 0])}px)`,
          marginTop: 24,
        }}>
          <h2 style={{
            fontSize: 120,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${colors.emeraldGlow}, ${colors.cyan})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Inter, system-ui, sans-serif',
            margin: 0,
            letterSpacing: '-0.04em',
          }}>
            SPECTRE
          </h2>
          <p style={{
            fontSize: 28,
            color: colors.muted,
            marginTop: 16,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Your personal operative command center
          </p>
        </div>
      </div>
      
      <ScanLines />
    </AbsoluteFill>
  )
}

// ============================================================================
// SCENE 4: THE ARSENAL (4s = 120 frames)
// ============================================================================
function ArsenalScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp'
  })
  const titleScale = spring({ frame, fps, config: springConfigs.snappy })
  
  const features = [
    { icon: Target, label: 'Mission Control', color: colors.amber, delay: 0.67 * fps },
    { icon: Dumbbell, label: 'Physical Vault', color: colors.red, delay: 1 * fps },
    { icon: Brain, label: 'Skill Matrix', color: colors.violet, delay: 1.33 * fps },
    { icon: Lock, label: 'Sovereignty Framework', color: colors.cyan, delay: 1.67 * fps },
    { icon: BookOpen, label: 'Intel Library', color: colors.emeraldGlow, delay: 2 * fps },
    { icon: Award, label: 'Achievements', color: colors.amber, delay: 2.33 * fps },
  ]

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <GridBackground opacity={0.02} />
      <ParticleField count={30} />
      
      <GlowOrb x="20%" y="80%" size={500} color={colors.emerald} opacity={0.15} />
      <GlowOrb x="80%" y="20%" size={500} color={colors.cyan} opacity={0.15} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 60,
      }}>
        <div style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          marginBottom: 60,
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: 18,
            color: colors.emeraldGlow,
            letterSpacing: '0.3em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            COMPLETE SYSTEM
          </span>
          <h2 style={{
            fontSize: 64,
            fontWeight: 900,
            color: colors.text,
            margin: '16px 0 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            The Arsenal
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          maxWidth: 1000,
        }}>
          {features.map((feature, i) => {
            const Icon = feature.icon
            // Staggered bars pattern from charts.md
            const cardSpring = spring({
              frame: frame - feature.delay,
              fps,
              config: springConfigs.bouncy
            })
            const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1])
            const cardOpacity = interpolate(frame, [feature.delay, feature.delay + 0.5 * fps], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp'
            })
            
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  padding: '32px 24px',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 20,
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                }}
              >
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: `${feature.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon style={{ width: 32, height: 32, color: feature.color }} />
                </div>
                <span style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.text,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}>
                  {feature.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      
      <ScanLines />
    </AbsoluteFill>
  )
}

// ============================================================================
// SCENE 5: DASHBOARD REVEAL (5s = 150 frames)
// ============================================================================
function DashboardReveal() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const dashboardScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 }
  })
  const dashboardOpacity = interpolate(frame, [0, 0.67 * fps], [0, 1], {
    extrapolateRight: 'clamp'
  })
  
  // Animated stats (count-up pattern)
  const daysProgress = interpolate(frame, [1 * fps, 2.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const daysValue = Math.floor(47 * daysProgress)
  
  const powerProgress = interpolate(frame, [1.33 * fps, 2.83 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  const powerValue = Math.floor(87 * powerProgress)
  
  // Sidebar items stagger
  const sidebarItems = ['Dashboard', 'Physical', 'Academy', 'Sovereignty', 'Intel', 'Missions', 'Analytics']
  
  // Protocol checkboxes
  const protocols = [
    { name: 'Morning Training', checked: true, delay: 2 * fps },
    { name: 'Deep Work Block', checked: true, delay: 2.33 * fps },
    { name: 'Skill Practice', checked: false, delay: 2.67 * fps },
    { name: 'Evening Review', checked: false, delay: 3 * fps },
  ]

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <GridBackground opacity={0.015} />
      
      <GlowOrb x="50%" y="50%" size={1200} color={colors.emerald} opacity={0.1} blur={200} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 60,
      }}>
        <div style={{
          opacity: dashboardOpacity,
          transform: `scale(${interpolate(dashboardScale, [0, 1], [0.9, 1])}) perspective(2000px) rotateY(${interpolate(dashboardScale, [0, 1], [15, 0])}deg)`,
          width: 1400,
        }}>
          <GlowBorder>
            <div style={{
              display: 'flex',
              minHeight: 650,
            }}>
              {/* Sidebar */}
              <div style={{
                width: 220,
                background: colors.bgAlt,
                borderRight: `1px solid ${colors.border}`,
                padding: 24,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 32,
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${colors.emeraldGlow}, ${colors.cyan})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Shield style={{ width: 22, height: 22, color: colors.bg }} />
                  </div>
                  <span style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: colors.text,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                    SPECTRE
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {sidebarItems.map((item, i) => {
                    const itemDelay = 0.67 * fps + i * 0.1 * fps
                    const itemSpring = spring({
                      frame: frame - itemDelay,
                      fps,
                      config: springConfigs.smooth
                    })
                    const isActive = i === 0
                    
                    return (
                      <div
                        key={item}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 10,
                          background: isActive ? `${colors.emerald}15` : 'transparent',
                          color: isActive ? colors.emeraldGlow : colors.muted,
                          fontSize: 14,
                          fontWeight: 500,
                          fontFamily: 'Inter, system-ui, sans-serif',
                          opacity: interpolate(itemSpring, [0, 1], [0, 1]),
                          transform: `translateX(${interpolate(itemSpring, [0, 1], [-20, 0])}px)`,
                        }}
                      >
                        {item}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Main Content */}
              <div style={{ flex: 1, padding: 32 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 32,
                }}>
                  <div>
                    <h3 style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: colors.text,
                      margin: 0,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}>
                      Good Morning, Operative
                    </h3>
                    <p style={{
                      fontSize: 14,
                      color: colors.muted,
                      marginTop: 4,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}>
                      Day {daysValue} of 180 • Phase 1: Foundation
                    </p>
                  </div>
                  
                  {/* Power Ring - Pie chart pattern from charts.md */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    <div style={{ position: 'relative', width: 100, height: 100 }}>
                      <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                          cx={50}
                          cy={50}
                          r={40}
                          fill="none"
                          stroke={colors.border}
                          strokeWidth={8}
                        />
                        <circle
                          cx={50}
                          cy={50}
                          r={40}
                          fill="none"
                          stroke="url(#powerGradient)"
                          strokeWidth={8}
                          strokeLinecap="round"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 * (1 - powerProgress)}
                        />
                        <defs>
                          <linearGradient id="powerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={colors.emeraldGlow} />
                            <stop offset="100%" stopColor={colors.cyan} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{ 
                          fontSize: 24, 
                          fontWeight: 900, 
                          color: colors.text, 
                          fontFamily: 'Inter, system-ui, sans-serif' 
                        }}>
                          {powerValue}%
                        </span>
                      </div>
                    </div>
                    <span style={{ 
                      color: colors.muted, 
                      fontSize: 12, 
                      marginTop: 8, 
                      fontFamily: 'Inter, system-ui, sans-serif' 
                    }}>
                      Readiness
                    </span>
                  </div>
                </div>
                
                {/* Daily Protocols */}
                <div style={{
                  background: colors.card,
                  borderRadius: 16,
                  padding: 24,
                  border: `1px solid ${colors.border}`,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 20,
                  }}>
                    <Zap style={{ width: 20, height: 20, color: colors.amber }} />
                    <span style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: colors.text,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}>
                      Daily Protocols
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {protocols.map((protocol, i) => {
                      const checkSpring = spring({
                        frame: frame - protocol.delay,
                        fps,
                        config: springConfigs.bouncy
                      })
                      const checkOpacity = interpolate(checkSpring, [0, 1], [0, 1])
                      
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '14px 16px',
                            background: protocol.checked ? `${colors.emerald}10` : colors.surface,
                            borderRadius: 10,
                            border: `1px solid ${protocol.checked ? `${colors.emerald}30` : colors.border}`,
                            opacity: checkOpacity,
                            transform: `translateX(${interpolate(checkSpring, [0, 1], [20, 0])}px)`,
                          }}
                        >
                          <div style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: protocol.checked ? colors.emerald : 'transparent',
                            border: `2px solid ${protocol.checked ? colors.emerald : colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {protocol.checked && (
                              <CheckCircle2 style={{ width: 14, height: 14, color: colors.bg }} />
                            )}
                          </div>
                          <span style={{
                            fontSize: 14,
                            color: protocol.checked ? colors.emeraldGlow : colors.text,
                            fontFamily: 'Inter, system-ui, sans-serif',
                            textDecoration: protocol.checked ? 'line-through' : 'none',
                            opacity: protocol.checked ? 0.8 : 1,
                          }}>
                            {protocol.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </GlowBorder>
        </div>
      </div>
      
      <ScanLines />
    </AbsoluteFill>
  )
}

// ============================================================================
// SCENE 6: FINAL CTA (3.5s = 105 frames)
// ============================================================================
function FinalCTA() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  
  const textSpring = spring({ frame, fps, config: springConfigs.smooth })
  const textOpacity = interpolate(frame, [0, 0.67 * fps], [0, 1], {
    extrapolateRight: 'clamp'
  })
  
  const btnSpring = spring({
    frame: frame - 1.17 * fps,
    fps,
    config: springConfigs.bouncy
  })
  const btnOpacity = interpolate(frame, [1.17 * fps, 1.67 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })
  
  const pulseRing = Math.sin(frame * 0.08) * 10 + 50
  const bgRotation = frame * 0.5

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <GridBackground opacity={0.025} />
      <ParticleField count={60} />
      
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `conic-gradient(from ${bgRotation}deg at 50% 120%, ${colors.emerald}20, transparent, ${colors.cyan}15, transparent, ${colors.violet}10, transparent)`,
        opacity: 0.5,
      }} />
      
      <GlowOrb x="50%" y="70%" size={1000} color={colors.emerald} opacity={0.25} blur={150} pulse />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}>
        <div style={{
          opacity: textOpacity,
          transform: `translateY(${interpolate(textSpring, [0, 1], [60, 0])}px)`,
        }}>
          <h2 style={{
            fontSize: 88,
            fontWeight: 900,
            color: colors.text,
            fontFamily: 'Inter, system-ui, sans-serif',
            margin: 0,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
          }}>
            Become
          </h2>
          <h2 style={{
            fontSize: 88,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${colors.emeraldGlow}, ${colors.cyan})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Inter, system-ui, sans-serif',
            margin: 0,
            letterSpacing: '-0.04em',
          }}>
            Operational.
          </h2>
          <p style={{
            fontSize: 24,
            color: colors.muted,
            marginTop: 24,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Start the 180-day protocol. Free forever.
          </p>
        </div>

        <div style={{
          marginTop: 48,
          opacity: btnOpacity,
          transform: `scale(${interpolate(btnSpring, [0, 1], [0.8, 1])})`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            inset: -20,
            borderRadius: 60,
            background: colors.emerald,
            filter: `blur(${pulseRing}px)`,
            opacity: 0.3,
          }} />
          
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: `linear-gradient(135deg, ${colors.emeraldGlow}, ${colors.cyan})`,
            color: colors.bg,
            fontSize: 24,
            fontWeight: 800,
            padding: '24px 56px',
            borderRadius: 60,
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: `0 20px 60px -20px ${colors.emerald}80`,
          }}>
            Start Now — It's Free
            <ChevronRight style={{ width: 28, height: 28 }} />
          </div>
        </div>
      </div>
      
      <ScanLines />
    </AbsoluteFill>
  )
}

// ============================================================================
// MAIN COMPOSITION - Using Series for sequential playback (sequencing.md)
// ============================================================================
export function SpectreDemo() {
  const { fps } = useVideoConfig()
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Series>
        {/* Scene 1: Cinematic Logo Intro - 2.67s */}
        <Series.Sequence durationInFrames={Math.round(2.67 * fps)}>
          <CinematicIntro />
        </Series.Sequence>
        
        {/* Scene 2: The Problem - 3.17s */}
        <Series.Sequence durationInFrames={Math.round(3.17 * fps)}>
          <ProblemScene />
        </Series.Sequence>
        
        {/* Scene 3: The Transformation - 2.67s */}
        <Series.Sequence durationInFrames={Math.round(2.67 * fps)}>
          <TransformationScene />
        </Series.Sequence>
        
        {/* Scene 4: The Arsenal - 4s */}
        <Series.Sequence durationInFrames={Math.round(4 * fps)}>
          <ArsenalScene />
        </Series.Sequence>
        
        {/* Scene 5: Dashboard Reveal - 5s */}
        <Series.Sequence durationInFrames={Math.round(5 * fps)}>
          <DashboardReveal />
        </Series.Sequence>
        
        {/* Scene 6: Final CTA - 3.5s */}
        <Series.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <FinalCTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  )
}

export default SpectreDemo
