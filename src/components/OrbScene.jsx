import { useEffect, useRef } from 'react'
import styles from './OrbScene.module.css'

export default function OrbScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    function drawParticleRing(cx, cy, radius, count, phase, color, size) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + phase + t * 0.002
        const wobble = Math.sin(t * 0.01 + i) * 4
        const x = cx + Math.cos(angle) * (radius + wobble)
        const y = cy + Math.sin(angle) * (radius + wobble) * 0.35
        const opacity = 0.3 + 0.7 * ((Math.sin(angle + t * 0.003) + 1) / 2)
        const s = size * (0.6 + 0.4 * opacity)

        ctx.beginPath()
        ctx.arc(x, y, s, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(')', `, ${opacity})`)
          .replace('rgb(', 'rgba(')
          .replace('hsl(', 'hsla(')
        ctx.fill()
      }
    }

    function drawConnectionLine(x1, y1, x2, y2, alpha) {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2)
      grad.addColorStop(0, `rgba(0, 212, 255, ${alpha * 0.6})`)
      grad.addColorStop(0.5, `rgba(123, 97, 255, ${alpha})`)
      grad.addColorStop(1, `rgba(0, 212, 255, ${alpha * 0.6})`)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = grad
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    function drawOrb() {
      const cx = W() / 2
      const cy = H() / 2

      ctx.clearRect(0, 0, W(), H())

      // Outer ambient glow
      const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220)
      outerGlow.addColorStop(0, 'rgba(0, 212, 255, 0.08)')
      outerGlow.addColorStop(0.5, 'rgba(123, 97, 255, 0.05)')
      outerGlow.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(cx, cy, 220, 0, Math.PI * 2)
      ctx.fillStyle = outerGlow
      ctx.fill()

      // Particle rings (3D perspective illusion)
      drawParticleRing(cx, cy, 160, 48, 0, 'rgba(0, 212, 255', 1.5)
      drawParticleRing(cx, cy, 120, 36, Math.PI / 3, 'rgba(123, 97, 255', 2)
      drawParticleRing(cx, cy, 80, 24, Math.PI * 0.7, 'rgba(0, 255, 136', 1.5)

      // Connection lines between random ring points
      const nodes = []
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.002
        nodes.push({
          x: cx + Math.cos(angle) * 120,
          y: cy + Math.sin(angle) * 42
        })
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.random() > 0.7) continue
          const alpha = 0.08 + 0.04 * Math.sin(t * 0.005 + i + j)
          drawConnectionLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, alpha)
        }
      }

      // Core sphere
      const coreGrad = ctx.createRadialGradient(cx - 12, cy - 12, 4, cx, cy, 52)
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
      coreGrad.addColorStop(0.2, 'rgba(0, 212, 255, 0.9)')
      coreGrad.addColorStop(0.6, 'rgba(123, 97, 255, 0.7)')
      coreGrad.addColorStop(1, 'rgba(0, 8, 24, 0.3)')
      ctx.beginPath()
      ctx.arc(cx, cy, 52, 0, Math.PI * 2)
      ctx.fillStyle = coreGrad
      ctx.fill()

      // Core glow pulse
      const pulseAlpha = 0.2 + 0.15 * Math.sin(t * 0.04)
      const pulseGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 90)
      pulseGrad.addColorStop(0, `rgba(0, 212, 255, ${pulseAlpha})`)
      pulseGrad.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(cx, cy, 90, 0, Math.PI * 2)
      ctx.fillStyle = pulseGrad
      ctx.fill()

      // Specular highlight
      const specGrad = ctx.createRadialGradient(cx - 16, cy - 16, 0, cx - 16, cy - 16, 20)
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
      specGrad.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(cx - 16, cy - 16, 20, 0, Math.PI * 2)
      ctx.fillStyle = specGrad
      ctx.fill()

      // Floating data nodes
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 + t * 0.008
        const r = 175 + Math.sin(t * 0.02 + i * 1.3) * 10
        const nx = cx + Math.cos(angle) * r
        const ny = cy + Math.sin(angle) * r * 0.4
        const nodeAlpha = 0.5 + 0.5 * Math.sin(t * 0.03 + i)
        ctx.beginPath()
        ctx.arc(nx, ny, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${nodeAlpha})`
        ctx.fill()
        // Line to core
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = `rgba(0, 212, 255, ${nodeAlpha * 0.15})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      t++
    }

    function loop() {
      drawOrb()
      animId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={styles.orbWrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
